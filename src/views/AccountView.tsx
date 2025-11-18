import { FC, useState } from 'react';
import { userProfile } from '../data/mockData';

export const AccountView: FC = () => {
  const [profile] = useState(userProfile);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="glass-panel">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update your FlowMail AI identity.</p>
        <dl className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
          <div className="flex justify-between">
            <dt className="font-semibold text-slate-900 dark:text-white">Name</dt>
            <dd>{profile.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold text-slate-900 dark:text-white">Email</dt>
            <dd>{profile.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold text-slate-900 dark:text-white">Company</dt>
            <dd>{profile.company}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <button className="rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 dark:border-slate-700 dark:text-slate-200">
            Update profile
          </button>
        </div>
      </div>
      <div className="glass-panel">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Display</h3>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Dark mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Toggle for preview only.</p>
          </div>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${darkMode ? 'bg-slate-900' : 'bg-slate-200 dark:bg-slate-700'}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition ${darkMode ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
