import { Check, Mail } from 'lucide-react';
import { connectedAccounts } from '../lib/mockData';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionTitle } from '../components/ui/SectionTitle';

const EmailSetup = () => {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Email Setup"
        subtitle="Connect your providers and control sync preferences."
        action={<Button variant="outline">View sync logs</Button>}
      />

      <GlassCard padding="lg" className="space-y-5">
        <SectionTitle title="Connect Email Provider" subtitle="Securely link your primary inbox." />
        <div className="flex flex-wrap gap-3">
          <Button>
            <Mail className="h-4 w-4" />
            Connect Microsoft 365
          </Button>
          <Button variant="soft">Connect Gmail</Button>
        </div>
      </GlassCard>

      <GlassCard padding="lg" className="space-y-5">
        <SectionTitle title="Connected Accounts" subtitle="Active mailboxes in your workspace." />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="pb-3">Provider</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Last Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100/60">
              {connectedAccounts.map((account) => (
                <tr key={account.id} className="text-sm">
                  <td className="py-3 font-medium text-slate-700">{account.provider}</td>
                  <td className="py-3">{account.email}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      <Check className="h-3 w-3" />
                      {account.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{account.lastSync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard padding="lg" className="space-y-5">
        <SectionTitle title="Sync Settings" subtitle="Control how XProFlow handles new emails." />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: 'Auto-categorize incoming mail',
              description: 'Apply smart tags and priority flags.'
            },
            {
              title: 'Sync every 15 minutes',
              description: 'Recommended for high-volume inboxes.'
            },
            {
              title: 'Enable AI drafting',
              description: 'Generate replies in your tone.'
            },
            {
              title: 'Daily digest summary',
              description: 'Receive a summary at 8:00 AM.'
            }
          ].map((setting) => (
            <div
              key={setting.title}
              className="flex items-center justify-between rounded-2xl border border-blue-100/70 bg-white/70 px-4 py-4"
            >
              <div>
                <p className="text-sm font-semibold text-slate-700">{setting.title}</p>
                <p className="mt-1 text-xs text-slate-500">{setting.description}</p>
              </div>
              <button className="relative h-6 w-11 rounded-full bg-blue-500 shadow-inner">
                <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
};

export default EmailSetup;
