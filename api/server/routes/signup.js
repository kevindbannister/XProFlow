const {
  SUBSCRIPTION_STATUS,
  calculateTrialEndsAt,
  calculateTrialDaysRemaining,
} = require('../services/subscriptions');

function registerSignupRoutes(app, supabase) {
  app.post('/api/auth/signup', async (req, res) => {
    const { email, password, organisationName } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    try {
      const { data: created, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (userError || !created?.user) {
        throw userError || new Error('Failed to create user');
      }

      const orgName = organisationName || `${email.split('@')[0]}'s Workspace`;
      const { data: organisation, error: orgError } = await supabase
        .from('organisations')
        .insert({ owner_user_id: created.user.id, name: orgName })
        .select('id, name')
        .single();

      if (orgError || !organisation) {
        throw orgError || new Error('Failed to create organisation');
      }

      const trialStartedAt = new Date();
      const trialEndsAt = calculateTrialEndsAt(trialStartedAt, 14);

      const { error: subError } = await supabase.from('subscriptions').insert({
        organisation_id: organisation.id,
        status: SUBSCRIPTION_STATUS.TRIAL,
        trial_started_at: trialStartedAt.toISOString(),
        trial_ends_at: trialEndsAt.toISOString(),
      });

      if (subError) {
        throw subError;
      }

      return res.status(201).json({
        userId: created.user.id,
        organisation,
        subscription: {
          status: SUBSCRIPTION_STATUS.TRIAL,
          trialEndsAt: trialEndsAt.toISOString(),
          trialDaysRemaining: calculateTrialDaysRemaining(trialEndsAt),
        },
      });
    } catch (error) {
      console.error('Signup flow failed', error);
      return res.status(500).json({ error: 'Signup failed' });
    }
  });
}

module.exports = { registerSignupRoutes };
