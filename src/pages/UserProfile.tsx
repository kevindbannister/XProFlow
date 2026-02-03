import type { FormEvent } from 'react';
import { useState } from 'react';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';
import { getUserInitials, useUser } from '../context/UserContext';

const UserProfile = () => {
  const { user, updateProfile } = useUser();
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile({ name });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User profile"
        subtitle="Update your personal details and keep your account information current."
      />

      <Card>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center gap-4">
            <Avatar
              src={user.avatarUrl}
              alt={user.name}
              fallback={getUserInitials(user.name)}
              className="h-14 w-14 rounded-full bg-gray-200 text-base font-semibold text-gray-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Name
              </label>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Email
              </label>
              <Input value={user.email} readOnly className="bg-gray-100 text-slate-500" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">Save changes</Button>
            {saved && (
              <span className="text-sm font-medium text-emerald-600">
                Changes saved
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserProfile;
