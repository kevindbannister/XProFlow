const { requireUser } = require('../auth/supabaseAuth');

function createRequireRole(supabase) {
  return (...allowedRoles) => {
    const normalizedRoles = allowedRoles
      .flat()
      .map((role) => String(role || '').trim().toLowerCase())
      .filter(Boolean);

    return async (req, res, next) => {
      const user = await requireUser(req, res, supabase);
      if (!user) {
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, is_active')
        .eq('user_id', user.id)
        .maybeSingle();

      const userRole = String(profile?.role || '').trim().toLowerCase();
      if (error || !profile || profile.is_active === false || !normalizedRoles.includes(userRole)) {
        return res.status(403).json({ error: 'insufficient_permissions' });
      }

      req.user = user;
      req.userRole = userRole;
      return next();
    };
  };
}

module.exports = { createRequireRole };
