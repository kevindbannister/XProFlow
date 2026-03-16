import { useState } from 'react';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { createCheckoutSession } from '../lib/billing';
import { useAuth } from '../context/AuthContext';

const Billing = () => {
  const { subscription } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { url } = await createCheckoutSession();
      window.location.href = url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-6xl flex-col gap-5">
      <PageHeader
        title="Billing"
        subtitle="Manage your plan, trial status, and upgrade path without leaving the dashboard."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <StatCard label="Subscription status" value={subscription?.status || 'unknown'} />
        <StatCard label="Trial days left" value={subscription?.trialDaysRemaining ?? 0} />
        <StatCard label="Checkout" value="Stripe" />
      </div>

      <Card className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-content-primary">Plan access</h2>
          <p className="text-sm text-content-secondary">
            Upgrade to keep automation, drafting, and control-center features available across your workspace.
          </p>
        </div>
        <p className="text-sm text-content-secondary">
          Status: <strong className="font-semibold text-content-primary">{subscription?.status || 'unknown'}</strong>
        </p>
        {subscription?.status === 'trial' ? (
          <p className="text-sm text-content-secondary">Trial days left: {subscription.trialDaysRemaining ?? 0}</p>
        ) : null}
        <Button type="button" onClick={handleSubscribe} disabled={loading}>
          {loading ? 'Redirecting…' : 'Subscribe with Stripe Checkout'}
        </Button>
      </Card>
    </div>
  );
};

export default Billing;
