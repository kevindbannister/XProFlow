const test = require('node:test');
const assert = require('node:assert/strict');
const { applySecretsToEnv } = require('../bootstrap/secrets');

function withEnvSnapshot(fn) {
  const snapshot = { ...process.env };
  try {
    fn();
  } finally {
    for (const key of Object.keys(process.env)) {
      if (!Object.prototype.hasOwnProperty.call(snapshot, key)) {
        delete process.env[key];
      }
    }
    for (const [key, value] of Object.entries(snapshot)) {
      process.env[key] = value;
    }
  }
}

test('applySecretsToEnv populates SUPABASE_ANON_KEY from VITE_SUPABASE_ANON_KEY fallback', () => {
  withEnvSnapshot(() => {
    delete process.env.SUPABASE_ANON_KEY;

    const keys = applySecretsToEnv({
      SUPABASE_URL: 'https://demo.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'anon-from-vite',
    });

    assert.equal(process.env.SUPABASE_ANON_KEY, 'anon-from-vite');
    assert.ok(keys.includes('SUPABASE_ANON_KEY'));
  });
});

test('applySecretsToEnv keeps explicit SUPABASE_ANON_KEY and does not override it', () => {
  withEnvSnapshot(() => {
    const keys = applySecretsToEnv({
      SUPABASE_ANON_KEY: 'anon-explicit',
      VITE_SUPABASE_ANON_KEY: 'anon-from-vite',
    });

    assert.equal(process.env.SUPABASE_ANON_KEY, 'anon-explicit');
    assert.equal(keys.filter((key) => key === 'SUPABASE_ANON_KEY').length, 1);
  });
});
