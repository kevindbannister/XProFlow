import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState('Completing Google sign-in…');

  useEffect(() => {
    (async () => {
      setMsg('Exchanging OAuth for session…');

      const { data, error } = await supabase.auth.getSession();
      console.log('callback getSession:', { data, error });

      if (error) {
        console.error('OAuth callback error:', error);
        setMsg('OAuth error. Returning to login…');
        navigate('/login?error=oauth_callback', { replace: true });
        return;
      }

      if (data?.session) {
        setMsg('Signed in. Redirecting…');
        navigate('/dashboard', { replace: true });
        return;
      }

      setMsg('Finalising session…');
      setTimeout(async () => {
        const retry = await supabase.auth.getSession();
        console.log('callback retry getSession:', retry);

        if (retry.data?.session) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/login?error=no_session', { replace: true });
        }
      }, 800);
    })();
  }, [navigate]);

  return <div style={{ padding: 24 }}>{msg}</div>;
};

export default AuthCallback;
