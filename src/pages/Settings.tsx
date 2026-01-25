import { AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionTitle } from '../components/ui/SectionTitle';
import { settingsData } from '../lib/mockData';

const Settings = () => {
  return (
    <section className="space-y-6">
      <PageHeader title="Settings" subtitle="Personalize your XProFlow experience." />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <GlassCard padding="lg" className="space-y-5">
            <SectionTitle title="Profile settings" subtitle="Keep your account details up to date." />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500">Name</label>
                <Input defaultValue={settingsData.profile.name} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500">Email</label>
                <Input defaultValue={settingsData.profile.email} />
              </div>
            </div>
          </GlassCard>

          <GlassCard padding="lg" className="space-y-5">
            <SectionTitle title="Preferences" subtitle="Control how XProFlow writes and signs." />
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500">Tone</label>
                <Input defaultValue={settingsData.preferences.tone} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500">Signature</label>
                <textarea
                  defaultValue={settingsData.preferences.signature}
                  className="min-h-[120px] w-full rounded-2xl border border-blue-100 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard padding="lg" className="space-y-5">
            <SectionTitle title="Notifications" subtitle="Select what you want to hear about." />
            <div className="space-y-3">
              {settingsData.notifications.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-blue-100/70 bg-white/70 px-4 py-3"
                >
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <button
                    className={
                      item.enabled
                        ? 'relative h-6 w-11 rounded-full bg-blue-500'
                        : 'relative h-6 w-11 rounded-full bg-slate-200'
                    }
                  >
                    <span
                      className={
                        item.enabled
                          ? 'absolute right-1 top-1 h-4 w-4 rounded-full bg-white'
                          : 'absolute left-1 top-1 h-4 w-4 rounded-full bg-white'
                      }
                    />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard padding="lg" className="space-y-4 border border-rose-200/70 bg-rose-50/60">
            <SectionTitle title="Danger zone" subtitle="Disconnect providers or reset automation." />
            <div className="flex items-start gap-3 text-sm text-rose-700">
              <AlertTriangle className="mt-1 h-4 w-4" />
              <p>Disconnecting a provider stops syncing immediately. This is a placeholder action.</p>
            </div>
            <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-100">
              Disconnect provider
            </Button>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default Settings;
