const DashboardPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-500">Monitor AI email automation performance and operational status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {['Automations Active', 'Drafts Generated', 'Rules Triggered'].map((label) => (
          <div key={label} className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold">--</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
