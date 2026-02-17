const Stripe = require('stripe');
const { requireUser } = require('../auth/supabaseAuth');
const {
  mapStripeSubscriptionStatus,
  calculateTrialDaysRemaining,
} = require('../services/subscriptions');

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  return new Stripe(secretKey);
}

async function upsertSubscriptionFromStripe(supabase, organisationId, subscription) {
  const mappedStatus = mapStripeSubscriptionStatus(subscription.status);

  const payload = {
    organisation_id: organisationId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: subscription.items?.data?.[0]?.price?.id || null,
    status: mappedStatus,
    current_period_end: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null,
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    metadata: {
      source: 'stripe-webhook',
      rawStatus: subscription.status,
    },
  };

  const { error } = await supabase
    .from('subscriptions')
    .upsert(payload, { onConflict: 'organisation_id' });

  if (error) {
    throw error;
  }
}

function registerBillingRoutes(app, supabase) {
  app.post('/api/billing/checkout-session', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) return;

      const { data: organisation, error: orgError } = await supabase
        .from('organisations')
        .select('id, stripe_customer_id, name')
        .eq('owner_user_id', user.id)
        .single();

      if (orgError || !organisation) {
        return res.status(404).json({ error: 'Organisation not found' });
      }

      const stripe = getStripeClient();
      const priceId = process.env.STRIPE_PRICE_ID;
      if (!priceId) {
        return res.status(500).json({ error: 'Missing STRIPE_PRICE_ID' });
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: organisation.stripe_customer_id || undefined,
        customer_email: user.email,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.APP_URL}/billing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}/billing?cancelled=true`,
        metadata: {
          organisation_id: organisation.id,
          user_id: user.id,
        },
      });

      return res.json({ url: session.url });
    } catch (error) {
      console.error('Checkout session error', error);
      return res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  app.post('/api/billing/webhook', async (req, res) => {
    const signature = req.headers['stripe-signature'];

    try {
      const stripe = getStripeClient();
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
        const subscription = event.data.object;
        const organisationId = subscription.metadata?.organisation_id;

        if (!organisationId) {
          return res.status(200).json({ skipped: true, reason: 'No organisation_id metadata' });
        }

        await upsertSubscriptionFromStripe(supabase, organisationId, subscription);
      }

      if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        const organisationId = subscription.metadata?.organisation_id;
        if (organisationId) {
          await upsertSubscriptionFromStripe(supabase, organisationId, {
            ...subscription,
            status: 'canceled',
          });
        }
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('Stripe webhook failure', error);
      return res.status(400).json({ error: 'Invalid webhook' });
    }
  });

  app.get('/api/billing/subscription', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) return;

      const { data, error } = await supabase
        .from('organisations')
        .select('id, subscriptions(status, trial_ends_at, current_period_end, cancel_at_period_end)')
        .eq('owner_user_id', user.id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'No subscription found' });
      }

      const subscription = Array.isArray(data.subscriptions)
        ? data.subscriptions[0]
        : data.subscriptions;

      return res.json({
        status: subscription?.status,
        trialDaysRemaining: calculateTrialDaysRemaining(subscription?.trial_ends_at),
        trialEndsAt: subscription?.trial_ends_at,
        currentPeriodEnd: subscription?.current_period_end,
        cancelAtPeriodEnd: subscription?.cancel_at_period_end,
      });
    } catch (error) {
      console.error('Failed to get subscription', error);
      return res.status(500).json({ error: 'Failed to load subscription' });
    }
  });
}

module.exports = { registerBillingRoutes, upsertSubscriptionFromStripe };
