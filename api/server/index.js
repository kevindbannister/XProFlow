async function startServer() {
  const { loadSecrets } = require('./bootstrap/secrets');
  await loadSecrets();

  const express = require('express');
  const express = require('express');
  const { registerGoogleAuth } = require('./auth/google');
  const { registerGmailRoutes } = require('./routes/gmail');
  const { registerInboxRoutes } = require('./routes/inbox');
  const { registerSessionRoutes } = require('./routes/session');
  const { getSupabaseClient } = require('./supabaseClient');
  const { encrypt, decrypt } = require('./encryption');

  const app = express();
  const port = Number(process.env.SERVER_PORT || process.env.PORT || 3001);
  const supabase = getSupabaseClient();

  app.use(express.json());

  registerGoogleAuth(app, supabase);
  registerSessionRoutes(app, supabase);
  registerGmailRoutes(app, supabase);
  registerInboxRoutes(app, supabase);

  app.get('/health', (req, res) => {
    return res.status(200).json({ status: 'ok' });
  });

  app.get('/health/supabase', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('connected_accounts')
        .select('id')
        .limit(1);

      if (error) {
        throw error;
      }

      const rows = Array.isArray(data) ? data.length : 0;
      return res.json({
        status: 'ok',
        supabase: 'connected',
        rows,
      });
    } catch (error) {
      console.error('Supabase health check failed:', error);
      return res.status(500).json({ error: 'Supabase health check failed' });
    }
  });

  app.get('/debug/encryption-test', (req, res) => {
    try {
      const original = 'hello';
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted);

      return res.json({
        original,
        encrypted,
        decrypted,
        success: decrypted === original,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Encryption test failed';
      return res.status(500).json({ error: message });
    }
  });

  app.listen(port, () => {
    console.log(`API server listening on :${port}`);
  });

  return app;
}

startServer().catch((error) => {
  console.error('Failed to start API server:', error);
  process.exit(1);
});

module.exports = { startServer };
