import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { loginWithManual } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleManualLogin = () => {
    if (username.trim() === 'master' && password.trim() === 'master') {
      setError('');
      loginWithManual();
      navigate('/dashboard');
      return;
    }
    setError('Invalid credentials. Use "master" for both fields.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12 dark:bg-slate-950">
      <Card className="w-full max-w-md space-y-4 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            EmailAI
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue to your workspace.
          </p>
        </div>
        <div className="space-y-3 text-left">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Username
            </label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
              type="text"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Password
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
              type="password"
              placeholder="Enter password"
            />
          </div>
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          <Button type="button" className="w-full" onClick={handleManualLogin}>
            Sign in with password
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wide text-slate-400">
            <span className="bg-white px-2 dark:bg-slate-950">or</span>
          </div>
        </div>
        <GoogleSignInButton />
      </Card>
    </div>
  );
};

export default Login;
