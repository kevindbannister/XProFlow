import { FC } from 'react';
import { plan } from '../data/mockData';

export const BillingView: FC = () => {
  return (
    <div className="glass-panel">
      <h2 className="text-lg font-semibold text-slate-900">Billing overview</h2>
      <p className="mt-1 text-sm text-slate-500">Manage your subscription and seats.</p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase text-slate-500">Plan</dt>
          <dd className="text-base font-semibold text-slate-900">{plan.name}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">Seats used</dt>
          <dd className="text-base font-semibold text-slate-900">
            {plan.seatsUsed}/{plan.seatsTotal}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">Next billing date</dt>
          <dd className="text-base font-semibold text-slate-900">{plan.nextBillingDate}</dd>
        </div>
      </dl>
      <div className="mt-6">
        <button className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow">Manage subscription</button>
      </div>
    </div>
  );
};
