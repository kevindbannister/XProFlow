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
    .select('user_id, email, token_expires_at, access_token_encrypted, refresh_token_encrypted')
    .eq('id', connectedAccountId)
    .single();

  if (error) {
    throw new Error(`Failed to load connected account: ${error.message}`);
  }

  console.log('[DEBUG][GMAIL] --- GMAIL CLIENT DEBUG ---');
  console.log('[DEBUG][GMAIL] Connected Account ID:', connectedAccountId);
  console.log('[DEBUG][GMAIL] User ID:', data?.user_id);
  console.log('[DEBUG][GMAIL] Email:', data?.email);
  console.log('[DEBUG][GMAIL] Token expires at:', data?.token_expires_at);
  console.log('[DEBUG][GMAIL] Access token encrypted exists:', !!data?.access_token_encrypted);
  console.log('[DEBUG][GMAIL] Refresh token encrypted exists:', !!data?.refresh_token_encrypted);


  if (!data?.access_token_encrypted) {
    throw new Error('Missing encrypted access token for connected account.');
  }

  const accessToken = decrypt(data.access_token_encrypted);
  console.log('[DEBUG][GMAIL] Decrypted access token first 12 chars:', accessToken?.substring(0, 12));
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

  auth.on('tokens', (tokens) => {
    console.log('[DEBUG][GMAIL] --- TOKEN REFRESH EVENT ---');
    console.log('[DEBUG][GMAIL] New access token received:', !!tokens.access_token);
    console.log('[DEBUG][GMAIL] New refresh token received:', !!tokens.refresh_token);
    console.log('[DEBUG][GMAIL] ----------------------------');
  });

  console.log('[DEBUG][GMAIL] --- END GMAIL CLIENT DEBUG ---');

  return google.gmail({ version: 'v1', auth });
}

module.exports = {
  getGmailClient,
};
