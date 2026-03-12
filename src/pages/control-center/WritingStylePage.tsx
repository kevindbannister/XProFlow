const WritingStylePage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Writing Style</h1>
        <p className="text-gray-500">Guide AI tone and voice for outgoing email drafts.</p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <label htmlFor="styleInstructions" className="mb-2 block font-medium">Style instructions</label>
        <textarea
          id="styleInstructions"
          className="min-h-40 w-full rounded-lg border p-3"
          placeholder="Example: Keep replies concise, professional, and solution-oriented."
        />
      </div>
    </div>
  );
};

export default WritingStylePage;
