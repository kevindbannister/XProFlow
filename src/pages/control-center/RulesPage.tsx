const RulesPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Rules</h1>
        <p className="text-gray-500">Define logic that controls how AI handles incoming email workflows.</p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="font-medium">Rule builder</p>
        <div className="mt-3 rounded-lg border border-dashed p-5 text-sm text-gray-500">
          Rule builder placeholder for conditions, actions, and testing.
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
