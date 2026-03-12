const SchedulingPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Scheduling</h1>
        <p className="text-gray-500">Set scheduling preferences AI can use in your email responses.</p>
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="timezone" className="mb-1 block text-sm font-medium">Timezone</label>
          <select id="timezone" className="w-full rounded-lg border p-2">
            <option>UTC</option>
            <option>Europe/London</option>
            <option>America/New_York</option>
          </select>
        </div>

        <div>
          <label htmlFor="duration" className="mb-1 block text-sm font-medium">Default meeting duration</label>
          <select id="duration" className="w-full rounded-lg border p-2">
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>60 minutes</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Availability grid</p>
          <div className="rounded-lg border border-dashed p-5 text-sm text-gray-500">Availability grid placeholder.</div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingPage;
