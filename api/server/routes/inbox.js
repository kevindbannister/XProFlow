const { requireUser } = require('../auth/supabaseAuth');

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function isSameMonth(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth()
  );
}

function registerInboxRoutes(app, supabase) {
  app.get('/api/inbox', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) {
        return;
      }

      const { data: connectedAccounts, error: accountsError } = await supabase
        .from('connected_accounts')
        .select('id')
        .eq('user_id', user.id)
        .eq('provider', 'google');

      if (accountsError) {
        throw accountsError;
      }

      if (!Array.isArray(connectedAccounts) || connectedAccounts.length === 0) {
        return res.json({ today: [], thisMonth: [], older: [] });
      }

      const connectedAccountIds = connectedAccounts.map((account) => account.id);

      const { data, error } = await supabase
        .from('gmail_messages_inbox')
        .select('*')
        .order('internal_date', { ascending: false })
        .in('connected_account_id', connectedAccountIds);

      if (error) {
        throw error;
      }

      const today = new Date();
      const grouped = {
        today: [],
        thisMonth: [],
        older: []
      };

      (data || []).forEach((message) => {
        const received = message.internal_date ? new Date(Number(message.internal_date)) : null;
        if (received && isSameDay(received, today)) {
          grouped.today.push(message);
        } else if (received && isSameMonth(received, today)) {
          grouped.thisMonth.push(message);
        } else {
          grouped.older.push(message);
        }
      });

      res.json(grouped);
    } catch (error) {
      console.error('Inbox fetch error:', error);
      res.status(500).json({ error: 'Failed to load inbox' });
    }
  });
}

module.exports = { registerInboxRoutes };
