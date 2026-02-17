const { requireUser } = require('../auth/supabaseAuth');

const defaultUserContext = {
  primary_role: 'Accountant (Practice)',
  job_title_selected: 'Accountant',
  job_title_custom: '',
  seniority_level: 'Senior/Qualified',
  work_setting: 'Accounting Practice (public practice)',
  specialisms: [],
  audiences: ['Business owners / directors'],
  writing_style: 'Professional',
  risk_posture: 'Balanced (professional + pragmatic)',
  locale: 'en-GB',
  context_version: 1,
};

const defaultOrgContext = {
  firm_name: '',
  signature_block: '',
  disclaimer_text: '',
};

function registerProfessionalContextRoutes(app, supabase) {
  app.get('/api/professional-context', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('org_id').eq('user_id', user.id).maybeSingle();

      const [{ data: userContext }, { data: orgContext }] = await Promise.all([
        supabase.from('professional_context_user').select('*').eq('user_id', user.id).maybeSingle(),
        profile?.org_id
          ? supabase.from('professional_context_org').select('*').eq('org_id', profile.org_id).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      res.json({
        user: userContext ? { ...defaultUserContext, ...userContext } : defaultUserContext,
        org: orgContext ? { ...defaultOrgContext, ...orgContext } : defaultOrgContext,
      });
    } catch (error) {
      console.error('Failed loading professional context', error);
      res.status(500).json({ error: 'Failed to load professional context' });
    }
  });

  app.put('/api/professional-context', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) return;

      const payload = req.body || {};
      const { data: profile } = await supabase.from('profiles').select('org_id').eq('user_id', user.id).single();
      if (!profile?.org_id) return res.status(400).json({ error: 'Missing org context' });

      const userRow = {
        ...defaultUserContext,
        ...(payload.user || {}),
        user_id: user.id,
      };

      const orgRow = {
        ...defaultOrgContext,
        ...(payload.org || {}),
        org_id: profile.org_id,
      };

      const [{ error: userError }, { error: orgError }] = await Promise.all([
        supabase.from('professional_context_user').upsert(userRow, { onConflict: 'user_id' }),
        supabase.from('professional_context_org').upsert(orgRow, { onConflict: 'org_id' }),
      ]);

      if (userError || orgError) {
        throw userError || orgError;
      }

      return res.json({ user: userRow, org: orgRow });
    } catch (error) {
      console.error('Failed saving professional context', error);
      return res.status(500).json({ error: 'Failed to save professional context' });
    }
  });
}

module.exports = { registerProfessionalContextRoutes };
