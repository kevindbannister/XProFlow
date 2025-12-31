export const microsoftOAuthConfig = {
  tenant: 'common',
  authBaseUrl: 'https://login.microsoftonline.com',
  graphBaseUrl: 'https://graph.microsoft.com/v1.0',
  scopes: ['User.Read', 'Mail.Read', 'Mail.ReadWrite', 'Mail.Send', 'offline_access'],
  clientId: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  redirectUri: process.env.MICROSOFT_REDIRECT_URI,
  postAuthRedirect: process.env.MICROSOFT_POST_AUTH_REDIRECT || '/settings?tab=integrations',
};

export const getMicrosoftAuthorizeUrl = () =>
  `${microsoftOAuthConfig.authBaseUrl}/${microsoftOAuthConfig.tenant}/oauth2/v2.0/authorize`;

export const getMicrosoftTokenUrl = () =>
  `${microsoftOAuthConfig.authBaseUrl}/${microsoftOAuthConfig.tenant}/oauth2/v2.0/token`;
