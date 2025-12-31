import crypto from 'node:crypto';

const STATE_SECRET = process.env.OAUTH_STATE_SECRET;

const getStateSecret = () => {
  if (!STATE_SECRET) {
    throw new Error('OAUTH_STATE_SECRET is required to sign OAuth state.');
  }
  return STATE_SECRET;
};

const base64UrlEncode = (input) =>
  Buffer.from(JSON.stringify(input))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const base64UrlDecode = (input) => {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const buffer = Buffer.from(padded + '='.repeat((4 - (padded.length % 4)) % 4), 'base64');
  return JSON.parse(buffer.toString('utf8'));
};

const signState = (payload) => {
  const secret = getStateSecret();
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
};

export const createOAuthState = ({ userId }) => {
  const payload = {
    userId,
    nonce: crypto.randomUUID(),
    issuedAt: Date.now(),
  };
  const encoded = base64UrlEncode(payload);
  const signature = signState(encoded);
  return `${encoded}.${signature}`;
};

export const verifyOAuthState = (state) => {
  if (!state || typeof state !== 'string') return null;
  const [encoded, signature] = state.split('.');
  if (!encoded || !signature) return null;

  const expectedSignature = signState(encoded);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  return base64UrlDecode(encoded);
};
