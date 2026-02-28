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

  /**
   * START GOOGLE OAUTH
   */
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

  /**
   * GOOGLE CALLBACK
   */
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

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI;

      if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('Missing Google OAuth environment configuration.');
      }

      const tokenRequestBody = new URLSearchParams({
        // These values must match the OAuth app and redirect URL used when
        // generating the original consent-screen URL.
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      });

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: tokenRequestBody
      });

      const tokenPayload = await tokenResponse.json();

      console.log('Google token response payload:', tokenPayload);

      if (!tokenResponse.ok) {
        const tokenError = tokenPayload?.error || 'token_exchange_failed';
        throw new Error(`Google token exchange failed: ${tokenError}`);
      }

      const accessToken = tokenPayload?.access_token;
      const refreshToken = tokenPayload?.refresh_token || null;

      if (!accessToken || !accessToken.startsWith('ya29.')) {
        throw new Error('Google returned an invalid access token format.');
      }

      const expiresInSeconds = Number(tokenPayload?.expires_in || 0);
      const tokenExpiresAt = new Date(
        Date.now() + expiresInSeconds * 1000
      ).toISOString();

      const userInfoResponse = await fetch(
        'https://openidconnect.googleapis.com/v1/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      const userInfoPayload = await userInfoResponse.json();
      const email = userInfoPayload?.email;
      const providerAccountId = userInfoPayload?.sub;

      if (!userInfoResponse.ok || !email || !providerAccountId) {
        throw new Error('Failed to resolve Google account identity.');
      }

      const { data, error } = await supabaseAdmin
        .from('connected_accounts')
        .upsert(
          {
            user_id: userId,
            provider: 'google',
            provider_account_id: providerAccountId,
            email,
            access_token_encrypted: encrypt(accessToken),
            refresh_token_encrypted: refreshToken ? encrypt(refreshToken) : null,
            token_expires_at: tokenExpiresAt,
            last_sync_at: null
          },
          { onConflict: 'user_id,provider' }
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

      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        return res.redirect(
          `${frontendUrl}/integrations?success=gmail_connected`
        );
      }

      return res.status(200).json({
        success: true,
        message: 'Gmail account connected successfully.',
        token_expiry: tokenExpiresAt
      });
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        return res.redirect(callbackErrorRedirect('gmail_callback'));
      }

      const message =
        error instanceof Error ? error.message : 'OAuth callback failed';
      return res.status(400).json({ success: false, error: message });
    }
  });
}

module.exports = { registerGoogleAuth };
