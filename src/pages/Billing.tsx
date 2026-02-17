import { useState } from 'react';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
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
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <Card>
        <p className="text-sm">Status: <strong>{subscription?.status || 'unknown'}</strong></p>
        {subscription?.status === 'trial' ? <p className="text-sm">Trial days left: {subscription.trialDaysRemaining ?? 0}</p> : null}
        <Button type="button" onClick={handleSubscribe} disabled={loading} className="mt-4">{loading ? 'Redirecting…' : 'Subscribe with Stripe Checkout'}</Button>
      </Card>
    </div>
  );
};

export default Billing;
