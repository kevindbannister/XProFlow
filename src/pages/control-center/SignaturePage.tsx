const SignaturePage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Signature</h1>
        <p className="text-gray-500">Manage the signature appended to AI-generated email drafts.</p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <label htmlFor="signatureEditor" className="mb-2 block font-medium">Signature editor</label>
        <textarea
          id="signatureEditor"
          className="min-h-32 w-full rounded-lg border p-3"
          placeholder="Best regards,\nYour Name"
        />
      </div>
    </div>
  );
};

export default SignaturePage;
