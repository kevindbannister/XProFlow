import { FC, useMemo, useState } from 'react';
import { RoleProfile } from '../types';
import { getRoleProfile, saveRoleProfile } from '../services/roleProfile';

const roleOptions = [
  'Qualified Accountant (ACA / ACCA / CIMA / CA)',
  'Part-Qualified Accountant',
  'Trainee / Apprentice Accountant',
  'Bookkeeper',
  'Tax Specialist',
  'Payroll Specialist',
  'Finance Manager',
  'Financial Controller',
  'Fractional FD / CFO',
  'Practice Manager',
  'Accounts Manager',
  'Client Manager',
  'Receptionist / Admin',
  'PA / Executive Assistant',
  'Practice Owner / Partner',
  'Sole Practitioner',
];

const responsibilitiesByCategory: Record<string, string[]> = {
  'Core accounting': [
    'Year-end accounts',
    'Management accounts',
    'Statutory reporting',
    'Month-end close',
    'Intercompany reconciliations',
    'Group structures',
  ],
  'Bookkeeping & day-to-day': [
    'Transaction processing',
    'Bank reconciliations',
    'VAT returns (UK)',
    'MTD compliance',
    'Cashflow tracking',
  ],
  Tax: ['Corporation tax', 'Personal tax returns', 'VAT advisory', 'Tax planning', 'HMRC correspondence', 'Enquiries & investigations'],
  Payroll: ['Payroll processing', 'Auto-enrolment pensions', 'CIS', 'RTI submissions', 'Payroll queries'],
  'Advisory & strategy': [
    'Business advisory',
    'Virtual FD / CFO support',
    'Forecasting & budgeting',
    'KPI reporting',
    'Pricing & profitability advice',
    'Funding & finance support',
  ],
  'Compliance & regulation': ['Companies House filings', 'Confirmation statements', 'AML checks', 'Practice compliance'],
  'Practice operations': ['Client onboarding', 'Engagement letters', 'Fee reviews', 'Credit control', 'Capacity & workflow management'],
  'Communication & people': ['Client email management', 'Client meetings', 'Team management', 'Delegation & task assignment'],
};

const industryOptions = [
  'SMEs / owner-managed businesses',
  'Trades & construction',
  'Property',
  'Retail & e-commerce',
  'Professional services',
  'Charities & not-for-profits',
];

const stepLabels = ['Primary role', 'Secondary roles', 'Responsibilities', 'Industry focus', 'Confirm'];

const helperTooltip =
  'We use this to tailor priority, tone, and workflow logic so that Flowiee feels like a finance-first assistant.';

const sectionClass =
  'rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60';

export const RolesSetupView: FC = () => {
  const [profile, setProfile] = useState<RoleProfile>(() => getRoleProfile());
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() =>
    Object.keys(responsibilitiesByCategory).reduce((acc, key) => ({ ...acc, [key]: key === 'Core accounting' }), {}),
  );

  const progress = (currentStep / stepLabels.length) * 100;

  const updateProfile = (updates: Partial<RoleProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      return saveRoleProfile(next);
    });
  };

  const handlePrimaryRoleSelect = (role: string) => {
    updateProfile({
      primaryRole: role,
      secondaryRoles: profile.secondaryRoles.filter((item) => item !== role),
    });
  };

  const handleSecondaryRoleToggle = (role: string) => {
    if (role === profile.primaryRole) {
      return;
    }
    const nextRoles = profile.secondaryRoles.includes(role)
      ? profile.secondaryRoles.filter((item) => item !== role)
      : [...profile.secondaryRoles, role];
    updateProfile({ secondaryRoles: nextRoles });
  };

  const handleResponsibilityToggle = (responsibility: string) => {
    const nextResponsibilities = profile.responsibilities.includes(responsibility)
      ? profile.responsibilities.filter((item) => item !== responsibility)
      : [...profile.responsibilities, responsibility];
    updateProfile({ responsibilities: nextResponsibilities });
  };

  const handleIndustryToggle = (industry: string) => {
    const nextIndustry = profile.industryFocus.includes(industry)
      ? profile.industryFocus.filter((item) => item !== industry)
      : [...profile.industryFocus, industry];
    updateProfile({ industryFocus: nextIndustry });
  };

  const canContinue = useMemo(() => {
    if (currentStep === 1) {
      return Boolean(profile.primaryRole);
    }
    if (currentStep === 3) {
      return profile.responsibilities.length >= 3;
    }
    return true;
  }, [currentStep, profile.primaryRole, profile.responsibilities.length]);

  const responsibilitiesCount = profile.responsibilities.length;

  return (
    <div className={sectionClass}>
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Roles &amp; responsibilities setup</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Define how you operate in finance</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Fast, focused setup to tune Flowiee’s prioritisation, draft tone, and workflows.
            </p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Step {currentStep} of 5</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-600 dark:text-slate-300">You can change this anytime.</span>
          <span className="flex items-center gap-1">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
              i
            </span>
            <span title={helperTooltip} className="cursor-help">
              Why it matters
            </span>
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {currentStep === 1 ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Choose your primary role</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                This helps Flowiee understand how you think and work.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {roleOptions.map((role) => {
                const selected = profile.primaryRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handlePrimaryRoleSelect(role)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      selected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200'
                    }`}
                  >
                    <span>{role}</span>
                    <span
                      className={`h-3 w-3 rounded-full border ${
                        selected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Do you also perform any of these roles?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Optional — select everything that applies.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {roleOptions.map((role) => {
                const isPrimary = role === profile.primaryRole;
                const selected = profile.secondaryRoles.includes(role);
                return (
                  <label
                    key={role}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      isPrimary
                        ? 'border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-500'
                        : selected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200'
                    }`}
                  >
                    <span>{role}</span>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleSecondaryRoleToggle(role)}
                      disabled={isPrimary}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Responsibilities</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select what you actually do — not just your job title.
              </p>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/60">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Selected responsibilities: {responsibilitiesCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Minimum 3 required</span>
            </div>
            <div className="space-y-4">
              {Object.entries(responsibilitiesByCategory).map(([category, items]) => {
                const isExpanded = expandedSections[category];
                return (
                  <div key={category} className="rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/60">
                    <button
                      type="button"
                      onClick={() => setExpandedSections((prev) => ({ ...prev, [category]: !prev[category] }))}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:text-slate-100"
                    >
                      <span>{category}</span>
                      <span className="text-xs text-slate-400">{isExpanded ? 'Hide' : 'Show'}</span>
                    </button>
                    {isExpanded ? (
                      <div className="space-y-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
                        {items.map((responsibility) => (
                          <label key={responsibility} className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
                            <span>{responsibility}</span>
                            <input
                              type="checkbox"
                              checked={profile.responsibilities.includes(responsibility)}
                              onChange={() => handleResponsibilityToggle(responsibility)}
                              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </label>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {currentStep === 4 ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Do you focus on any specific industries?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Optional — choose all that apply.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {industryOptions.map((industry) => {
                const selected = profile.industryFocus.includes(industry);
                return (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => handleIndustryToggle(industry)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      selected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200'
                    }`}
                  >
                    {industry}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {currentStep === 5 ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Review your profile</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Confirm everything looks right before saving.</p>
            </div>
            <div className="space-y-4">
              {[
                {
                  label: 'Primary role',
                  value: profile.primaryRole || 'Not set',
                  step: 1,
                },
                {
                  label: 'Secondary roles',
                  value: profile.secondaryRoles.length ? profile.secondaryRoles.join(', ') : 'None selected',
                  step: 2,
                },
                {
                  label: 'Responsibilities',
                  value: profile.responsibilities.length ? profile.responsibilities.join(', ') : 'None selected',
                  step: 3,
                },
                {
                  label: 'Industry focus',
                  value: profile.industryFocus.length ? profile.industryFocus.join(', ') : 'None selected',
                  step: 4,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{item.label}</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(item.step)}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <p className="font-semibold">Flowiee will use this information to:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-emerald-900">
                <li>Prioritise emails by risk, urgency, and relevance</li>
                <li>Match technical depth to your experience</li>
                <li>Draft replies in your voice</li>
                <li>Flag emails for delegation or advisory opportunities</li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {profile.lastUpdatedAt ? `Last updated ${new Date(profile.lastUpdatedAt).toLocaleString()}` : 'Not saved yet'}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
          >
            Back
          </button>
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
              disabled={!canContinue}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={() => updateProfile({})}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Save &amp; Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
