const Settings = () => {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-slate-300">Manage team preferences, integrations, and inbox rules.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {['Team members', 'Inbox rules', 'Notifications', 'Integrations'].map((item) => (
          <div key={item} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm font-semibold text-white">{item}</p>
            <p className="mt-2 text-sm text-slate-400">Placeholder configuration module.</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Settings;
