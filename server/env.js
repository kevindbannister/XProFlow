const required = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
  'SESSION_SECRET',
  'TOKEN_ENC_KEY',
  'APP_BASE_URL'
];

function loadEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }

  return {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
    sessionSecret: process.env.SESSION_SECRET,
    tokenEncKey: process.env.TOKEN_ENC_KEY,
    appBaseUrl: process.env.APP_BASE_URL,
    port: Number(process.env.PORT || 4000),
    cookieSecure: process.env.COOKIE_SECURE === 'true'
  };
}

module.exports = { loadEnv };
