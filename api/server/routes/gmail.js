const { encrypt, decrypt } = require('../encryption');
const { requireUser } = require('../auth/supabaseAuth');
const { refreshAccessToken } = require('../google/oauth');
const {
  listMessages,
  getMessageMetadata
} = require('../google/gmail');

const STATUS_MAP = {
  NONE: 'NONE',
  READ: 'READ'
};



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

function registerGmailRoutes(app, supabase) {
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
