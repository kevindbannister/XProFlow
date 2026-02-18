const { requireUser } = require('../auth/supabaseAuth');

const FIRM_ROLES = ['owner', 'admin', 'staff'];

function isPrivilegedRole(role) {
  return role === 'owner' || role === 'admin';
}

function seatLimitExceeded(firm) {
  return Number(firm.seat_used || 0) >= Number(firm.seat_limit || 0);
}

async function loadMembership(supabase, userId) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('org_id, role, is_active')
    .eq('user_id', userId)
    .maybeSingle();

  if (profileError || !profile?.org_id || profile.is_active === false) {
    return null;
  }

  const { data: firm, error: firmError } = await supabase
    .from('organisations')
    .select('id, owner_user_id, seat_limit, seat_used')
    .eq('id', profile.org_id)
    .maybeSingle();

  if (firmError || !firm) {
    return null;
  }

  return {
    profile,
    firm,
  };
}

function registerFirmRoutes(app, supabase) {
  app.post('/api/firm/invite', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) return;

      const membership = await loadMembership(supabase, user.id);
      if (!membership) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const isOwner = membership.firm.owner_user_id === user.id;
      if (!isOwner && !isPrivilegedRole(membership.profile.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { email, role = 'staff' } = req.body || {};
      if (!email) {
        return res.status(400).json({ error: 'email is required' });
      }
      if (!FIRM_ROLES.includes(role)) {
        return res.status(400).json({ error: 'invalid role' });
      }

      if (seatLimitExceeded(membership.firm)) {
        return res.status(409).json({
          error: 'seat_limit_exceeded',
          upgrade_required: true,
        });
      }

      const { data: invite, error: inviteError } = await supabase
        .from('firm_invites')
        .insert({
          firm_id: membership.firm.id,
          email: email.toLowerCase(),
          role,
          invited_by: user.id,
          status: 'pending',
        })
        .select('id, email, role, status, created_at')
        .single();

      if (inviteError || !invite) {
        throw inviteError || new Error('Failed to create invite');
      }

      return res.status(201).json({ invite });
    } catch (error) {
      console.error('Failed to create invite', error);
      return res.status(500).json({ error: 'Failed to create invite' });
    }
  });

  app.post('/api/firm/invite/accept', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) return;

      const { inviteId } = req.body || {};
      if (!inviteId) {
        return res.status(400).json({ error: 'inviteId is required' });
      }

      const { data: invite, error: inviteError } = await supabase
        .from('firm_invites')
        .select('id, firm_id, email, role, status')
        .eq('id', inviteId)
        .eq('status', 'pending')
        .maybeSingle();

      if (inviteError || !invite) {
        return res.status(404).json({ error: 'Invite not found' });
      }

      if (invite.email.toLowerCase() !== String(user.email || '').toLowerCase()) {
        return res.status(403).json({ error: 'Invite email mismatch' });
      }

      const { data: firm, error: firmError } = await supabase
        .from('organisations')
        .select('id, seat_limit, seat_used')
        .eq('id', invite.firm_id)
        .single();

      if (firmError || !firm) {
        return res.status(404).json({ error: 'Firm not found' });
      }

      if (seatLimitExceeded(firm)) {
        return res.status(409).json({
          error: 'seat_limit_exceeded',
          upgrade_required: true,
        });
      }

      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          user_id: user.id,
          org_id: invite.firm_id,
          role: invite.role,
          is_active: true,
          deleted_at: null,
        },
        { onConflict: 'user_id' }
      );

      if (profileError) {
        throw profileError;
      }

      const nextSeatUsed = Number(firm.seat_used || 0) + 1;

      const [{ error: seatError }, { error: acceptError }] = await Promise.all([
        supabase.from('organisations').update({ seat_used: nextSeatUsed }).eq('id', firm.id),
        supabase
          .from('firm_invites')
          .update({ status: 'accepted', accepted_at: new Date().toISOString() })
          .eq('id', invite.id),
      ]);

      if (seatError || acceptError) {
        throw seatError || acceptError;
      }

      return res.status(200).json({ accepted: true });
    } catch (error) {
      console.error('Failed to accept invite', error);
      return res.status(500).json({ error: 'Failed to accept invite' });
    }
  });

  app.delete('/api/firm/users/:id', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) return;

      const membership = await loadMembership(supabase, user.id);
      if (!membership) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const isOwner = membership.firm.owner_user_id === user.id;
      if (!isOwner && !isPrivilegedRole(membership.profile.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const targetUserId = req.params.id;
      const { data: targetProfile, error: targetError } = await supabase
        .from('profiles')
        .select('user_id, org_id, is_active')
        .eq('user_id', targetUserId)
        .eq('org_id', membership.firm.id)
        .maybeSingle();

      if (targetError || !targetProfile) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (targetProfile.is_active === false) {
        return res.status(200).json({ removed: true });
      }

      const [{ error: deactivateError }, { error: seatError }] = await Promise.all([
        supabase
          .from('profiles')
          .update({ is_active: false, deleted_at: new Date().toISOString() })
          .eq('user_id', targetUserId),
        supabase
          .from('organisations')
          .update({ seat_used: Math.max(0, Number(membership.firm.seat_used || 0) - 1) })
          .eq('id', membership.firm.id),
      ]);

      if (deactivateError || seatError) {
        throw deactivateError || seatError;
      }

      return res.status(200).json({ removed: true });
    } catch (error) {
      console.error('Failed to remove firm user', error);
      return res.status(500).json({ error: 'Failed to remove firm user' });
    }
  });
}

module.exports = {
  registerFirmRoutes,
  isPrivilegedRole,
  seatLimitExceeded,
};
