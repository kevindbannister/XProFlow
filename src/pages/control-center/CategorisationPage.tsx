const categories = ['Client Urgent', 'Follow Up', 'Scheduling', 'Finance', 'Internal'];

const CategorisationPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Categorisation</h1>
        <p className="text-gray-500">Control how AI categorizes your emails.</p>
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-medium">Enable automatic categorisation</p>
          <input type="checkbox" className="h-4 w-4" defaultChecked />
        </div>
        <div>
          <p className="mb-2 font-medium">Category list</p>
          <ul className="space-y-2 text-sm text-gray-600">
            {categories.map((category) => (
              <li key={category} className="rounded-md border px-3 py-2">{category}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategorisationPage;
