import { FC, useState } from 'react';
import { teamMembers } from '../data/mockData';

interface TeamViewProps {
  visibility: Record<string, boolean>;
}

export const TeamView: FC<TeamViewProps> = ({ visibility }) => {
  const [members] = useState(teamMembers);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = () => {
    alert(`Invite sent to ${inviteEmail || 'email TBD'}`);
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      {visibility['team.members'] ? (
        <div className="glass-panel">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Team members</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Control who can access FlowMail AI.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-200">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{member.name}</td>
                    <td className="py-3">{member.email}</td>
                    <td className="py-3">{member.role}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
      {visibility['team.invite'] ? (
        <div className="glass-panel">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Invite team member</h3>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              placeholder="name@company.com"
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
            />
            <button onClick={handleInvite} className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow">
              Invite team member
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
