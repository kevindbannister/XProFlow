const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();

async function startServer() {
  const { loadSecrets } = require('./bootstrap/secrets');
  await loadSecrets();

  const { registerGoogleAuth } = require('./auth/google');
  const { registerGmailRoutes } = require('./routes/gmail');
  const emailRoutes = require('./routes/email');
  const { registerInboxRoutes } = require('./routes/inbox');
  const { registerSessionRoutes } = require('./routes/session');
  const { registerFeatureFlagRoutes } = require('./routes/featureFlags');
  const { registerSignupRoutes } = require('./routes/signup');
  const { registerBillingRoutes } = require('./routes/billing');
  const { registerFirmRoutes } = require('./routes/firm');
  const { registerProfessionalContextRoutes } = require('./routes/professionalContext');
  const { encrypt, decrypt } = require('./encryption');

  const port = Number(process.env.SERVER_PORT || process.env.PORT || 3001);
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const supabaseAuth = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  const supabase = supabaseAdmin;

  app.locals.supabase = supabase;

  // ============================================
  // ✅ CLEAN PRODUCTION CORS
  // ============================================

  const allowedOrigin =
    process.env.FRONTEND_URL || 'https://app.xproflow.com';

  app.use(
    cors({
      origin: allowedOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Explicit preflight handler
  app.options('*', cors());

  // ============================================
  // BODY PARSING
  // ============================================

  app.use(cookieParser());

  // Stripe raw body must come before json parser
  app.use(
    '/api/billing/webhook',
    express.raw({ type: 'application/json' })
  );

  app.use(express.json());

  // ============================================
  // ROUTES
  // ============================================

  registerGoogleAuth(app, supabaseAdmin, supabaseAuth);
  registerSessionRoutes(app, supabase);
  registerFeatureFlagRoutes(app, supabase);
  registerSignupRoutes(app, supabase);
  registerBillingRoutes(app, supabase);
  registerFirmRoutes(app, supabase);
  registerGmailRoutes(app, supabase);
  app.use('/api/email', emailRoutes);
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
      const message =
        error instanceof Error ? error.message : 'Encryption test failed';
      return res.status(500).json({ error: message });
    }
  });

  // ============================================
  // START SERVER
  // ============================================

  app.listen(port, () => {
    console.log(`🚀 API server running on port ${port}`);
  });

  return app;
}

module.exports = { app, startServer };
