const DraftingPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Drafting</h1>
        <p className="text-gray-500">Configure how AI creates draft replies for your inbox.</p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-medium">Enable AI draft generation</p>
          <input type="checkbox" className="h-4 w-4" defaultChecked />
        </div>
      </div>
    </div>
  );
};

export default DraftingPage;
