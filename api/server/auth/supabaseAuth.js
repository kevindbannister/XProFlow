async function getUserFromRequest(req, supabase) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null;

  if (!token) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return null;
  }

  return data.user;
}

async function requireUser(req, res, supabase) {
  const user = await getUserFromRequest(req, supabase);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  return user;
}

module.exports = { getUserFromRequest, requireUser };
