import express from 'express';
import { buildMicrosoftAuthUrl, exchangeCodeForToken, extractTenantId, fetchMicrosoftUserProfile } from '../services/microsoftAuth.js';
import { createOAuthState, verifyOAuthState } from '../utils/oauthState.js';
import { encryptToken } from '../utils/crypto.js';
import { upsertOauthAccount } from '../db/oauthAccounts.js';
import { microsoftOAuthConfig } from '../config/microsoft.js';

export const authMicrosoftRouter = express.Router();

const getUserIdFromRequest = (req) => {
  if (req.user?.id) return req.user.id;
  const headerUserId = req.headers['x-user-id'];
  if (headerUserId) return Array.isArray(headerUserId) ? headerUserId[0] : headerUserId;
  return req.query.user_id;
};

authMicrosoftRouter.get('/start', (req, res) => {
  const userId = getUserIdFromRequest(req);

  if (!userId) {
    return res.status(400).json({ error: 'Missing user_id for Microsoft OAuth start.' });
  }

  // The state value ties the external Microsoft redirect back to the current signed-in user.
  const state = createOAuthState({ userId });
  const authUrl = buildMicrosoftAuthUrl({ state });

  // Redirect the user to Microsoft's consent page for the required Graph scopes.
  return res.redirect(authUrl);
});

authMicrosoftRouter.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing OAuth code or state.' });
  }

  const verifiedState = verifyOAuthState(state);
  if (!verifiedState?.userId) {
    return res.status(401).json({ error: 'Invalid OAuth state.' });
  }

  try {
    // Exchange the authorization code for access + refresh tokens.
    const tokenResponse = await exchangeCodeForToken({ code });
    const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString();

    const encryptedAccessToken = encryptToken(tokenResponse.access_token);
    const encryptedRefreshToken = tokenResponse.refresh_token ? encryptToken(tokenResponse.refresh_token) : null;

    // Fetch the user's profile to capture their primary email address.
    const profile = await fetchMicrosoftUserProfile({ accessToken: tokenResponse.access_token });
    const email = profile.mail || profile.userPrincipalName;
    const tenantId = extractTenantId(tokenResponse.id_token);

    // Store the tokens encrypted at rest and associate them with the internal user_id.
    await upsertOauthAccount({
      userId: verifiedState.userId,
      provider: 'microsoft',
      email,
      tenantId,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      expiresAt,
      scope: tokenResponse.scope,
    });

    return res.redirect(microsoftOAuthConfig.postAuthRedirect);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to complete Microsoft OAuth flow.' });
  }
});
