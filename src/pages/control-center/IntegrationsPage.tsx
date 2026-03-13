import {
  PrimaryButton,
  SecondaryButton,
  SettingsCard,
  SettingsPageShell
} from '../../components/control-center/SettingsUI';

const integrations = [
  { name: 'Gmail', logo: '📧', status: 'Connected' },
  { name: 'Office365', logo: '🧩', status: 'Not connected' },
  { name: 'Google Calendar', logo: '📅', status: 'Connected' },
  { name: 'Outlook Calendar', logo: '🗓️', status: 'Not connected' },
  { name: 'Zoom', logo: '🎥', status: 'Connected' }
];

const IntegrationsPage = () => (
  <SettingsPageShell
    title="Integrations"
    subtitle="Connect and manage third-party tools that power scheduling and inbox workflows."
  >
    <div className="grid gap-4 md:grid-cols-2">
      {integrations.map((integration) => (
        <SettingsCard key={integration.name} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">{integration.logo}</span>
            <div>
              <h2 className="text-base font-semibold text-slate-900">{integration.name}</h2>
              <p className="text-sm text-slate-500">Connection status: {integration.status}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <PrimaryButton type="button">Connect</PrimaryButton>
            <SecondaryButton type="button">Remove</SecondaryButton>
          </div>
        </SettingsCard>
      ))}
    </div>
  </SettingsPageShell>
);

export default IntegrationsPage;
