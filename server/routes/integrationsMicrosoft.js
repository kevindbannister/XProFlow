import express from 'express';
import { getOauthAccountByUser, deleteOauthAccount } from '../db/oauthAccounts.js';
import { ensureValidAccessToken, callMicrosoftGraph } from '../graph/client.js';

export const integrationsMicrosoftRouter = express.Router();

const getUserIdFromRequest = (req) => {
  if (req.user?.id) return req.user.id;
  const headerUserId = req.headers['x-user-id'];
  if (headerUserId) return Array.isArray(headerUserId) ? headerUserId[0] : headerUserId;
  return req.query.user_id;
};

integrationsMicrosoftRouter.get('/status', async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(400).json({ error: 'Missing user_id.' });
  }

  try {
    const account = await getOauthAccountByUser({ userId, provider: 'microsoft' });
    if (!account) {
      return res.json({ status: 'not_connected' });
    }

    const tokenStatus = await ensureValidAccessToken({ userId, provider: 'microsoft' });

    return res.json({
      status: tokenStatus.status,
      email: account.email,
      tenantId: account.tenant_id,
      expiresAt: account.expires_at,
      scope: account.scope,
      lastSyncAt: null,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error' });
  }
});

integrationsMicrosoftRouter.post('/disconnect', async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(400).json({ error: 'Missing user_id.' });
  }

  await deleteOauthAccount({ userId, provider: 'microsoft' });
  return res.status(204).send();
});

integrationsMicrosoftRouter.get('/test-connection', async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(400).json({ error: 'Missing user_id.' });
  }

  try {
    const profile = await callMicrosoftGraph({
      userId,
      method: 'GET',
      url: '/me',
    });

    return res.json({ ok: true, email: profile.mail || profile.userPrincipalName });
  } catch (error) {
    if (error.status === 'reauth_required' || error.status === 'token_expired') {
      return res.status(401).json({ ok: false, status: error.status });
    }
    return res.status(500).json({ ok: false, status: 'error' });
  }
});
