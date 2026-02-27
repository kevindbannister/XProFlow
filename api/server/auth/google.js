const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const { encrypt } = require('../encryption');

const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/gmail.readonly'
];

function createOAuthClient() {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

function registerGoogleAuth(app, supabaseAdmin, supabaseAuth) {
  if (!supabaseAdmin || !supabaseAuth) {
    throw new Error('Supabase clients not initialized.');
  }

  const frontendUrl =
    process.env.FRONTEND_URL || 'https://app.xproflow.com';

  // START OAUTH
  app.get('/auth/google', async (req, res) => {
    try {
      const accessToken = req.query.token;

      if (!accessToken) {
        console.error('Missing Supabase token');
        return res.status(401).send('Missing token');
      }

      const {
        data: { user },
        error: userError
      } = await supabaseAuth.auth.getUser(accessToken);

      if (userError || !user) {
        console.error('Invalid Supabase token', userError);
        return res.status(401).send('Invalid token');
      }

      console.log('Supabase user validated:', user.id);

      // Store Supabase user ID for callback
      res.cookie('gmail_oauth_user', user.id, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: '.xproflow.com',
        path: '/',
        maxAge: 10 * 60 * 1000
      });

      const state = crypto.randomBytes(32).toString('hex');

      res.cookie('gmail_oauth_state', state, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: '.xproflow.com',
        path: '/',
        maxAge: 10 * 60 * 1000
      });

      const oauthClient = createOAuthClient();

      const authUrl = oauthClient.generateAuthUrl({
        scope: GOOGLE_SCOPES,
        access_type: 'offline',
        include_granted_scopes: true,
        prompt: 'consent',
        state
      });

      return res.redirect(authUrl);
    } catch (error) {
      console.error('Google OAuth start error:', error);
      return res.status(500).send('OAuth start failed');
    }
  });

  // CALLBACK
  app.get('/auth/google/callback', async (req, res) => {
    const callbackErrorRedirect = (errorCode) =>
      `${frontendUrl}/integrations?error=${errorCode}`;

    try {
      console.log('=== GOOGLE CALLBACK HIT ===');

      const userId = req.cookies?.gmail_oauth_user;

      if (!userId) {
        console.error('Missing user cookie');
        return res.redirect(callbackErrorRedirect('no_user'));
      }

      const code =
        typeof req.query.code === 'string' ? req.query.code : null;
      const state =
        typeof req.query.state === 'string' ? req.query.state : null;
      const storedState = req.cookies?.gmail_oauth_state;

      if (!state || !storedState || state !== storedState) {
        console.error('State mismatch');
        return res.redirect(callbackErrorRedirect('gmail_state'));
      }

      if (!code) {
        console.error('Missing code');
        return res.redirect(callbackErrorRedirect('gmail_code'));
      }

      const oauthClient = createOAuthClient();
      const { tokens } = await oauthClient.getToken(code);
      oauthClient.setCredentials(tokens);

      console.log('Tokens received:', {
        access: !!tokens.access_token,
        refresh: !!tokens.refresh_token,
        expiry: tokens.expiry_date
      });

      const userInfoResponse = await oauthClient.request({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo'
      });

      const { email, id } = userInfoResponse.data || {};

      if (!tokens.access_token) {
        throw new Error('Missing access token from Google.');
      }

      if (!email || !id) {
        throw new Error('Missing Google user information.');
      }

      const encryptedAccessToken = encrypt(tokens.access_token);
      const encryptedRefreshToken = tokens.refresh_token
        ? encrypt(tokens.refresh_token)
        : null;

      const tokenExpiry = tokens.expiry_date
        ? new Date(tokens.expiry_date).toISOString()
        : null;

      console.log('About to upsert into Supabase');

      const { data, error } = await supabaseAdmin
        .from('connected_accounts')
        .upsert(
          {
            user_id: userId,
            user_email: email,
            provider: 'google',
            provider_user_id: id,
            access_token: encryptedAccessToken,
            refresh_token: encryptedRefreshToken,
            token_expiry: tokenExpiry
          },
          { onConflict: 'provider,provider_user_id' }
        )
        .select();

      console.log('SUPABASE RESULT:', { data, error });

      if (error) {
        throw error;
      }

      res.clearCookie('gmail_oauth_state', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: '.xproflow.com',
        path: '/'
      });

      res.clearCookie('gmail_oauth_user', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: '.xproflow.com',
        path: '/'
      });

      return res.redirect(
        `${frontendUrl}/integrations?success=gmail_connected`
      );
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      return res.redirect(callbackErrorRedirect('gmail_callback'));
    }
  });
}

module.exports = { registerGoogleAuth };
