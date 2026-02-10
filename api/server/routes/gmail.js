const { encrypt, decrypt } = require('../encryption');
const { requireUser } = require('../auth/supabaseAuth');
const {
  generateAuthUrl,
  exchangeCode,
  refreshAccessToken,
  fetchUserInfo
} = require('../google/oauth');
const {
  listMessages,
  getMessageMetadata,
  fetchProfile
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

async function getStoredAccount(supabase, userId) {
  const { data, error } = await supabase
    .from('gmail_accounts')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
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
  const appBaseUrl = process.env.APP_BASE_URL || process.env.FRONTEND_URL || 'http://localhost:5173';

  const handleGmailOAuthStart = async (req, res) => {
    try {
      console.log('Starting Gmail OAuth');
      const user = await requireUser(req, res, supabase);
      if (!user) {
        return;
      }

      const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = process.env;
      const missingVars = [];
      if (!GOOGLE_CLIENT_ID) {
        missingVars.push('GOOGLE_CLIENT_ID');
      }
      if (!GOOGLE_REDIRECT_URI) {
        missingVars.push('GOOGLE_REDIRECT_URI');
      }
      if (missingVars.length > 0) {
        console.error(
          'Gmail OAuth start missing required environment variables:',
          missingVars.join(', ')
        );
        res.status(500).json({
          error: `Missing required Gmail OAuth env vars: ${missingVars.join(', ')}`
        });
        return;
      }

      const googleOAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      googleOAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
      googleOAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
      googleOAuthUrl.searchParams.set('response_type', 'code');
      googleOAuthUrl.searchParams.set(
        'scope',
        [
          'openid',
          'email',
          'profile',
          'https://www.googleapis.com/auth/gmail.readonly'
        ].join(' ')
      );
      googleOAuthUrl.searchParams.set('access_type', 'offline');
      googleOAuthUrl.searchParams.set('prompt', 'consent');
      googleOAuthUrl.searchParams.set('include_granted_scopes', 'true');
      const referer = req.get('referer');
      if (referer) {
        const refererUrl = new URL(referer, appBaseUrl);
        const appOrigin = new URL(appBaseUrl).origin;
        if (refererUrl.origin === appOrigin) {
          const returnTo = `${refererUrl.pathname}${refererUrl.search}`;
          googleOAuthUrl.searchParams.set('state', returnTo);
          console.log('Gmail OAuth return path:', returnTo);
        }
      }

      console.log('Gmail OAuth URL:', googleOAuthUrl.toString());
      res.redirect(googleOAuthUrl.toString());
    } catch (error) {
      console.error('Gmail OAuth start error:', error);
      res.status(500).json({ error: 'Failed to start Gmail OAuth.' });
    }
  };

  app.get('/api/gmail/oauth/start', handleGmailOAuthStart);
  app.get('/gmail/oauth/start', handleGmailOAuthStart);

  app.get('/api/gmail/oauth/callback', async (req, res) => {
    let redirectUrl = new URL('/inbox', appBaseUrl);
    const errorRedirect = new URL('/integrations', appBaseUrl);

    try {
      const user = await requireUser(req, res, supabase);
      if (!user) {
        return;
      }

      const { code } = req.query;
      if (!code) {
        errorRedirect.searchParams.set('error', 'gmail_code');
        res.redirect(errorRedirect.toString());
        return;
      }

      const { tokens } = await exchangeCode(code);
      const accessToken = tokens.access_token;
      if (!accessToken) {
        errorRedirect.searchParams.set('error', 'gmail_access_token');
        res.redirect(errorRedirect.toString());
        return;
      }

      const { emailAddress } = await fetchProfile(accessToken);
      if (!emailAddress) {
        errorRedirect.searchParams.set('error', 'gmail_profile');
        res.redirect(errorRedirect.toString());
        return;
      }

      const existing = await getStoredAccount(supabase, user.id);
      const encryptedAccessToken = encrypt(accessToken);
      const refreshToken = tokens.refresh_token
        ? encrypt(tokens.refresh_token)
        : existing?.refresh_token || null;

      if (!refreshToken) {
        errorRedirect.searchParams.set('error', 'gmail_refresh_token');
        res.redirect(errorRedirect.toString());
        return;
      }

      const expiresIn = typeof tokens.expires_in === 'number' ? tokens.expires_in : null;
      const expiryTimestamp = tokens.expiry_date
        ? tokens.expiry_date
        : Date.now() + (expiresIn || 3600) * 1000;
      const tokenExpiry = new Date(expiryTimestamp).toISOString();

      await upsertAccount(supabase, {
        user_id: user.id,
        email: emailAddress,
        provider: 'google',
        access_token: encryptedAccessToken,
        refresh_token: refreshToken,
        expiry_ts: tokenExpiry
      });

      const { state } = req.query;
      if (typeof state === 'string' && state.startsWith('/')) {
        redirectUrl = new URL(state, appBaseUrl);
      }

      redirectUrl.searchParams.set('connected', 'gmail');
      redirectUrl.searchParams.set('message', 'Gmail connected');
      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Gmail OAuth callback error:', error);
      errorRedirect.searchParams.set('error', 'gmail_callback');
      res.redirect(errorRedirect.toString());
    }
  });

  app.get('/api/gmail/authorize', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) {
        return;
      }

      const existing = await getStoredAccount(supabase, user.id);
      const prompt = !existing?.refresh_token ? 'consent' : undefined;
      const url = generateAuthUrl({ prompt });

      res.json({ url });
    } catch (error) {
      console.error('Gmail authorize error:', error);
      res.status(500).json({ error: 'Failed to generate Gmail auth URL' });
    }
  });

  app.post('/api/gmail/connect', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) {
        return;
      }

      const { code } = req.body || {};
      if (!code) {
        res.status(400).json({ error: 'Missing OAuth code' });
        return;
      }

      const { oauthClient, tokens } = await exchangeCode(code);
      if (!tokens.access_token) {
        res.status(400).json({ error: 'Missing access token' });
        return;
      }

      const userInfo = await fetchUserInfo(oauthClient);
      const email = userInfo.email;
      if (!email) {
        res.status(400).json({ error: 'Missing Gmail account email' });
        return;
      }

      if (!tokens.refresh_token) {
        const existing = await getStoredAccount(supabase, user.id);
        if (!existing?.refresh_token) {
          res.status(400).json({
            error: 'Missing refresh token. Reconnect with consent.'
          });
          return;
        }
      }

      const encryptedAccessToken = encrypt(tokens.access_token);
      const refreshToken = tokens.refresh_token
        ? encrypt(tokens.refresh_token)
        : null;
      const tokenExpiry = tokens.expiry_date
        ? new Date(tokens.expiry_date).toISOString()
        : new Date(Date.now() + 3600 * 1000).toISOString();

      await upsertAccount(supabase, {
        user_id: user.id,
        email,
        provider: 'google',
        access_token: encryptedAccessToken,
        refresh_token: refreshToken || (await getStoredAccount(supabase, user.id))?.refresh_token,
        expiry_ts: tokenExpiry
      });

      res.json({ connected: true, email });
    } catch (error) {
      console.error('Gmail connect error:', error);
      res.status(500).json({ error: 'Failed to connect Gmail' });
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
          provider: 'google',
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
