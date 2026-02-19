import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { supabase } from '../../lib/supabaseClient';

const formatDate = (value: unknown) => {
  if (!value || typeof value !== 'string') {
    return 'Not set';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
};

const formatBoolean = (value: unknown) => (value ? 'Active' : 'Inactive');

const FirmSettings = () => {
  const { firm, role, refresh } = useAppContext();
  const [firmName, setFirmName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!firm) {
      setFirmName('');
      return;
    }

    const nextFirmName = typeof firm.name === 'string'
      ? firm.name
      : (typeof firm.firm_name === 'string' ? firm.firm_name : '');

    setFirmName(nextFirmName);
  }, [firm]);

  const canEditFirmName = useMemo(() => {
    const normalizedRole = role?.toLowerCase();
    return normalizedRole === 'owner' || normalizedRole === 'admin';
  }, [role]);

  if (!firm) {
    return (
      <main className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:p-5">
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <h2 className="text-base font-semibold">Firm details are unavailable</h2>
          <p className="mt-2">We could not find your firm in the current session. Please sign in again.</p>
          <Link to="/login" className="mt-3 inline-block font-medium text-amber-800 underline">Return to login</Link>
        </section>
      </main>
    );
  }

  const nameColumn = Object.prototype.hasOwnProperty.call(firm, 'name') ? 'name' : 'firm_name';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canEditFirmName) {
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    setErrorMessage(null);

    const { error } = await supabase
      .from('firms')
      .update({ [nameColumn]: firmName.trim() })
      .eq('id', firm.id);

    if (error) {
      setErrorMessage(`Unable to update firm name: ${error.message}`);
      setIsSaving(false);
      return;
    }

    await refresh();
    setStatusMessage('Firm settings updated.');
    setIsSaving(false);
  };

  return (
    <main className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:p-5" aria-label="Firm settings page">
      <section className="min-h-[22rem] rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
        <header className="mb-6 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Settings</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Firm Settings</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Update your firm profile details and view current subscription limits.</p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="firm-name" className="text-xs font-semibold uppercase tracking-wide text-slate-500">Firm name</label>
            <input
              id="firm-name"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
              value={firmName}
              onChange={(event) => setFirmName(event.target.value)}
              disabled={!canEditFirmName || isSaving}
            />
            {!canEditFirmName ? <p className="text-xs text-slate-500">Only the firm owner can change this.</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trial end date</p>
              <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{formatDate(firm.trial_ends_at ?? firm.trial_end_date)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seat limit</p>
              <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{typeof firm.seat_limit === 'number' ? firm.seat_limit : 'Not set'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Firm status</p>
              <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{formatBoolean(firm.is_active)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created date</p>
              <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{formatDate(firm.created_at)}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!canEditFirmName || isSaving}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
            {statusMessage ? <p className="text-sm text-emerald-600">{statusMessage}</p> : null}
            {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
          </div>
        </form>
      </section>
    </main>
  );
};

export default FirmSettings;
