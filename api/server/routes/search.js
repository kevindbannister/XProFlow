const router = require('express').Router();

function getInternalApiKey(req) {
  const headerPriority = [
    'x-internal-api-key',
    'internal-api-key',
    'internal_api_key'
  ];

  for (const headerName of headerPriority) {
    const value = req.headers?.[headerName];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return null;
}

router.get('/', async (req, res) => {
  try {
    const internalApiKey = getInternalApiKey(req);

    if (!internalApiKey || internalApiKey !== process.env.INTERNAL_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const connectedAccountId =
      typeof req.query.connected_account_id === 'string'
        ? req.query.connected_account_id.trim()
        : '';

    if (!q) {
      return res.json({ results: [] });
    }

    if (!connectedAccountId) {
      return res.status(400).json({ error: 'connected_account_id is required' });
    }

    const supabase = req.app.locals.supabase;
    const escapedQuery = q.replace(/[%_]/g, (match) => `\\${match}`);
    const searchPattern = `%${escapedQuery}%`;

    const { data, error } = await supabase
      .from('gmail_messages')
      .select('subject,from_email,snippet,thread_id,internal_date')
      .eq('connected_account_id', connectedAccountId)
      .or(
        [
          `subject.ilike.${searchPattern}`,
          `body_text.ilike.${searchPattern}`,
          `snippet.ilike.${searchPattern}`,
          `from_email.ilike.${searchPattern}`
        ].join(',')
      )
      .order('internal_date', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return res.json({
      results: Array.isArray(data) ? data : []
    });
  } catch (error) {
    console.error('Search endpoint error:', error);
    return res.status(500).json({ error: 'Failed to search messages' });
  }
});

module.exports = router;
