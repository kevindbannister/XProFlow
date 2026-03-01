const router = require('express').Router();

const { requireUser } = require('../auth/supabaseAuth');
const { decrypt, encrypt } = require('../encryption');
const { refreshAccessToken } = require('../google/oauth');

function resolveExpiryDate(credentials) {
  if (credentials?.expiry_date) {
    const parsed = new Date(credentials.expiry_date);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date(Date.now() + 3600 * 1000).toISOString();
}

function isTokenExpired(tokenExpiresAt) {
  const expiry = new Date(tokenExpiresAt).getTime();
  if (Number.isNaN(expiry)) {
    return true;
  }

  return expiry <= Date.now();
}

router.get('/token/:accountId', async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const user = await requireUser(req, res, supabase);
    if (!user) {
      return;
    }

    const { accountId } = req.params;
    const { data: account, error } = await supabase
      .from('connected_accounts')
      .select(
        'id,user_id,provider,access_token_encrypted,refresh_token_encrypted,token_expires_at'
      )
      .eq('id', accountId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Connected account not found' });
        return;
      }
      throw error;
    }

    if (!account || account.user_id !== user.id) {
      res.status(404).json({ error: 'Connected account not found' });
      return;
    }

    let accessToken = decrypt(account.access_token_encrypted);
    let expiresAt = account.token_expires_at;

    if (isTokenExpired(account.token_expires_at)) {
      if (!account.refresh_token_encrypted) {
        res.status(400).json({ error: 'Refresh token unavailable' });
        return;
      }

      const refreshToken = decrypt(account.refresh_token_encrypted);
      const { credentials } = await refreshAccessToken(refreshToken);

      if (!credentials?.access_token) {
        res.status(500).json({ error: 'Failed to refresh access token' });
        return;
      }

      accessToken = credentials.access_token;
      expiresAt = resolveExpiryDate(credentials);

      const updatedRefreshTokenEncrypted = credentials.refresh_token
        ? encrypt(credentials.refresh_token)
        : account.refresh_token_encrypted;

      const { error: updateError } = await supabase
        .from('connected_accounts')
        .update({
          access_token_encrypted: encrypt(accessToken),
          refresh_token_encrypted: updatedRefreshTokenEncrypted,
          token_expires_at: expiresAt
        })
        .eq('id', account.id)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }
    }

    res.json({
      access_token: accessToken,
      expires_at: expiresAt
    });
  } catch (error) {
    console.error('Email token error:', error);
    res.status(500).json({ error: 'Failed to fetch email token' });
  }
});

module.exports = router;
