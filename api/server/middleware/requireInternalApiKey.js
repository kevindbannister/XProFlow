function requireInternalApiKey(req, res, next) {
  const request_id = req.requestId || 'unknown';
  const providedKey = req.headers['x-internal-api-key'];

  if (!providedKey || providedKey !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({
      error: 'Unauthorized',
      request_id
    });
  }

  return next();
}

module.exports = { requireInternalApiKey };
