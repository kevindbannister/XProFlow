import { FormEvent, useState } from 'react';

interface LoginViewProps {
  onLogin: (username: string, password: string) => void;
  isDragAndDropEnabled: boolean;
  onToggleDragAndDrop: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginView = ({
  onLogin,
  isDragAndDropEnabled,
  onToggleDragAndDrop,
  isLoading = false,
  error = null,
}: LoginViewProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin(username.trim(), password);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-sky-100" />
      <div className="relative w-full max-w-lg rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-[0_35px_80px_rgba(15,23,42,0.15)] backdrop-blur-2xl sm:p-10">
        <div className="flex flex-col gap-3 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">Flowiee</span>
          <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500">
            Sign in with your master credentials to access your automation dashboard.
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-600" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Enter username"
          />
          <label className="block text-sm font-medium text-slate-600" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Enter password"
          />
          <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-600">
            <div>
              <p className="font-semibold text-slate-700">Dashboard drag &amp; drop</p>
              <p className="text-xs text-slate-500">Enable layout editing after login.</p>
            </div>
            <button
              type="button"
              onClick={onToggleDragAndDrop}
              aria-pressed={isDragAndDropEnabled}
              className={`inline-flex min-w-[72px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition ${
                isDragAndDropEnabled
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isDragAndDropEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-600">
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-xs text-slate-500">
          Use the master account to continue. Need help? Contact your administrator.
        </div>
      </div>
    </div>
  );
};
