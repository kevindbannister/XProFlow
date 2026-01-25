const Dashboard = () => {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Flowiee Dashboard</h1>
        <p className="text-sm text-slate-300">
          Welcome to Flowiee. Monitor inbox health and triage progress for your accounting team.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Open threads', value: '42' },
          { label: 'Awaiting client', value: '17' },
          { label: 'Resolved today', value: '9' }
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold text-white">Quick actions</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>Review flagged threads for missing documents.</li>
          <li>Assign new inbox rules to junior staff.</li>
          <li>Check SLA alerts before close of business.</li>
        </ul>
      </div>
    </section>
  );
};

export default Dashboard;
