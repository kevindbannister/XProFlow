require('dotenv').config();

const express = require('express');
const { registerGoogleAuth } = require('./auth/google');
const { encrypt, decrypt } = require('./utils/encryption');

const app = express();

registerGoogleAuth(app);

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

module.exports = { app };
