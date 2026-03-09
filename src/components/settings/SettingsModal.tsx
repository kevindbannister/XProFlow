import { useState } from 'react';
import type { ReactNode } from 'react';
import Labels from '../../pages/Labels';
import Billing from '../../pages/Billing';
import Integrations from '../../pages/Integrations';
import Rules from '../../pages/Rules';
import AccountSettings from '../../pages/settings/AccountSettings';
import SignatureTimeZoneSettings from '../../pages/settings/SignatureTimeZoneSettings';
import WritingStyleSettings from '../../pages/settings/WritingStyleSettings';
import { classNames } from '../../lib/utils';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ open, onClose, children }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div
        className="w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-background shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <button
          type="button"
          aria-label="Close settings modal"
          className="sr-only"
          onClick={onClose}
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

const sidebarItems = [
  { label: 'Rules', value: 'rules' },
  { label: 'Labels', value: 'labels' },
  { label: 'Writing Style', value: 'writing-style' },
  { label: 'Signature', value: 'signature' },
  { label: 'Account', value: 'account' },
  { label: 'Billing', value: 'billing' },
  { label: 'Integrations', value: 'integrations' }
] as const;

type SettingsTab = (typeof sidebarItems)[number]['value'];

const settingsContent: Record<SettingsTab, ReactNode> = {
  rules: <Rules />,
  labels: <Labels />,
  'writing-style': <WritingStyleSettings />,
  signature: <SignatureTimeZoneSettings />,
  account: <AccountSettings />,
  billing: <Billing />,
  integrations: <Integrations />
};

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('writing-style');

  return (
    <Modal open={open} onClose={onClose}>
      <section className="flex h-[80vh] min-h-[560px] w-full">
        <aside className="w-64 border-r bg-muted/20 p-4">
          <nav className="space-y-1" aria-label="Settings sections">
            {sidebarItems.map((item) => {
              const isActive = item.value === activeTab;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setActiveTab(item.value)}
                  className={classNames(
                    'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 font-medium text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">{settingsContent[activeTab]}</main>
      </section>
    </Modal>
  );
};
