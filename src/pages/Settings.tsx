import { useMemo, useState } from 'react';
import '../styles/settings-page.css';

type SettingCategoryId = 'rules' | 'labels' | 'writing-style' | 'signature-time-zone' | 'account';

type SettingCategory = {
  id: SettingCategoryId;
  label: string;
  title: string;
  description: string;
  content: {
    heading: string;
    body: string;
  }[];
};

const settingCategories: SettingCategory[] = [
  {
    id: 'rules',
    label: 'Rules',
    title: 'Rules',
    description: 'Create and manage automation logic for incoming and outgoing communication.',
    content: [
      {
        heading: 'Auto-routing rules',
        body: 'Define how specific senders, keywords, or urgency tags should be routed.'
      },
      {
        heading: 'Approval conditions',
        body: 'Set clear thresholds for when a draft must be manually reviewed before sending.'
      },
      {
        heading: 'Priority handling',
        body: 'Apply custom processing for VIP contacts and time-sensitive conversations.'
      }
    ]
  },
  {
    id: 'labels',
    label: 'Labels',
    title: 'Labels',
    description: 'Organize your inbox and workflows using consistent, human-readable labels.',
    content: [
      {
        heading: 'System labels',
        body: 'Review auto-generated labels applied by workflows and rule triggers.'
      },
      {
        heading: 'Custom labels',
        body: 'Create your own categories to match team processes and internal naming conventions.'
      },
      {
        heading: 'Label visibility',
        body: 'Choose which labels are shown in thread views, list views, and notifications.'
      }
    ]
  },
  {
    id: 'writing-style',
    label: 'Writing Style',
    title: 'Writing Style',
    description: 'Configure tone, voice, and structure preferences for generated drafts.',
    content: [
      {
        heading: 'Tone presets',
        body: 'Use neutral, friendly, or formal defaults based on recipient context.'
      },
      {
        heading: 'Preferred formatting',
        body: 'Control greeting styles, paragraph length, and sign-off phrasing consistency.'
      },
      {
        heading: 'Message constraints',
        body: 'Set writing boundaries such as brevity, no emojis, or high-clarity language.'
      }
    ]
  },
  {
    id: 'signature-time-zone',
    label: 'Signature & Time Zone',
    title: 'Signature & Time Zone',
    description: 'Manage sender signature details and scheduling behavior by local time.',
    content: [
      {
        heading: 'Default signature',
        body: 'Set your primary sign-off and footer details for all outbound drafts.'
      },
      {
        heading: 'Contextual signature blocks',
        body: 'Create alternate signatures for internal, external, or region-based correspondence.'
      },
      {
        heading: 'Time zone preferences',
        body: 'Schedule send windows and reminders based on your preferred working hours.'
      }
    ]
  },
  {
    id: 'account',
    label: 'Account',
    title: 'Account',
    description: 'Update profile details, security controls, and personal account preferences.',
    content: [
      {
        heading: 'Profile information',
        body: 'Edit your display name, email identity, and account metadata.'
      },
      {
        heading: 'Security settings',
        body: 'Manage sign-in methods, session visibility, and account protection options.'
      },
      {
        heading: 'Data management',
        body: 'Review export controls and retention behavior for personal settings data.'
      }
    ]
  }
];

const Settings = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<SettingCategoryId>('rules');

  const activeCategory = useMemo(
    () => settingCategories.find((category) => category.id === activeCategoryId) ?? settingCategories[0],
    [activeCategoryId]
  );

  return (
    <main className="settings-layout" aria-label="Settings page">
      {/* Fixed sidebar navigation with only required setting categories */}
      <aside className="settings-sidebar" aria-label="Settings categories">
        <div className="settings-sidebar__header">
          <h1>Settings</h1>
          <p>Manage workspace preferences in one place.</p>
        </div>

        <nav>
          <ul className="settings-sidebar__list">
            {settingCategories.map((category) => {
              const isActive = category.id === activeCategoryId;

              return (
                <li key={category.id}>
                  <button
                    type="button"
                    className={`settings-sidebar__item ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveCategoryId(category.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {category.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Right content panel that updates based on selected category */}
      <section className="settings-content" aria-live="polite">
        <header className="settings-content__header">
          <h2>{activeCategory.title}</h2>
          <p>{activeCategory.description}</p>
        </header>

        {/* Content cards keep hierarchy clean and easy to scan */}
        <div className="settings-content__grid">
          {activeCategory.content.map((item) => (
            <article key={item.heading} className="settings-card">
              <h3>{item.heading}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Settings;
