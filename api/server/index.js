require('dotenv').config();

const express = require('express');
const { registerGoogleAuth } = require('./auth/google');
const { encrypt, decrypt } = require('./encryption');
const { supabase } = require('./supabaseClient');

const app = express();
const port = Number(process.env.PORT || 3001);

registerGoogleAuth(app);

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
      rows
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
    const message = error instanceof Error ? error.message : 'Encryption test failed';
    return res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`API server listening on :${port}`);
});

module.exports = { app };
