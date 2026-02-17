const SUBSCRIPTION_STATUS = {
  TRIAL: 'trial',
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
};

function calculateTrialEndsAt(startDate = new Date(), trialDays = 14) {
  const date = new Date(startDate);
  date.setUTCDate(date.getUTCDate() + trialDays);
  return date;
}

function calculateTrialDaysRemaining(trialEndsAt, now = new Date()) {
  if (!trialEndsAt) return 0;
  const diffMs = new Date(trialEndsAt).getTime() - new Date(now).getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function mapStripeSubscriptionStatus(stripeStatus) {
  switch (stripeStatus) {
    case 'active':
    case 'incomplete':
    case 'incomplete_expired':
      return SUBSCRIPTION_STATUS.ACTIVE;
    case 'past_due':
    case 'unpaid':
      return SUBSCRIPTION_STATUS.PAST_DUE;
    case 'canceled':
      return SUBSCRIPTION_STATUS.CANCELLED;
    case 'trialing':
      return SUBSCRIPTION_STATUS.TRIAL;
    default:
      return SUBSCRIPTION_STATUS.CANCELLED;
  }
}

module.exports = {
  SUBSCRIPTION_STATUS,
  calculateTrialEndsAt,
  calculateTrialDaysRemaining,
  mapStripeSubscriptionStatus,
};
