import { useState } from 'react';
import {
  AtSign,
  Clock3,
  PenSquare,
  Shield,
  Tag,
  Menu,
  X
} from 'lucide-react';
import { xProFlowLogoDark, xProFlowLogoLight } from '../components/layout/logoAssets';
import '../styles/settings-page.css';

type SettingsCategoryId = 'rules' | 'labels' | 'writingStyle' | 'signatureTimeZone' | 'account';

type SettingsCategory = {
  id: SettingsCategoryId;
  label: string;
  icon: typeof Shield;
  title: string;
  subtitle: string;
  sections: Array<{ heading: string; description: string }>;
};

const categories: SettingsCategory[] = [
  {
    id: 'rules',
    label: 'Rules',
    icon: Shield,
    title: 'Rules',
    subtitle: 'Control automation, approvals, and send protections.',
    sections: [
      { heading: 'Approval rules', description: 'Require manual review for key contacts and high-risk drafts.' },
      { heading: 'Automation scope', description: 'Set when assistant drafting is enabled and when it should pause.' },
      { heading: 'Quiet hours', description: 'Prevent accidental sends outside your preferred working times.' }
    ]
  },
  {
    id: 'labels',
    label: 'Labels',
    icon: Tag,
    title: 'Labels',
    subtitle: 'Organize inbound and drafted messages with consistent tags.',
    sections: [
      { heading: 'Default labels', description: 'Apply a review label automatically to generated drafts.' },
      { heading: 'Smart categorization', description: 'Use topic-driven labels for billing, support, and follow-ups.' },
      { heading: 'Archive behavior', description: 'Move low-priority labeled threads out of your primary inbox.' }
    ]
  },
  {
    id: 'writingStyle',
    label: 'Writing Style',
    icon: PenSquare,
    title: 'Writing Style',
    subtitle: 'Tune voice, formality, and response structure in drafts.',
    sections: [
      { heading: 'Tone preset', description: 'Keep a friendly and professional voice across all conversations.' },
      { heading: 'Response length', description: 'Choose concise defaults while allowing detailed replies when needed.' },
      { heading: 'Formatting', description: 'Enable clean summaries and action-first paragraph structure.' }
    ]
  },
  {
    id: 'signatureTimeZone',
    label: 'Signature & Time Zone',
    icon: Clock3,
    title: 'Signature & Time Zone',
    subtitle: 'Set identity details and schedule behavior.',
    sections: [
      { heading: 'Signature block', description: 'Attach your preferred signature to outbound drafts by default.' },
      { heading: 'Send scheduling', description: 'Use your local time zone when suggesting delayed send times.' },
      { heading: 'Availability notes', description: 'Optionally include office hours in generated responses.' }
    ]
  },
  {
    id: 'account',
    label: 'Account',
    icon: AtSign,
    title: 'Account',
    subtitle: 'Manage profile, security, and personal preferences.',
    sections: [
      { heading: 'Profile', description: 'Update display name and account metadata used in your workspace.' },
      { heading: 'Security', description: 'Configure two-factor authentication and sign-in protections.' },
      { heading: 'Notifications', description: 'Choose product updates and assistant activity alerts.' }
    ]
  }
];

const Settings = () => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategoryId>('rules');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const selectedCategory =
    categories.find((category) => category.id === activeCategory) ?? categories[0];

  return (
    <main className="settings-page-light" aria-label="Settings page">
      <button
        type="button"
        className="settings-mobile-toggle"
        onClick={() => setMobileNavOpen((prev) => !prev)}
        aria-label="Toggle settings navigation"
        aria-expanded={mobileNavOpen}
      >
        {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
        <span>Settings Menu</span>
      </button>

      <section className="settings-layout">
        <aside className={`settings-nav ${mobileNavOpen ? 'is-open' : ''}`} aria-label="Settings sidebar">
          {/* Compact brand rail */}
          <div className="settings-rail" aria-hidden="true">
            <div className="settings-rail__brand">
              <img src={xProFlowLogoDark} alt="XProFlow" className="settings-rail__brand-image settings-rail__brand-image--light" />
              <img src={xProFlowLogoLight} alt="XProFlow" className="settings-rail__brand-image settings-rail__brand-image--dark" />
            </div>
          </div>

          {/* Primary category list: only required settings groups */}
          <div className="settings-menu-panel">
            <header>
              <h1>Settings</h1>
            </header>
            <nav>
              <ul>
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = category.id === selectedCategory.id;

                  return (
                    <li key={category.id}>
                      <button
                        type="button"
                        className={`settings-menu-item ${isActive ? 'is-active' : ''}`}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setMobileNavOpen(false);
                        }}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon size={14} strokeWidth={1.75} />
                        <span>{category.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Right-side content panel updates based on active category */}
        <section className="settings-content-panel" aria-live="polite">
          <header className="settings-content-panel__header">
            <p className="settings-kicker">Category</p>
            <h2>{selectedCategory.title}</h2>
            <p>{selectedCategory.subtitle}</p>
          </header>

          <div className="settings-content-grid">
            {selectedCategory.sections.map((section) => (
              <article key={section.heading} className="settings-content-card">
                <h3>{section.heading}</h3>
                <p>{section.description}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Settings;
