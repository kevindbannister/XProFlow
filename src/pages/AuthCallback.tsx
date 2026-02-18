import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [msg, setMsg] = useState('Completing Google sign-in…');

  useEffect(() => {
    (async () => {
      setMsg('Exchanging OAuth for session…');

      try {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('error') || searchParams.get('error_description')) {
          navigate('/login?error=oauth_callback', { replace: true });
          return;
        }

        const code = searchParams.get('code');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('OAuth code exchange failed:', exchangeError);
            navigate('/login?error=oauth_exchange', { replace: true });
            return;
          }
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('OAuth callback session fetch failed:', error);
          navigate('/login?error=oauth_callback', { replace: true });
          return;
        }

        if (data?.session) {
          setMsg('Signed in. Redirecting…');
          await refreshSession();
          navigate('/dashboard', { replace: true });
          return;
        }

        setMsg('Finalising session…');
        const retry = await supabase.auth.getSession();
        if (retry.data?.session) {
          await refreshSession();
          navigate('/dashboard', { replace: true });
          return;
        }

        navigate('/login?error=no_session', { replace: true });
      } catch (callbackError) {
        console.error('Unexpected OAuth callback failure:', callbackError);
        navigate('/login?error=oauth_callback', { replace: true });
      }
    })();
  }, [navigate, refreshSession]);

  return <div style={{ padding: 24 }}>{msg}</div>;
};

export default AuthCallback;
