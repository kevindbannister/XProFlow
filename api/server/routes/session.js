const { getUserFromRequest, requireUser } = require('../auth/supabaseAuth');
const { calculateTrialDaysRemaining } = require('../services/subscriptions');
const { isMasterUserEmail } = require('./featureFlags');

function registerSessionRoutes(app, supabase) {
  app.get('/api/me', async (req, res) => {
    try {
      const user = await getUserFromRequest(req, supabase);
      if (!user) {
        res.json({ authenticated: false });
        return;
      }

      const [{ data: connectedAccountData }, { data: orgData }] = await Promise.all([
        supabase
          .from('connected_accounts')
          .select('id, email')
          .eq('user_id', user.id)
          .eq('provider', 'google')
          .maybeSingle(),
        supabase
          .from('organisations')
          .select('id, name, subscriptions(status, trial_ends_at, current_period_end, cancel_at_period_end)')
          .eq('owner_user_id', user.id)
          .maybeSingle(),
      ]);

      const connectedGmailEmail = connectedAccountData?.email;

      const subscription = Array.isArray(orgData?.subscriptions)
        ? orgData?.subscriptions[0]
        : orgData?.subscriptions;

      res.json({
        authenticated: true,
        isMasterUser: isMasterUserEmail(user.email),
        user: { id: user.id, email: user.email },
        gmail: connectedGmailEmail
          ? {
              connected: true,
              email: connectedGmailEmail,
              connected_account_id: connectedAccountData?.id
            }
          : { connected: false },
        organisation: orgData ? { id: orgData.id, name: orgData.name } : undefined,
        subscription: subscription
          ? {
              status: subscription.status,
              trialEndsAt: subscription.trial_ends_at,
              trialDaysRemaining: calculateTrialDaysRemaining(subscription.trial_ends_at),
              currentPeriodEnd: subscription.current_period_end,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            }
          : undefined,
      });
    } catch (error) {
      console.error('Session check failed:', error);
      res.status(500).json({ error: 'Failed to load session' });
    }
  });

  app.post('/auth/google/disconnect', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) {
        return;
      }

      const { error: connectedAccountError } = await supabase
        .from('connected_accounts')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', 'google');

      if (connectedAccountError) {
        throw connectedAccountError;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Disconnect Gmail failed:', error);
      res.status(500).json({ error: 'Failed to disconnect Gmail' });
    }
  });

  app.post('/auth/logout', async (_req, res) => {
    res.status(204).send();
  });
}

module.exports = { registerSessionRoutes };
