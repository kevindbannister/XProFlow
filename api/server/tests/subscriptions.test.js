const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateTrialDaysRemaining,
  mapStripeSubscriptionStatus,
  SUBSCRIPTION_STATUS,
} = require('../services/subscriptions');

test('calculateTrialDaysRemaining returns rounded-up day count', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');
  const trialEndsAt = new Date('2026-01-03T01:00:00.000Z');
  const result = calculateTrialDaysRemaining(trialEndsAt, now);
  assert.equal(result, 3);
});

test('maps Stripe statuses to local statuses', () => {
  assert.equal(mapStripeSubscriptionStatus('trialing'), SUBSCRIPTION_STATUS.TRIAL);
  assert.equal(mapStripeSubscriptionStatus('active'), SUBSCRIPTION_STATUS.ACTIVE);
  assert.equal(mapStripeSubscriptionStatus('past_due'), SUBSCRIPTION_STATUS.PAST_DUE);
  assert.equal(mapStripeSubscriptionStatus('canceled'), SUBSCRIPTION_STATUS.CANCELLED);
});
