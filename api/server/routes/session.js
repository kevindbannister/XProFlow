const { getUserFromRequest, requireUser } = require('../auth/supabaseAuth');

function registerSessionRoutes(app, supabase) {
  app.get('/api/me', async (req, res) => {
    try {
      const user = await getUserFromRequest(req, supabase);
      if (!user) {
        res.json({ authenticated: false });
        return;
      }

      const { data, error } = await supabase
        .from('gmail_accounts')
        .select('email')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      res.json({
        authenticated: true,
        user: { id: user.id, email: user.email },
        gmail: data
          ? { connected: true, email: data.email }
          : { connected: false }
      });
    } catch (error) {
      console.error('Session check failed:', error);
      res.status(500).json({ error: 'Failed to load session' });
    }
  });

  app.post('/auth/google/disconnect', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) {
        return;
      }

      const { error } = await supabase
        .from('gmail_accounts')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Disconnect Gmail failed:', error);
      res.status(500).json({ error: 'Failed to disconnect Gmail' });
    }
  });

  app.post('/auth/logout', async (_req, res) => {
    res.status(204).send();
  });
}

module.exports = { registerSessionRoutes };
