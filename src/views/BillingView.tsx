import { FC } from 'react';
import { plan } from '../data/mockData';

interface BillingViewProps {
  visibility: Record<string, boolean>;
}

export const BillingView: FC<BillingViewProps> = ({ visibility }) => {
  return (
    <div className="glass-panel">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Billing overview</h2>
      {visibility['billing.summary'] ? (
        <>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your subscription and seats.</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Plan</dt>
              <dd className="text-base font-semibold text-slate-900 dark:text-slate-100">{plan.name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Seats used</dt>
              <dd className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {plan.seatsUsed}/{plan.seatsTotal}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Next billing date</dt>
              <dd className="text-base font-semibold text-slate-900 dark:text-slate-100">{plan.nextBillingDate}</dd>
            </div>
          </dl>
        </>
      ) : null}
      {visibility['billing.manage'] ? (
        <div className="mt-6">
          <button className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow">Manage subscription</button>
        </div>
      ) : null}
    </div>
  );
};
