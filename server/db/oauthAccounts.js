import { query } from './index.js';

export const getOauthAccountByUser = async ({ userId, provider }) => {
  const result = await query(
    `SELECT id, user_id, provider, email, tenant_id, access_token, refresh_token, expires_at, scope, created_at, updated_at
     FROM oauth_accounts
     WHERE user_id = $1 AND provider = $2`,
    [userId, provider]
  );
  return result.rows[0] ?? null;
};

export const upsertOauthAccount = async ({
  userId,
  provider,
  email,
  tenantId,
  accessToken,
  refreshToken,
  expiresAt,
  scope,
}) => {
  const result = await query(
    `INSERT INTO oauth_accounts
      (user_id, provider, email, tenant_id, access_token, refresh_token, expires_at, scope)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (user_id, provider)
     DO UPDATE SET
        email = EXCLUDED.email,
        tenant_id = EXCLUDED.tenant_id,
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        expires_at = EXCLUDED.expires_at,
        scope = EXCLUDED.scope,
        updated_at = NOW()
     RETURNING *`,
    [userId, provider, email, tenantId, accessToken, refreshToken, expiresAt, scope]
  );
  return result.rows[0];
};

export const updateOauthTokens = async ({ userId, provider, accessToken, refreshToken, expiresAt, scope }) => {
  const result = await query(
    `UPDATE oauth_accounts
     SET access_token = $1,
         refresh_token = COALESCE($2, refresh_token),
         expires_at = $3,
         scope = $4,
         updated_at = NOW()
     WHERE user_id = $5 AND provider = $6
     RETURNING *`,
    [accessToken, refreshToken, expiresAt, scope, userId, provider]
  );
  return result.rows[0] ?? null;
};

export const deleteOauthAccount = async ({ userId, provider }) => {
  await query('DELETE FROM oauth_accounts WHERE user_id = $1 AND provider = $2', [userId, provider]);
};
