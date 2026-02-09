const { OAuth2Client } = require('google-auth-library');

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

function generateAuthUrl({ prompt } = {}) {
  const oauthClient = createOAuthClient();
  return oauthClient.generateAuthUrl({
    scope: GOOGLE_SCOPES,
    access_type: 'offline',
    prompt
  });
}

async function exchangeCode(code) {
  const oauthClient = createOAuthClient();
  const { tokens } = await oauthClient.getToken(code);
  oauthClient.setCredentials(tokens);
  return { oauthClient, tokens };
}

async function refreshAccessToken(refreshToken) {
  const oauthClient = createOAuthClient();
  oauthClient.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await oauthClient.refreshAccessToken();
  return { oauthClient, credentials };
}

async function fetchUserInfo(oauthClient) {
  const userInfoResponse = await oauthClient.request({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo'
  });
  return userInfoResponse.data || {};
}

module.exports = {
  GOOGLE_SCOPES,
  createOAuthClient,
  generateAuthUrl,
  exchangeCode,
  refreshAccessToken,
  fetchUserInfo
};
