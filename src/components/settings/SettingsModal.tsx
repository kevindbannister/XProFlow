import { useEffect, useState } from 'react';
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
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const [isMounted, setIsMounted] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      return;
    }

    const timeout = window.setTimeout(() => setIsMounted(false), 200);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <div
      className={classNames(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 transition-opacity duration-200',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <div
        className={classNames(
          'w-full max-w-6xl overflow-hidden rounded-2xl border border-white/40 bg-background/75 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-background/65 transition-all duration-200 ease-out',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
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
  isOpen: boolean;
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

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('writing-style');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className="flex h-[80vh] min-h-[560px] w-full bg-gradient-to-br from-white/35 via-white/20 to-white/10">
        <aside className="w-64 border-r border-white/30 bg-white/35 p-4 backdrop-blur-md">
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

        <main className="flex-1 overflow-y-auto bg-white/40 p-8 backdrop-blur-sm">{settingsContent[activeTab]}</main>
      </section>
    </Modal>
  );
};
