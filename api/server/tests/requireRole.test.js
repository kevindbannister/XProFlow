const test = require('node:test');
const assert = require('node:assert/strict');
const { createRequireRole } = require('../middleware/requireRole');

function createRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function createSupabase({ user = null, profile = null, profileError = null } = {}) {
  return {
    auth: {
      async getUser() {
        return { data: { user }, error: user ? null : new Error('missing') };
      },
    },
    from(table) {
      assert.equal(table, 'profiles');
      return {
        select() {
          return this;
        },
        eq() {
          return this;
        },
        async maybeSingle() {
          return { data: profile, error: profileError };
        },
      };
    },
  };
}

test('requireRole responds 401 when user is missing', async () => {
  const supabase = createSupabase();
  const middleware = createRequireRole(supabase)('owner');
  const req = { headers: {} };
  const res = createRes();

  let calledNext = false;
  await middleware(req, res, () => {
    calledNext = true;
  });

  assert.equal(calledNext, false);
  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { error: 'Unauthorized' });
});

test('requireRole responds 403 with insufficient_permissions when role is not allowed', async () => {
  const supabase = createSupabase({
    user: { id: 'user_1' },
    profile: { role: 'staff', is_active: true },
  });
  const middleware = createRequireRole(supabase)('owner', 'admin');
  const req = { headers: { authorization: 'Bearer token' } };
  const res = createRes();

  let calledNext = false;
  await middleware(req, res, () => {
    calledNext = true;
  });

  assert.equal(calledNext, false);
  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { error: 'insufficient_permissions' });
});

test('requireRole calls next and decorates request for allowed role', async () => {
  const user = { id: 'user_1', email: 'owner@example.com' };
  const supabase = createSupabase({
    user,
    profile: { role: 'owner', is_active: true },
  });
  const middleware = createRequireRole(supabase)('owner');
  const req = { headers: { authorization: 'Bearer token' } };
  const res = createRes();

  let calledNext = false;
  await middleware(req, res, () => {
    calledNext = true;
  });

  assert.equal(calledNext, true);
  assert.equal(res.statusCode, 200);
  assert.equal(req.user, user);
  assert.equal(req.userRole, 'owner');
});
