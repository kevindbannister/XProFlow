import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const waitForSession = async (timeoutMs = 5000) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    if (data.session) {
      return data.session;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return null;
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [msg, setMsg] = useState('Completing Google sign-in…');

  useEffect(() => {
    (async () => {
      setMsg('Exchanging OAuth for session…');

      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.slice(1));

        const oauthError =
          searchParams.get('error_description') ||
          searchParams.get('error') ||
          hashParams.get('error_description') ||
          hashParams.get('error');

        if (oauthError) {
          console.error('OAuth callback query error:', oauthError);
          navigate(`/login?error=${encodeURIComponent(String(oauthError))}`, { replace: true });
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

        const session = await waitForSession();
        if (!session?.user?.id) {
          console.error('OAuth callback finished without an authenticated session.');
          navigate('/login?error=no_session', { replace: true });
          return;
        }

        setMsg('Finalizing account setup…');
        await refreshSession();

        const { data: refreshedSession } = await supabase.auth.getSession();
        if (!refreshedSession.session) {
          navigate('/login?error=app_user_fetch', { replace: true });
          return;
        }

        setMsg('Signed in. Redirecting…');
        navigate('/dashboard', { replace: true });
      } catch (callbackError) {
        console.error('Unexpected OAuth callback failure:', callbackError);
        navigate('/login?error=oauth_callback', { replace: true });
      }
    })();
  }, [navigate, refreshSession]);

  return <div style={{ padding: 24 }}>{msg}</div>;
};

export default AuthCallback;
