const crypto = require('crypto');

const INTERNAL_AUTH_DEBUG_PREFIX = '[DEBUG][INTERNAL_AUTH]';

function ensureRequestId(req) {
  if (req.request_id) {
    return req.request_id;
  }

  if (req.requestId) {
    req.request_id = req.requestId;
    return req.request_id;
  }

  const generated = crypto.randomBytes(4).toString('hex');
  req.request_id = generated;
  req.requestId = generated;
  return generated;
}

function getProvidedKey(req) {
  const headerPriority = [
    'x-internal-api-key',
    'internal-api-key',
    'internal_api_key'
  ];

  for (const headerName of headerPriority) {
    const value = req.headers[headerName];
    if (typeof value === 'string' && value.length > 0) {
      return { providedKey: value, usedHeader: headerName };
    }
  }

  return { providedKey: null, usedHeader: null };
}

function debugAuthFailure(req, details) {
  const headerNames = Object.keys(req.headers || {});
  const providedPrefix = details.providedKey
    ? details.providedKey.slice(0, 6)
    : null;

  console.error(`${INTERNAL_AUTH_DEBUG_PREFIX} auth failed`, {
    request_id: details.requestId,
    method: req.method,
    path: req.path,
    header_names_present: headerNames,
    used_header: details.usedHeader,
    env_key_length: details.envKey ? details.envKey.length : 0,
    provided_key_length: details.providedKey ? details.providedKey.length : 0,
    provided_key_prefix: providedPrefix,
    reason: details.reason
  });
}

function requireInternalApiAuth(req, res, next) {
  const requestId = ensureRequestId(req);
  const envKey = process.env.INTERNAL_API_KEY;
  const { providedKey, usedHeader } = getProvidedKey(req);

  if (!envKey) {
    debugAuthFailure(req, {
      requestId,
      envKey,
      providedKey,
      usedHeader,
      reason: 'missing_env_key'
    });

    return res.status(500).json({
      error: 'Server misconfigured',
      request_id: requestId
    });
  }

  if (!providedKey) {
    debugAuthFailure(req, {
      requestId,
      envKey,
      providedKey,
      usedHeader,
      reason: 'missing_provided_key'
    });

    return res.status(401).json({
      error: 'Unauthorized',
      request_id: requestId
    });
  }

  if (providedKey !== envKey) {
    debugAuthFailure(req, {
      requestId,
      envKey,
      providedKey,
      usedHeader,
      reason: 'key_mismatch'
    });

    return res.status(401).json({
      error: 'Unauthorized',
      request_id: requestId
    });
  }

  return next();
}

module.exports = { requireInternalApiAuth };
