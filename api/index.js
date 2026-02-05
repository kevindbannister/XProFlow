require('dotenv').config();

const http = require('http');
const { supabase } = require('./supabaseClient');

const port = Number(process.env.PORT || 3001);

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url) {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname === '/health/supabase') {
      try {
        const { data, error } = await supabase
          .from('connected_accounts')
          .select('id')
          .limit(1);

        if (error) {
          throw error;
        }

        const rows = Array.isArray(data) ? data.length : 0;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            status: 'ok',
            supabase: 'connected',
            rows
          })
        );
        return;
      } catch (error) {
        console.error('Supabase health check failed:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            error: 'Supabase health check failed'
          })
        );
        return;
      }
    }
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(port, () => {
  console.log(`API server listening on :${port}`);
});
