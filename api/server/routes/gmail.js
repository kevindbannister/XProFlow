const { encrypt, decrypt } = require('../encryption');
const { requireUser } = require('../auth/supabaseAuth');
const { refreshAccessToken } = require('../google/oauth');
const {
  listMessages,
  getMessageMetadata,
  getGmailClient
} = require('../google/gmail');
const { ensureLabelExists } = require('../google/labels');
const { requireInternalApiAuth } = require('../middleware/internalApiAuth');

const STATUS_MAP = {
  NONE: 'NONE',
  READ: 'READ'
};

const MESSAGE_FETCH_BATCH_SIZE = 10;

function parseFromHeader(fromHeader) {
  if (!fromHeader) {
    return { name: null, email: null };
  }

  const match = fromHeader.match(/(.*)<(.+)>/);
  if (!match) {
    return { name: null, email: fromHeader.trim() };
  }

  const name = match[1].replace(/\"/g, '').trim();
  const email = match[2].trim();
  return {
    name: name || null,
    email: email || null
  };
}

function normalizeMessage(message, folder) {
  const headers = message.payload?.headers || [];
  const fromHeader = headers.find((header) => header.name === 'From')?.value;
  const subjectHeader = headers.find((header) => header.name === 'Subject')?.value;
  const dateHeader = headers.find((header) => header.name === 'Date')?.value;
  const from = parseFromHeader(fromHeader);
  const internalDate = message.internalDate ? Number(message.internalDate) : null;
  const receivedAt = internalDate
    ? new Date(internalDate).toISOString()
    : dateHeader
      ? new Date(dateHeader).toISOString()
      : null;
  const isUnread = (message.labelIds || []).includes('UNREAD');

  return {
    provider: 'gmail',
    external_id: message.id,
    thread_id: message.threadId || null,
    folder,
    from_name: from.name,
    from_email: from.email,
    subject: subjectHeader || null,
    snippet: message.snippet || null,
    internal_date: internalDate,
    received_at: receivedAt,
    is_unread: isUnread,
    status: isUnread ? STATUS_MAP.NONE : STATUS_MAP.READ
  };
}

async function getStoredAccount(supabase, userId, email) {
  let query = supabase.from('gmail_accounts').select('*').eq('user_id', userId);
  if (email) {
    query = query.eq('email', email);
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(1);

  if (error) {
    throw error;
  }

  return Array.isArray(data) ? data[0] || null : null;
}

async function upsertAccount(supabase, account) {
  const { error } = await supabase.from('gmail_accounts').upsert(account, {
    onConflict: 'user_id,email'
  });

  if (error) {
    throw error;
  }
}

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function getHeaderValue(headers, name) {
  return headers.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value || null;
}

function decodeBase64Url(value) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function extractTextPlainBody(payload) {
  if (!payload) {
    return null;
  }

  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  if (!Array.isArray(payload.parts)) {
    return null;
  }

  for (const part of payload.parts) {
    const text = extractTextPlainBody(part);
    if (text) {
      return text;
    }
  }

  return null;
}

function normalizeGmailMessage(account, message) {
  const headers = message.payload?.headers || [];
  const internalDate = message.internalDate ? Number(message.internalDate) : null;

  return {
    connected_account_id: account.id,
    gmail_message_id: message.id,
    thread_id: message.threadId || null,
    provider: 'gmail',
    subject: getHeaderValue(headers, 'Subject'),
    from_email: getHeaderValue(headers, 'From'),
    snippet: message.snippet || null,
    body_text: extractTextPlainBody(message.payload),
    internal_date: internalDate,
    label_ids: Array.isArray(message.labelIds) ? message.labelIds : []
  };
}

function resolveExpiryDate(credentials) {
  if (credentials?.expiry_date) {
    const parsed = new Date(credentials.expiry_date);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date(Date.now() + 3600 * 1000).toISOString();
}

function isTokenExpired(tokenExpiresAt) {
  const expiry = new Date(tokenExpiresAt).getTime();
  return Number.isNaN(expiry) || expiry <= Date.now();
}

async function logGmailAction(supabase, action) {
  try {
    const { error } = await supabase.from('gmail_actions').insert(action);
    if (error) {
      console.error('[WARN][MOVE] Failed to write gmail_actions log:', error);
    }
  } catch (error) {
    console.error('[WARN][MOVE] Unexpected gmail_actions logging error:', error);
  }
}

async function refreshAccountAccessToken(supabase, account) {
  if (!account.access_token_encrypted) {
    return null;
  }

  let accessToken = decrypt(account.access_token_encrypted);
  if (!isTokenExpired(account.token_expires_at)) {
    return accessToken;
  }

  if (!account.refresh_token_encrypted) {
    return null;
  }

  const refreshToken = decrypt(account.refresh_token_encrypted);
  const { credentials } = await refreshAccessToken(refreshToken);
  if (!credentials?.access_token) {
    return null;
  }

  accessToken = credentials.access_token;
  const { error: updateTokenError } = await supabase
    .from('connected_accounts')
    .update({
      access_token_encrypted: encrypt(accessToken),
      refresh_token_encrypted: credentials.refresh_token
        ? encrypt(credentials.refresh_token)
        : account.refresh_token_encrypted,
      token_expires_at: resolveExpiryDate(credentials)
    })
    .eq('id', account.id);

  if (updateTokenError) {
    throw updateTokenError;
  }

  return accessToken;
}

async function fetchAndUpsertInboxMessages({ gmail, account, messageRefs, supabase }) {
  if (!Array.isArray(messageRefs) || messageRefs.length === 0) {
    return 0;
  }

  let fetchedCount = 0;

  for (const messageBatch of chunk(messageRefs, MESSAGE_FETCH_BATCH_SIZE)) {
    const results = await Promise.allSettled(
      messageBatch.map((message) =>
        gmail.users.messages.get({
          userId: 'me',
          id: message.id
        })
      )
    );

    const fullMessages = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        if (result.value?.data) {
          fullMessages.push(result.value.data);
        }
      } else {
        console.error('Gmail message fetch error:', result.reason?.response?.data || result.reason);
      }
    }

    const data = fullMessages.map((message) => normalizeGmailMessage(account, message));
    if (data.length === 0) {
      continue;
    }

    const { error: insertError } = await supabase
      .from('gmail_messages_inbox')
      .upsert(data, { onConflict: 'connected_account_id,gmail_message_id' });

    if (insertError) {
      throw insertError;
    }

    fetchedCount += data.length;
  }

  return fetchedCount;
}

function registerGmailRoutes(app, supabase) {
  app.post('/api/gmail/move', requireInternalApiAuth, async (req, res) => {
    const {
      connected_account_id: connectedAccountId,
      gmail_message_id: gmailMessageId,
      label
    } = req.body || {};

    try {
      if (!connectedAccountId || !gmailMessageId || !label) {
        res.status(400).json({ error: 'connected_account_id, gmail_message_id, and label are required' });
        return;
      }

      const { data: account, error: accountError } = await supabase
        .from('connected_accounts')
        .select('id,access_token_encrypted,refresh_token_encrypted,token_expires_at')
        .eq('id', connectedAccountId)
        .eq('provider', 'google')
        .maybeSingle();

      if (accountError) {
        throw accountError;
      }

      if (!account || !account.access_token_encrypted) {
        res.status(404).json({ error: 'Connected account not found' });
        return;
      }

      let accessToken = decrypt(account.access_token_encrypted);
      if (isTokenExpired(account.token_expires_at)) {
        if (!account.refresh_token_encrypted) {
          res.status(400).json({ error: 'Connected account is missing refresh token' });
          return;
        }

        const refreshToken = decrypt(account.refresh_token_encrypted);
        const { credentials } = await refreshAccessToken(refreshToken);
        if (!credentials?.access_token) {
          res.status(500).json({ error: 'Failed to refresh access token' });
          return;
        }

        accessToken = credentials.access_token;

        const { error: updateTokenError } = await supabase
          .from('connected_accounts')
          .update({
            access_token_encrypted: encrypt(accessToken),
            refresh_token_encrypted: credentials.refresh_token
              ? encrypt(credentials.refresh_token)
              : account.refresh_token_encrypted,
            token_expires_at: resolveExpiryDate(credentials)
          })
          .eq('id', account.id);

        if (updateTokenError) {
          throw updateTokenError;
        }
      }

      console.log('[DEBUG][MOVE] connected_account_id:', connectedAccountId);
      console.log('[DEBUG][MOVE] gmail_message_id:', gmailMessageId);
      console.log('[DEBUG][MOVE] label_name:', label);

      const gmail = getGmailClient(accessToken);
      const labelId = await ensureLabelExists(gmail, connectedAccountId, label, supabase);
      console.log('[DEBUG][MOVE] resolved_label_id:', labelId);

      try {
        await gmail.users.messages.modify({
          userId: 'me',
          id: gmailMessageId,
          requestBody: {
            addLabelIds: [labelId],
            removeLabelIds: ['INBOX']
          }
        });
      } catch (err) {
        console.error('[DEBUG][MOVE] MESSAGE MODIFY ERROR:', err?.response?.data || err);
        throw err;
      }

      const moveTimestamp = new Date().toISOString();
      const { error: inboxUpdateError } = await supabase
        .from('gmail_messages_inbox')
        .update({
          processed: true,
          moved_to_label: label,
          moved_at: moveTimestamp,
          last_seen_at: moveTimestamp
        })
        .eq('connected_account_id', connectedAccountId)
        .eq('gmail_message_id', gmailMessageId);

      if (inboxUpdateError) {
        throw inboxUpdateError;
      }

      await logGmailAction(supabase, {
        connected_account_id: connectedAccountId,
        gmail_message_id: gmailMessageId,
        action_type: 'MOVE_LABEL',
        status: 'success'
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Gmail move route error', error);

      if (connectedAccountId && gmailMessageId) {
        await logGmailAction(supabase, {
          connected_account_id: connectedAccountId,
          gmail_message_id: gmailMessageId,
          action_type: 'MOVE_LABEL',
          status: 'failed'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to move Gmail message'
      });
    }
  });


  app.get('/api/gmail/fetch-new', requireInternalApiAuth, async (req, res) => {
    try {
      const maxResults = Math.min(
        Math.max(parseInt(req.query.max, 10) || 50, 1),
        200
      );

      const { data: accounts, error: accountsError } = await supabase
        .from('connected_accounts')
        .select('id,provider,access_token_encrypted,refresh_token_encrypted,token_expires_at,last_sync_timestamp')
        .eq('provider', 'google')
        .not('access_token_encrypted', 'is', null);

      if (accountsError) {
        throw accountsError;
      }

      let usersProcessed = 0;
      let messagesFetched = 0;

      for (const account of accounts || []) {
        try {
          usersProcessed += 1;

          const accessToken = await refreshAccountAccessToken(supabase, account);
          if (!accessToken) {
            console.error(`Gmail fetch-new skipped: missing usable token for account ${account.id}`);
            continue;
          }

          const gmail = getGmailClient(accessToken);
          const response = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['INBOX'],
            maxResults
          });

          const messageRefs = response?.data?.messages || [];
          const insertedCount = await fetchAndUpsertInboxMessages({
            gmail,
            account,
            messageRefs,
            supabase
          });

          const { error: syncUpdateError } = await supabase
            .from('connected_accounts')
            .update({ last_sync_timestamp: new Date().toISOString() })
            .eq('id', account.id);

          if (syncUpdateError) {
            throw syncUpdateError;
          }

          messagesFetched += insertedCount;
        } catch (accountError) {
          console.error(
            `Gmail fetch-new error for account ${account.id}:`,
            accountError?.response?.data || accountError
          );
        }
      }

      res.json({ users_processed: usersProcessed, messages_fetched: messagesFetched });
    } catch (error) {
      console.error('Gmail fetch-new error:', error);
      res.status(500).json({ error: 'Failed to fetch new Gmail messages' });
    }
  });

  app.post('/api/gmail/import-inbox', requireInternalApiAuth, async (req, res) => {
    try {
      const { data: accounts, error: accountsError } = await supabase
        .from('connected_accounts')
        .select('id,provider,access_token_encrypted,refresh_token_encrypted,token_expires_at')
        .eq('provider', 'google')
        .not('access_token_encrypted', 'is', null);

      if (accountsError) {
        throw accountsError;
      }

      let usersProcessed = 0;
      let messagesImported = 0;

      for (const account of accounts || []) {
        try {
          usersProcessed += 1;

          const accessToken = await refreshAccountAccessToken(supabase, account);
          if (!accessToken) {
            console.error(`Gmail import-inbox skipped: missing usable token for account ${account.id}`);
            continue;
          }

          const gmail = getGmailClient(accessToken);
          let pageToken;

          do {
            const response = await gmail.users.messages.list({
              userId: 'me',
              labelIds: ['INBOX'],
              maxResults: 200,
              pageToken
            });

            const messageRefs = response?.data?.messages || [];

            messagesImported += await fetchAndUpsertInboxMessages({
              gmail,
              account,
              messageRefs,
              supabase
            });

            pageToken = response?.data?.nextPageToken;
          } while (pageToken);
        } catch (accountError) {
          console.error(
            `Gmail import-inbox error for account ${account.id}:`,
            accountError?.response?.data || accountError
          );
        }
      }

      res.json({ users_processed: usersProcessed, messages_imported: messagesImported });
    } catch (error) {
      console.error('Gmail import-inbox error:', error);
      res.status(500).json({ error: 'Failed to import Gmail inbox' });
    }
  });

  app.get('/api/gmail/status', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) {
        return;
      }

      const account = await getStoredAccount(supabase, user.id);
      if (!account) {
        res.json({ connected: false });
        return;
      }

      res.json({ connected: true, email: account.email });
    } catch (error) {
      console.error('Gmail status error:', error);
      res.status(500).json({ error: 'Failed to fetch Gmail status' });
    }
  });


  app.post('/api/gmail/sync', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) {
        return;
      }

      const folder = String(req.query.folder || 'INBOX');
      const account = await getStoredAccount(supabase, user.id);
      if (!account) {
        res.status(404).json({ error: 'No Gmail account connected' });
        return;
      }

      let accessToken = decrypt(account.access_token);
      const refreshToken = decrypt(account.refresh_token);
      const expiry = new Date(account.expiry_ts).getTime();
      if (Number.isNaN(expiry) || expiry <= Date.now()) {
        const { credentials } = await refreshAccessToken(refreshToken);
        if (!credentials.access_token) {
          res.status(500).json({ error: 'Failed to refresh access token' });
          return;
        }
        accessToken = credentials.access_token;
        const nextExpiry = credentials.expiry_date
          ? new Date(credentials.expiry_date).toISOString()
          : new Date(Date.now() + 3600 * 1000).toISOString();
        await upsertAccount(supabase, {
          user_id: user.id,
          email: account.email,
          provider: 'gmail',
          access_token: encrypt(accessToken),
          refresh_token: account.refresh_token,
          expiry_ts: nextExpiry
        });
      }

      const messages = await listMessages(accessToken, folder);
      const metadata = await Promise.all(
        messages.map((message) => getMessageMetadata(accessToken, message.id))
      );

      const normalized = metadata.map((message) => ({
        ...normalizeMessage(message, folder),
        user_id: user.id,
        connected_account_id: account.id,
        gmail_message_id: message.id,
        thread_id: message.threadId || null
      }));

      if (normalized.length > 0) {
        const { error } = await supabase.from('gmail_messages_inbox').upsert(normalized, {
          onConflict: 'connected_account_id,gmail_message_id'
        });
        if (error) {
          throw error;
        }
      }

      const sorted = normalized.sort((a, b) => {
        const aDate = a.internal_date || 0;
        const bDate = b.internal_date || 0;
        return bDate - aDate;
      });

      res.json({ messages: sorted });
    } catch (error) {
      console.error('Gmail sync error:', error);
      res.status(500).json({ error: 'Failed to sync Gmail' });
    }
  });
}

module.exports = { registerGmailRoutes };
