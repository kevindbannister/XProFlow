import { api } from './api';
import type { SubscriptionSnapshot } from '../types/billing';

export const createCheckoutSession = async () => {
  return api.post<{ url: string }>('/api/billing/checkout-session');
};

export const getSubscription = async () => {
  return api.get<SubscriptionSnapshot>('/api/billing/subscription');
};
