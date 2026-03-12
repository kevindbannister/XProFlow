const AccountPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-gray-500">Manage your profile and account access settings.</p>
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium">User profile</p>
          <div className="mt-1 rounded-md border p-3 text-sm text-gray-600">Profile details placeholder.</div>
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
          <input id="email" className="w-full rounded-lg border p-2" placeholder="name@company.com" />
        </div>
        <div className="rounded-md border p-4">
          <p className="text-sm font-medium">Password reset</p>
          <button type="button" className="mt-2 rounded-md border px-3 py-2 text-sm">Send reset link</button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
