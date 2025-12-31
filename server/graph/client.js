import { decryptToken, encryptToken } from '../utils/crypto.js';
import { microsoftOAuthConfig } from '../config/microsoft.js';
import { getOauthAccountByUser, updateOauthTokens } from '../db/oauthAccounts.js';
import { refreshMicrosoftToken } from '../services/microsoftAuth.js';
import axios from 'axios';

const TOKEN_EXPIRY_BUFFER_MS = 2 * 60 * 1000;

const isExpired = (expiresAt) => {
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() - TOKEN_EXPIRY_BUFFER_MS <= Date.now();
};

export const ensureValidAccessToken = async ({ userId, provider }) => {
  const account = await getOauthAccountByUser({ userId, provider });
  if (!account) return { status: 'not_connected' };

  const accessToken = decryptToken(account.access_token);
  const refreshToken = decryptToken(account.refresh_token);

  if (!isExpired(account.expires_at)) {
    return { status: 'connected', accessToken };
  }

  if (!refreshToken) {
    return { status: 'token_expired' };
  }

  try {
    // Refresh the access token when it has expired to keep API calls seamless.
    const refreshed = await refreshMicrosoftToken({ refreshToken });
    const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
    const encryptedAccessToken = encryptToken(refreshed.access_token);
    const encryptedRefreshToken = refreshed.refresh_token ? encryptToken(refreshed.refresh_token) : null;

    await updateOauthTokens({
      userId,
      provider,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      expiresAt,
      scope: refreshed.scope ?? account.scope,
    });

    return { status: 'connected', accessToken: refreshed.access_token };
  } catch (error) {
    return { status: 'reauth_required' };
  }
};

export const callMicrosoftGraph = async ({ userId, method, url, data }) => {
  const tokenResult = await ensureValidAccessToken({ userId, provider: 'microsoft' });
  if (tokenResult.status !== 'connected') {
    const error = new Error('Microsoft account needs reconnection.');
    error.status = tokenResult.status;
    throw error;
  }

  const response = await axios({
    method,
    url: `${microsoftOAuthConfig.graphBaseUrl}${url}`,
    data,
    headers: {
      Authorization: `Bearer ${tokenResult.accessToken}`,
    },
  });

  return response.data;
};
