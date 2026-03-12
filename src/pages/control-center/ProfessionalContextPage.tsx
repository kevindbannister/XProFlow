const ProfessionalContextPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Professional Context</h1>
        <p className="text-gray-500">Define business context to improve AI drafting and categorisation quality.</p>
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="company" className="mb-1 block text-sm font-medium">Company name</label>
          <input id="company" className="w-full rounded-lg border p-2" placeholder="Acme Inc." />
        </div>
        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium">Role</label>
          <input id="role" className="w-full rounded-lg border p-2" placeholder="Operations Manager" />
        </div>
        <div>
          <label htmlFor="preferences" className="mb-1 block text-sm font-medium">Communication preferences</label>
          <textarea id="preferences" className="min-h-24 w-full rounded-lg border p-3" placeholder="Preferred tone, detail level, and response style." />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalContextPage;
