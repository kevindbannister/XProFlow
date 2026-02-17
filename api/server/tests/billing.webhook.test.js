const test = require('node:test');
const assert = require('node:assert/strict');
const { upsertSubscriptionFromStripe } = require('../routes/billing');

test('upsertSubscriptionFromStripe builds expected upsert payload', async () => {
  let capturedPayload;
  const supabase = {
    from() {
      return {
        upsert(payload) {
          capturedPayload = payload;
          return Promise.resolve({ error: null });
        },
      };
    },
  };

  await upsertSubscriptionFromStripe(supabase, 'org_123', {
    id: 'sub_123',
    status: 'past_due',
    current_period_end: 1767225600,
    cancel_at_period_end: false,
    items: { data: [{ price: { id: 'price_123' } }] },
  });

  assert.equal(capturedPayload.organisation_id, 'org_123');
  assert.equal(capturedPayload.stripe_subscription_id, 'sub_123');
  assert.equal(capturedPayload.status, 'past_due');
});
