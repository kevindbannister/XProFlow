export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'cancelled';

export type SubscriptionSnapshot = {
  status: SubscriptionStatus;
  trialEndsAt?: string;
  trialDaysRemaining?: number;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
};
