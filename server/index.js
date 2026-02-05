require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const cookieSession = require('cookie-session');
const cors = require('cors');
const { nanoid } = require('nanoid');
const { loadEnv } = require('./env');
const { encrypt, decrypt } = require('./crypto');
const { upsertConnection, getConnection, deleteConnection } = require('./db');
const { createOAuthClient, getGmailClient } = require('./gmail');

const env = loadEnv();
const app = express();

app.use(
  cors({
    origin: env.appBaseUrl,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(
  cookieSession({
    name: 'xproflow-session',
    secret: env.sessionSecret,
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
);

const GMAIL_SCOPES = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
];

function base64UrlEncode(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function generatePkce() {
  const verifier = base64UrlEncode(crypto.randomBytes(32));
  const challenge = base64UrlEncode(crypto.createHash('sha256').update(verifier).digest());
  return { verifier, challenge };
}

function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}

function ensureCsrf(req, res, next) {
  const token = req.get('x-csrf-token');
  if (!req.session?.csrfToken || token !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  return next();
}

app.get('/auth/google', (req, res) => {
  const { verifier, challenge } = generatePkce();
  req.session.pkceVerifier = verifier;
  req.session.csrfToken = req.session.csrfToken || nanoid();

  const oauthClient = createOAuthClient(env);
  const authUrl = oauthClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: GMAIL_SCOPES,
    include_granted_scopes: true,
    code_challenge: challenge,
    code_challenge_method: 'S256'
  });

  return res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Missing OAuth code');
  }

  try {
    const oauthClient = createOAuthClient(env);
    const { tokens } = await oauthClient.getToken({
      code,
      codeVerifier: req.session.pkceVerifier
    });

    req.session.pkceVerifier = null;

    if (!tokens.refresh_token) {
      return res.status(400).send('Missing refresh token. Re-consent required.');
    }

    oauthClient.setCredentials({
      refresh_token: tokens.refresh_token
    });

    const oauth2 = require('googleapis').google.oauth2({
      version: 'v2',
      auth: oauthClient
    });
    const userInfo = await oauth2.userinfo.get();
    const googleUserId = userInfo.data.id;
    const email = userInfo.data.email;

    const userId = googleUserId;
    req.session.userId = userId;
    req.session.userEmail = email;

    const refreshTokenEnc = encrypt(env.tokenEncKey, tokens.refresh_token);
    upsertConnection({
      userId,
      googleUserId,
      email,
      refreshTokenEnc,
      scopes: tokens.scope || GMAIL_SCOPES.join(' ')
    });

    return res.json({
      ok: true,
      user: {
        id: userId,
        email
      },
      scopes: tokens.scope || GMAIL_SCOPES.join(' ')
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.status(500).send('OAuth failed');
  }
});

app.post('/auth/logout', requireAuth, ensureCsrf, (req, res) => {
  req.session = null;
  return res.json({ ok: true });
});

app.post('/auth/google/disconnect', requireAuth, ensureCsrf, async (req, res) => {
  const connection = getConnection(req.session.userId);
  if (!connection) {
    return res.status(404).json({ error: 'No connection found' });
  }

  try {
    const refreshToken = decrypt(env.tokenEncKey, connection.refresh_token_enc);
    await fetch(`https://oauth2.googleapis.com/revoke?token=${refreshToken}`);
  } catch (error) {
    console.error('Token revoke error:', error);
  }

  deleteConnection(req.session.userId);
  return res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  if (!req.session?.userId) {
    return res.json({ authenticated: false });
  }
  if (!req.session.csrfToken) {
    req.session.csrfToken = nanoid();
  }
  const connection = getConnection(req.session.userId);
  return res.json({
    authenticated: true,
    csrfToken: req.session.csrfToken,
    user: {
      id: req.session.userId,
      email: req.session.userEmail
    },
    gmail: connection
      ? { connected: true, email: connection.email, scopes: connection.scopes }
      : { connected: false }
  });
});

app.get('/api/gmail/profile', requireAuth, async (req, res) => {
  const connection = getConnection(req.session.userId);
  if (!connection) {
    return res.status(404).json({ error: 'No Gmail connection' });
  }

  try {
    const refreshToken = decrypt(env.tokenEncKey, connection.refresh_token_enc);
    const oauthClient = createOAuthClient(env);
    oauthClient.setCredentials({ refresh_token: refreshToken });
    const gmail = getGmailClient(oauthClient);
    const profile = await gmail.users.getProfile({ userId: 'me' });
    return res.json(profile.data);
  } catch (error) {
    console.error('Gmail profile error:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.get('/api/gmail/threads', requireAuth, async (req, res) => {
  const connection = getConnection(req.session.userId);
  if (!connection) {
    return res.status(404).json({ error: 'No Gmail connection' });
  }

  try {
    const refreshToken = decrypt(env.tokenEncKey, connection.refresh_token_enc);
    const oauthClient = createOAuthClient(env);
    oauthClient.setCredentials({ refresh_token: refreshToken });
    const gmail = getGmailClient(oauthClient);
    const response = await gmail.users.threads.list({
      userId: 'me',
      maxResults: Number(req.query.maxResults || 20),
      pageToken: req.query.pageToken
    });
    return res.json(response.data);
  } catch (error) {
    console.error('Gmail threads error:', error);
    return res.status(500).json({ error: 'Failed to list threads' });
  }
});

app.get('/api/gmail/threads/:id', requireAuth, async (req, res) => {
  const connection = getConnection(req.session.userId);
  if (!connection) {
    return res.status(404).json({ error: 'No Gmail connection' });
  }

  try {
    const refreshToken = decrypt(env.tokenEncKey, connection.refresh_token_enc);
    const oauthClient = createOAuthClient(env);
    oauthClient.setCredentials({ refresh_token: refreshToken });
    const gmail = getGmailClient(oauthClient);
    const response = await gmail.users.threads.get({
      userId: 'me',
      id: req.params.id,
      format: 'full'
    });
    return res.json(response.data);
  } catch (error) {
    console.error('Gmail thread error:', error);
    return res.status(500).json({ error: 'Failed to fetch thread' });
  }
});

function buildRawEmail({ to, subject, body }) {
  const lines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    body
  ];
  return base64UrlEncode(Buffer.from(lines.join('\r\n')));
}

app.post('/api/gmail/drafts', requireAuth, ensureCsrf, async (req, res) => {
  const connection = getConnection(req.session.userId);
  if (!connection) {
    return res.status(404).json({ error: 'No Gmail connection' });
  }

  const { to, subject, body } = req.body || {};
  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing to/subject/body' });
  }

  try {
    const refreshToken = decrypt(env.tokenEncKey, connection.refresh_token_enc);
    const oauthClient = createOAuthClient(env);
    oauthClient.setCredentials({ refresh_token: refreshToken });
    const gmail = getGmailClient(oauthClient);
    const raw = buildRawEmail({ to, subject, body });
    const response = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: { raw }
      }
    });
    return res.json(response.data);
  } catch (error) {
    console.error('Gmail draft error:', error);
    return res.status(500).json({ error: 'Failed to create draft' });
  }
});

app.post('/api/gmail/send', requireAuth, ensureCsrf, async (req, res) => {
  const connection = getConnection(req.session.userId);
  if (!connection) {
    return res.status(404).json({ error: 'No Gmail connection' });
  }

  const { to, subject, body } = req.body || {};
  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing to/subject/body' });
  }

  try {
    const refreshToken = decrypt(env.tokenEncKey, connection.refresh_token_enc);
    const oauthClient = createOAuthClient(env);
    oauthClient.setCredentials({ refresh_token: refreshToken });
    const gmail = getGmailClient(oauthClient);
    const raw = buildRawEmail({ to, subject, body });
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw
      }
    });
    return res.json(response.data);
  } catch (error) {
    console.error('Gmail send error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(env.port, () => {
  console.log(`Server listening on :${env.port}`);
});
