const integrationCards = [
  'Gmail',
  'Office365',
  'Google Calendar',
  'Outlook Calendar',
  'Zoom',
];

const IntegrationsPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Integrations</h1>
        <p className="text-gray-500">Manage provider connections that power AI email automation.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {integrationCards.map((integration) => (
          <div key={integration} className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="font-medium">{integration}</p>
            <p className="mt-1 text-sm text-gray-500">Integration card placeholder.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;
