const { encrypt, decrypt } = require('../encryption');
const { requireUser } = require('../auth/supabaseAuth');
const { refreshAccessToken } = require('../google/oauth');
const {
  listMessages,
  getMessageMetadata,
  getGmailClient
} = require('../google/gmail');
const { requireInternalApiAuth } = require('../middleware/internalApiAuth');

const STATUS_MAP = {
  NONE: 'NONE',
  READ: 'READ'
};

const GMAIL_BASE_URL = 'https://gmail.googleapis.com/gmail/v1';

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

async function fetchGmailMessagesList(accessToken, lastSyncTimestamp) {
  const params = new URLSearchParams();
  params.set('q', `after:${lastSyncTimestamp}`);
  params.set('maxResults', '20');

  const response = await fetch(`${GMAIL_BASE_URL}/users/me/messages?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error(`Failed to list Gmail messages: ${response.status}`);
  }

  const data = await response.json();
  return data.messages || [];
}

async function fetchGmailMessageFull(accessToken, messageId) {
  const response = await fetch(
    `${GMAIL_BASE_URL}/users/me/messages/${messageId}?format=full`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Gmail message ${messageId}: ${response.status}`);
  }

  return response.json();
}

function normalizeGmailMessage(account, message) {
  const headers = message.payload?.headers || [];

  return {
    user_id: account.user_id,
    connected_account_id: account.id,
    provider: 'google',
    message_id: message.id,
    thread_id: message.threadId || null,
    snippet: message.snippet || null,
    internal_date: new Date(Number(message.internalDate)).toISOString(),
    subject: getHeaderValue(headers, 'Subject'),
    from_email: getHeaderValue(headers, 'From'),
    body_text: extractTextPlainBody(message.payload)
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

function registerGmailRoutes(app, supabase) {
  app.post('/api/gmail/move', requireInternalApiAuth, async (req, res) => {
    try {
      const {
        connected_account_id: connectedAccountId,
        message_id: messageId,
        label
      } = req.body || {};

      if (!connectedAccountId || !messageId || !label) {
        res.status(400).json({ error: 'connected_account_id, message_id, and label are required' });
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

      console.log('[DEBUG][MOVE] --- MOVE DEBUG ---');
      console.log('[DEBUG][MOVE] Message ID:', messageId);
      console.log('[DEBUG][MOVE] Connected Account ID:', connectedAccountId);
      console.log('[DEBUG][MOVE] Target Label:', label);

      const gmail = getGmailClient(accessToken);
      console.log('[DEBUG][MOVE] Fetching existing labels...');
      const { data: labelsData } = await gmail.users.labels.list({ userId: 'me' });
      let targetLabel = (labelsData.labels || []).find((existingLabel) => existingLabel.name === label);

      if (targetLabel) {
        console.log('[DEBUG][MOVE] Label already exists:', targetLabel?.id);
      } else {
        console.log('[DEBUG][MOVE] Creating new label:', label);
        try {
          const created = await gmail.users.labels.create({
            userId: 'me',
            requestBody: {
              name: label,
              labelListVisibility: 'labelShow',
              messageListVisibility: 'show'
            }
          });
          targetLabel = created.data;
        } catch (err) {
          console.error('[DEBUG][MOVE] LABEL CREATION ERROR:', err?.response?.data || err);
          throw err;
        }
      }

      try {
        await gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          requestBody: {
            addLabelIds: [targetLabel.id],
            removeLabelIds: ['INBOX']
          }
        });
      } catch (err) {
        console.error('[DEBUG][MOVE] MESSAGE MODIFY ERROR:', err?.response?.data || err);
        throw err;
      }

      console.log('[DEBUG][MOVE] Message moved successfully.');
      res.json({ success: true, action: 'move', message_id: messageId });
    } catch (error) {
      console.error('Gmail move route error', error);
      res.status(500).json({
        success: false,
        action: 'move',
        error: error instanceof Error ? error.message : 'Failed to move Gmail message'
      });
    }
  });


  app.get('/api/gmail/fetch-new', requireInternalApiAuth, async (req, res) => {
    try {
      const { data: accounts, error: accountsError } = await supabase
        .from('connected_accounts')
        .select('id,user_id,provider,access_token_encrypted,refresh_token_encrypted,token_expires_at,last_sync_timestamp')
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

          let accessToken = decrypt(account.access_token_encrypted);
          if (isTokenExpired(account.token_expires_at)) {
            if (!account.refresh_token_encrypted) {
              console.error(`Gmail fetch-new skipped: missing refresh token for account ${account.id}`);
              continue;
            }

            const refreshToken = decrypt(account.refresh_token_encrypted);
            const { credentials } = await refreshAccessToken(refreshToken);
            if (!credentials?.access_token) {
              console.error(`Gmail fetch-new skipped: refresh failed for account ${account.id}`);
              continue;
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

          const lastSyncTimestamp = account.last_sync_timestamp
            ? Math.floor(new Date(account.last_sync_timestamp).getTime() / 1000)
            : Math.floor((Date.now() - 24 * 3600 * 1000) / 1000);

          const messageRefs = await fetchGmailMessagesList(accessToken, lastSyncTimestamp);
          if (messageRefs.length === 0) {
            await supabase
              .from('connected_accounts')
              .update({ last_sync_timestamp: new Date().toISOString() })
              .eq('id', account.id);
            continue;
          }

          const fullMessages = [];
          for (const messageBatch of chunk(messageRefs, 5)) {
            const batchData = await Promise.all(
              messageBatch.map((message) => fetchGmailMessageFull(accessToken, message.id))
            );
            fullMessages.push(...batchData);
          }

          const normalizedMessages = fullMessages.map((message) => normalizeGmailMessage(account, message));

          if (normalizedMessages.length > 0) {
            const { error: insertError } = await supabase
              .from('gmail_messages')
              .upsert(normalizedMessages, { onConflict: 'connected_account_id,message_id' });

            if (insertError) {
              throw insertError;
            }
          }

          const { error: syncUpdateError } = await supabase
            .from('connected_accounts')
            .update({ last_sync_timestamp: new Date().toISOString() })
            .eq('id', account.id);

          if (syncUpdateError) {
            throw syncUpdateError;
          }

          messagesFetched += normalizedMessages.length;
        } catch (accountError) {
          console.error(`Gmail fetch-new error for account ${account.id}:`, accountError);
        }
      }

      res.json({ users_processed: usersProcessed, messages_fetched: messagesFetched });
    } catch (error) {
      console.error('Gmail fetch-new error:', error);
      res.status(500).json({ error: 'Failed to fetch new Gmail messages' });
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
        user_id: user.id
      }));

      if (normalized.length > 0) {
        const { error } = await supabase.from('inbox_messages').upsert(normalized, {
          onConflict: 'user_id,provider,external_id'
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
