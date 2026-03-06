const router = require('express').Router();
const { requireInternalApiAuth } = require('../middleware/internalApiAuth');

router.get('/', requireInternalApiAuth, async (req, res) => {
  try {
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

    const requestingUserId = req.user?.id || null;

    const supabase = req.app.locals.supabase;

    if (requestingUserId) {
      const { data: account, error: accountError } = await supabase
        .from('connected_accounts')
        .select('id')
        .eq('id', connectedAccountId)
        .eq('user_id', requestingUserId)
        .maybeSingle();

      if (accountError) {
        throw accountError;
      }

      if (!account) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }
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
