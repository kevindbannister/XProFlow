import axios from 'axios';
import { microsoftOAuthConfig, getMicrosoftAuthorizeUrl, getMicrosoftTokenUrl } from '../config/microsoft.js';

const encodeForm = (payload) => new URLSearchParams(payload).toString();

const assertMicrosoftConfig = () => {
  if (!microsoftOAuthConfig.clientId || !microsoftOAuthConfig.clientSecret || !microsoftOAuthConfig.redirectUri) {
    throw new Error('Microsoft OAuth environment variables are not configured.');
  }
};

export const buildMicrosoftAuthUrl = ({ state }) => {
  assertMicrosoftConfig();
  const params = new URLSearchParams({
    client_id: microsoftOAuthConfig.clientId,
    response_type: 'code',
    redirect_uri: microsoftOAuthConfig.redirectUri,
    response_mode: 'query',
    scope: microsoftOAuthConfig.scopes.join(' '),
    state,
    prompt: 'consent',
  });

  return `${getMicrosoftAuthorizeUrl()}?${params.toString()}`;
};

export const exchangeCodeForToken = async ({ code }) => {
  assertMicrosoftConfig();
  const payload = {
    client_id: microsoftOAuthConfig.clientId,
    client_secret: microsoftOAuthConfig.clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: microsoftOAuthConfig.redirectUri,
  };

  const response = await axios.post(getMicrosoftTokenUrl(), encodeForm(payload), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data;
};

export const refreshMicrosoftToken = async ({ refreshToken }) => {
  assertMicrosoftConfig();
  const payload = {
    client_id: microsoftOAuthConfig.clientId,
    client_secret: microsoftOAuthConfig.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    redirect_uri: microsoftOAuthConfig.redirectUri,
  };

  const response = await axios.post(getMicrosoftTokenUrl(), encodeForm(payload), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data;
};

export const fetchMicrosoftUserProfile = async ({ accessToken }) => {
  const response = await axios.get(`${microsoftOAuthConfig.graphBaseUrl}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const extractTenantId = (idToken) => {
  if (!idToken) return null;
  const [, payload] = idToken.split('.');
  if (!payload) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    return decoded.tid ?? null;
  } catch (error) {
    return null;
  }
};
