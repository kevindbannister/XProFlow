const { google } = require('googleapis');

function createOAuthClient(env) {
  return new google.auth.OAuth2(
    env.googleClientId,
    env.googleClientSecret,
    env.googleRedirectUri
  );
}

function getGmailClient(oauthClient) {
  return google.gmail({ version: 'v1', auth: oauthClient });
}

module.exports = { createOAuthClient, getGmailClient };
