import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import GoogleSignInButton from '../components/GoogleSignInButton';
import AppLogo from '../components/branding/AppLogo';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithManual } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

    setError('');
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12 dark:bg-slate-950">
      <Card className="w-full max-w-md space-y-4 text-center">
        <div className="mb-3 flex justify-center"><AppLogo className="h-10 w-auto" /></div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Welcome back</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to continue to your workspace.</p>
        <div className="space-y-3 text-left">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
            type="text"
            placeholder="Email or master"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
            type="password"
            placeholder="Password"
          />
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          <Button type="button" className="w-full" onClick={handleLogin}>Sign in with password</Button>
          <p className="text-xs text-slate-500">No account? <Link className="text-blue-600" to="/signup">Create one</Link></p>
        </div>
        <GoogleSignInButton />
      </Card>
    </div>
  );
};

export default Login;
