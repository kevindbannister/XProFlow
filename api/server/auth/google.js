const { OAuth2Client } = require('google-auth-library');
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

function registerGoogleAuth(app, supabase) {
  if (!supabase) {
    throw new Error('Supabase client is not initialized.');
  }

  app.get('/auth/google', async (req, res) => {
    try {
      const oauthClient = createOAuthClient();
      const authUrl = oauthClient.generateAuthUrl({
        scope: GOOGLE_SCOPES
      });
      return res.redirect(authUrl);
    } catch (error) {
      console.error('Google OAuth start error:', error);
      return res.status(500).json({ error: 'Google OAuth start failed' });
    }
  });

  app.get('/auth/google/callback', async (req, res) => {
    try {
      const { code } = req.query;
      if (!code) {
        throw new Error('Missing OAuth code');
      }

      const oauthClient = createOAuthClient();
      const { tokens } = await oauthClient.getToken(code);
      oauthClient.setCredentials(tokens);

      const userInfoResponse = await oauthClient.request({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo'
      });

      const { email, name, id } = userInfoResponse.data || {};

      if (!tokens.access_token) {
        throw new Error('Missing access token from Google.');
      }

      if (!email || !id) {
        throw new Error('Missing Google user information.');
      }

      let scopesGranted = [];
      if (tokens.scope) {
        scopesGranted = tokens.scope.split(' ');
      } else if (tokens.access_token) {
        const tokenInfo = await oauthClient.getTokenInfo(tokens.access_token);
        scopesGranted = tokenInfo.scopes || [];
      }

      const encryptedAccessToken = encrypt(tokens.access_token);
      const encryptedRefreshToken = tokens.refresh_token
        ? encrypt(tokens.refresh_token)
        : null;
      const tokenExpiry = tokens.expiry_date
        ? new Date(tokens.expiry_date).toISOString()
        : null;

      const { error } = await supabase.from('connected_accounts').upsert(
        {
          user_email: email,
          provider: 'google',
          provider_user_id: id,
          scopes: scopesGranted,
          access_token: encryptedAccessToken,
          refresh_token: encryptedRefreshToken,
          token_expiry: tokenExpiry
        },
        { onConflict: 'provider,provider_user_id' }
      );

      if (error) {
        throw new Error('Failed to store Google account tokens.');
      }

      return res.json({
        message: 'Google account connected',
        email,
        provider: 'google'
      });
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      return res.status(500).json({
        error: 'Google OAuth callback failed',
        message: error.message
      });
    }
  });
}

module.exports = { registerGoogleAuth };
