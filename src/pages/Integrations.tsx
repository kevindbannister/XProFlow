import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { integrationDefinitions } from '../lib/settingsData';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const statusStyles = {
  connected: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40',
  attention: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40',
  available: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60'
};

const Integrations = () => {
  const { gmailConnected, gmailEmail, csrfToken, refreshSession } = useAuth();

  const handleConnect = async () => {
    const response = await api.get<{ url: string }>('/api/gmail/authorize');
    window.location.href = response.url;
  };

  const handleDisconnect = async () => {
    if (!csrfToken) {
      return;
    }
    await api.post('/auth/google/disconnect', undefined, { 'x-csrf-token': csrfToken });
    await refreshSession();
  };

  const otherIntegrations = integrationDefinitions.filter(
    (integration) => integration.id !== 'gmail'
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Integrations
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Connect the tools X-ProFlow can reference when drafting or routing email.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Connected services
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Every integration is scoped to the data you approve.
            </p>
          </div>
          <Button type="button" variant="outline">
            Browse integrations
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Gmail</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Sync your primary inbox and draft replies in Gmail.
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  gmailConnected ? statusStyles.connected : statusStyles.available
                }`}
              >
                {gmailConnected ? 'connected' : 'available'}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Owner</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {gmailEmail || 'Not connected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last sync</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {gmailConnected ? 'Active session' : 'Not connected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Data shared</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Threads, drafts, send
                </span>
              </div>
            </div>
            <div className="mt-4">
              {gmailConnected ? (
                <Button type="button" variant="outline" size="sm" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              ) : (
                <Button type="button" variant="outline" size="sm" onClick={handleConnect}>
                  Connect Gmail
                </Button>
              )}
            </div>
          </div>
          {otherIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {integration.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {integration.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[integration.status]}`}
                >
                  {integration.status}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Owner</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {integration.owner}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last sync</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {integration.lastSync}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data shared</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {integration.dataShared}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Button type="button" variant="outline" size="sm">
                  {integration.primaryAction}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};

export default Integrations;
