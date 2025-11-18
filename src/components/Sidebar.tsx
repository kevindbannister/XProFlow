import { FC } from 'react';
import { SettingsTab } from '../types';

interface SidebarProps {
  currentTab: SettingsTab;
  onSelectTab: (tab: SettingsTab) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

const tabs: { label: string; value: SettingsTab }[] = [
  { label: 'Preferences', value: 'preferences' },
  { label: 'Email rules', value: 'emailRules' },
  { label: 'Draft replies', value: 'draftReplies' },
  { label: 'Follow-ups', value: 'followUps' },
  { label: 'Scheduling', value: 'scheduling' },
  { label: 'Meeting Notetaker', value: 'meetingNotetaker' },
  { label: 'Integrations', value: 'integrations' },
  { label: 'FAQ', value: 'faq' },
];

export const Sidebar: FC<SidebarProps> = ({ currentTab, onSelectTab, mobileOpen, setMobileOpen }) => {
  const content = (
    <div className="flex h-full flex-col gap-6 p-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Manage organization</p>
        <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <label className="text-xs text-slate-500">Organization</label>
          <select className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none">
            <option>Fyxer Consulting</option>
            <option>Atlas Advisory</option>
          </select>
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Settings</p>
        <div className="mt-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                onSelectTab(tab.value);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                currentTab === tab.value
                  ? 'bg-emerald-50 text-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {currentTab === tab.value && <span className="text-xs uppercase">Active</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-slate-50/60 lg:block">{content}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-y-0 left-0 w-72 max-w-full bg-white shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">Settings</p>
              <button onClick={() => setMobileOpen(false)} className="text-slate-500">
                ✕
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
