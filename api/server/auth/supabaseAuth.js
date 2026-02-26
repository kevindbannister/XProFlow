const { createClient } = require('@supabase/supabase-js');

let supabase;

function getSupabaseAuthClient() {
  if (supabase) {
    return supabase;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  return supabase;
}

async function getUserFromRequest(req, providedSupabase) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const authClient = providedSupabase || getSupabaseAuthClient();
    if (!authClient) {
      return null;
    }

    const { data, error } = await authClient.auth.getUser(token);

    if (error || !data?.user) {
      return null;
    }

    return data.user;
  } catch (_error) {
    return null;
  }
}

async function requireUser(req, res, providedSupabase) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const authClient = providedSupabase || getSupabaseAuthClient();
    if (!authClient) {
      res.status(401).json({ error: 'Unauthorized' });
      return null;
    }

    const { data, error } = await authClient.auth.getUser(token);

    if (error || !data?.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return null;
    }

    req.user = data.user;
    return data.user;
  } catch (_error) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
}

module.exports = { getUserFromRequest, requireUser };
