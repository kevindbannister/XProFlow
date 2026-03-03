const { google } = require('googleapis');
const { getSupabaseClient } = require('../supabaseClient');
const { decrypt } = require('../encryption');

async function getGmailClient(connectedAccountId) {
  if (!connectedAccountId) {
    throw new Error('connectedAccountId is required.');
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('connected_accounts')
    .select('access_token_encrypted, refresh_token_encrypted')
    .eq('id', connectedAccountId)
    .single();

  if (error) {
    throw new Error(`Failed to load connected account: ${error.message}`);
  }

  if (!data?.access_token_encrypted) {
    throw new Error('Missing encrypted access token for connected account.');
  }

  const accessToken = decrypt(data.access_token_encrypted);
  const refreshToken = data.refresh_token_encrypted
    ? decrypt(data.refresh_token_encrypted)
    : undefined;

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return google.gmail({ version: 'v1', auth });
}

module.exports = {
  getGmailClient,
};
