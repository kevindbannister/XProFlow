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

      const folder = String(req.query.folder || 'INBOX');
      const { data, error } = await supabase
        .from('inbox_messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('folder', folder)
        .order('received_at', { ascending: false });

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
        const received = message.received_at ? new Date(message.received_at) : null;
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
