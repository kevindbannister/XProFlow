const express = require('express');
const cors = require('cors');

const app = express();

async function startServer() {
  const { loadSecrets } = require('./bootstrap/secrets');
  await loadSecrets();

  const { registerGoogleAuth } = require('./auth/google');
  const { registerGmailRoutes } = require('./routes/gmail');
  const { registerInboxRoutes } = require('./routes/inbox');
  const { registerSessionRoutes } = require('./routes/session');
  const { registerFeatureFlagRoutes } = require('./routes/featureFlags');
  const { registerSignupRoutes } = require('./routes/signup');
  const { registerBillingRoutes } = require('./routes/billing');
  const { registerFirmRoutes } = require('./routes/firm');
  const { registerProfessionalContextRoutes } = require('./routes/professionalContext');
  const { getSupabaseClient } = require('./supabaseClient');
  const { encrypt, decrypt } = require('./encryption');

  const port = Number(process.env.SERVER_PORT || process.env.PORT || 3001);
  const supabase = getSupabaseClient();

  // ============================================
  // ✅ PRODUCTION SAFE CORS CONFIG
  // ============================================

  const allowedOrigin = process.env.FRONTEND_URL || 'https://app.xproflow.com';

  const corsOptions = {
    origin: function (origin, callback) {
      // Allow no-origin requests (like curl or server-to-server)
      if (!origin) return callback(null, true);

      if (origin === allowedOrigin) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  // ============================================
  // BODY PARSING
  // ============================================

  // Stripe signature validation needs raw body
  app.use('/api/billing/webhook', express.raw({ type: 'application/json' }));

  app.use(express.json());

  // ============================================
  // ROUTES
  // ============================================

  registerGoogleAuth(app, supabase);
  registerSessionRoutes(app, supabase);
  registerFeatureFlagRoutes(app, supabase);
  registerSignupRoutes(app, supabase);
  registerBillingRoutes(app, supabase);
  registerFirmRoutes(app, supabase);
  registerGmailRoutes(app, supabase);
  registerInboxRoutes(app, supabase);
  registerProfessionalContextRoutes(app, supabase);

  // ============================================
  // HEALTH
  // ============================================

  app.get('/health', (req, res) => {
    return res.status(200).json({ status: 'ok' });
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

  // ============================================
  // START SERVER
  // ============================================

  app.listen(port, () => {
    console.log(`API server listening on :${port}`);
  });

  return app;
}

module.exports = { app, startServer };
