import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import GoogleSignInButton from '../components/GoogleSignInButton';
import AppLogo from '../components/branding/AppLogo';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithManual, refreshSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const callbackErrorMessage = useMemo(() => {
    const callbackError = new URLSearchParams(location.search).get('error');
    if (!callbackError) {
      return '';
    }

    const decodedError = decodeURIComponent(callbackError);
    switch (decodedError) {
      case 'oauth_exchange':
        return 'Google sign-in failed while exchanging the OAuth code for a session.';
      case 'oauth_callback':
        return 'Google sign-in failed in the callback step.';
      case 'no_session':
        return 'Google sign-in did not return a valid session. Please retry.';
      case 'app_user_fetch':
        return 'Signed in with Google, but your workspace user record is not ready yet. Please retry in a moment.';
      default:
        return `Google sign-in failed: ${decodedError}`;
    }
  }, [location.search]);

  useEffect(() => {
    if (callbackErrorMessage) {
      setError(callbackErrorMessage);
    }
  }, [callbackErrorMessage]);

  const handleLogin = async () => {
    // Keeps legacy local dev/demo login working.
    if (email.trim() === 'master' && password.trim() === 'master') {
      setError('');
      await loginWithManual();
      navigate('/dashboard');
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError(loginError.message);
      return;
    }

    await refreshSession();
    setError('');
    navigate('/dashboard');
  };

  return (
    <div
      className="auth-page flex min-h-screen items-center justify-center bg-slate-950 bg-cover bg-center bg-no-repeat px-6 py-12"
      style={{ backgroundImage: "url('/FlowBackground.svg')" }}
    >
      <Card
        variant="glass"
        className="w-full max-w-md space-y-4 border-white/30 bg-white/15 text-center shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-2xl"
      >
        <div className="mb-3 flex justify-center"><AppLogo className="h-10 w-auto" /></div>
        <h1 className="text-2xl font-semibold text-slate-950">Welcome back</h1>
        <p className="text-sm text-slate-700">Sign in to continue to your workspace.</p>
        <div className="space-y-3 text-left">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/45 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
            type="text"
            placeholder="Email or master"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/45 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
            type="password"
            placeholder="Password"
          />
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          <Button
            type="button"
            className="w-full border border-fuchsia-300/50 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-[0_14px_30px_rgba(109,40,217,0.35)] hover:brightness-110"
            onClick={handleLogin}
          >
            Sign in with password
          </Button>
          <p className="text-xs text-slate-700">No account? <Link className="font-medium text-fuchsia-700 hover:text-fuchsia-800" to="/signup">Create one</Link></p>
        </div>
        <GoogleSignInButton className="border border-indigo-300/50 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white shadow-[0_14px_30px_rgba(37,99,235,0.3)] hover:brightness-110" />
      </Card>
    </div>
  );
};

export default Login;
