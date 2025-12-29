import { useEffect, useMemo, useState } from 'react';
import { FeatureToggleGroup, FeatureTogglePanel } from './components/FeatureTogglePanel';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { BillingView } from './views/BillingView';
import { AccountView } from './views/AccountView';
import { SettingsView } from './views/SettingsView';
import { TeamView } from './views/TeamView';
import { DashboardView } from './views/DashboardView';
import { LoginView } from './views/LoginView';
import { MainView, SettingsTab } from './types';
import { authenticate, clearSession, getStoredSession, storeSession } from './services/auth';

const featureToggleGroups: FeatureToggleGroup[] = [
  {
    title: 'Pages',
    items: [
      { id: 'page.overview', label: 'Overview page' },
      { id: 'page.settings', label: 'Settings page' },
      { id: 'page.billing', label: 'Billing page' },
      { id: 'page.team', label: 'Team page' },
      { id: 'page.account', label: 'Account page' },
    ],
  },
  {
    title: 'Overview sections',
    items: [
      { id: 'overview.hero', label: 'Hero welcome' },
      { id: 'overview.metrics', label: 'Metrics cards' },
      { id: 'overview.activity', label: 'Automation activity chart' },
      { id: 'overview.categoryBreakdown', label: 'Category breakdown' },
      { id: 'overview.weeklySummary', label: 'Weekly summary' },
      { id: 'overview.quickActions', label: 'Quick actions' },
    ],
  },
  {
    title: 'Settings tabs',
    items: [
      { id: 'settings.tab.preferences', label: 'Preferences tab' },
      { id: 'settings.tab.emailRules', label: 'Email rules tab' },
      { id: 'settings.tab.draftReplies', label: 'Draft replies tab' },
      { id: 'settings.tab.followUps', label: 'Follow-ups tab' },
      { id: 'settings.tab.scheduling', label: 'Scheduling tab' },
      { id: 'settings.tab.meetingNotetaker', label: 'Meeting Notetaker tab' },
      { id: 'settings.tab.integrations', label: 'Integrations tab' },
      { id: 'settings.tab.faq', label: 'FAQ tab' },
    ],
  },
  {
    title: 'Settings: Preferences',
    items: [
      { id: 'settings.preferences.connectedAccounts', label: 'Connected email accounts' },
      { id: 'settings.preferences.general', label: 'General preferences' },
    ],
  },
  {
    title: 'Settings: Email rules',
    items: [
      { id: 'settings.emailRules.categories', label: 'Categories list' },
      { id: 'settings.emailRules.rules', label: 'Email rules builder' },
    ],
  },
  {
    title: 'Settings: Draft replies',
    items: [
      { id: 'settings.draftReplies.overview', label: 'AI draft overview' },
      { id: 'settings.draftReplies.prompt', label: 'Draft prompt editor' },
      { id: 'settings.draftReplies.signature', label: 'Signature editor' },
    ],
  },
  {
    title: 'Settings: Follow-ups',
    items: [{ id: 'settings.followUps.settings', label: 'Follow-up settings' }],
  },
  {
    title: 'Settings: Scheduling',
    items: [
      { id: 'settings.scheduling.settings', label: 'Scheduling settings' },
      { id: 'settings.scheduling.preview', label: 'Booking preview' },
    ],
  },
  {
    title: 'Settings: Meeting Notetaker',
    items: [{ id: 'settings.meetingNotetaker.table', label: 'Meeting notetaker table' }],
  },
  {
    title: 'Settings: Integrations',
    items: [
      { id: 'settings.integrations.compliance', label: 'Compliance services' },
      { id: 'settings.integrations.storage', label: 'Document storage' },
      { id: 'settings.integrations.apps', label: 'Integration cards' },
    ],
  },
  {
    title: 'Settings: FAQ',
    items: [{ id: 'settings.faq.list', label: 'FAQ list' }],
  },
  {
    title: 'Billing',
    items: [
      { id: 'billing.summary', label: 'Billing summary' },
      { id: 'billing.manage', label: 'Manage subscription button' },
    ],
  },
  {
    title: 'Team',
    items: [
      { id: 'team.members', label: 'Team members table' },
      { id: 'team.invite', label: 'Invite team member form' },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'account.profile', label: 'Profile card' },
      { id: 'account.display', label: 'Display settings' },
    ],
  },
];

const navItems: { label: string; value: MainView; featureId: string }[] = [
  { label: 'Overview', value: 'overview', featureId: 'page.overview' },
  { label: 'Settings', value: 'settings', featureId: 'page.settings' },
  { label: 'Billing', value: 'billing', featureId: 'page.billing' },
  { label: 'Team', value: 'team', featureId: 'page.team' },
  { label: 'Account', value: 'account', featureId: 'page.account' },
];

const settingsTabs: { label: string; value: SettingsTab; featureId: string }[] = [
  { label: 'Preferences', value: 'preferences', featureId: 'settings.tab.preferences' },
  { label: 'Email rules', value: 'emailRules', featureId: 'settings.tab.emailRules' },
  { label: 'Draft replies', value: 'draftReplies', featureId: 'settings.tab.draftReplies' },
  { label: 'Follow-ups', value: 'followUps', featureId: 'settings.tab.followUps' },
  { label: 'Scheduling', value: 'scheduling', featureId: 'settings.tab.scheduling' },
  { label: 'Meeting Notetaker', value: 'meetingNotetaker', featureId: 'settings.tab.meetingNotetaker' },
  { label: 'Integrations', value: 'integrations', featureId: 'settings.tab.integrations' },
  { label: 'FAQ', value: 'faq', featureId: 'settings.tab.faq' },
];

const App = () => {
  const [currentView, setCurrentView] = useState<MainView>('overview');
  const [currentSettingsTab, setCurrentSettingsTab] = useState<SettingsTab>('preferences');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [session, setSession] = useState(() => getStoredSession());
  const [featurePanelOpen, setFeaturePanelOpen] = useState(false);
  const [featureVisibility, setFeatureVisibility] = useState<Record<string, boolean>>(() => {
    return featureToggleGroups.reduce<Record<string, boolean>>((acc, group) => {
      group.items.forEach((item) => {
        acc[item.id] = true;
      });
      return acc;
    }, {});
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  const isFeatureEnabled = (id: string) => featureVisibility[id] ?? true;
  const isMaster = session?.username === 'master';
  const visibleNavItems = useMemo(() => navItems.filter((item) => isFeatureEnabled(item.featureId)), [featureVisibility]);
  const visibleSettingsTabs = useMemo(() => settingsTabs.filter((tab) => isFeatureEnabled(tab.featureId)), [featureVisibility]);

  useEffect(() => {
    const enabledViews = visibleNavItems.map((item) => item.value);
    if (enabledViews.length > 0 && !enabledViews.includes(currentView)) {
      setCurrentView(enabledViews[0]);
    }
  }, [currentView, visibleNavItems]);

  useEffect(() => {
    const enabledTabs = visibleSettingsTabs.map((tab) => tab.value);
    if (enabledTabs.length > 0 && !enabledTabs.includes(currentSettingsTab)) {
      setCurrentSettingsTab(enabledTabs[0]);
    }
  }, [currentSettingsTab, visibleSettingsTabs]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const content = useMemo(() => {
    switch (currentView) {
      case 'overview':
        return <DashboardView visibility={featureVisibility} isMaster={isMaster} />;
      case 'settings':
        return <SettingsView currentTab={currentSettingsTab} visibility={featureVisibility} />;
      case 'billing':
        return <BillingView visibility={featureVisibility} />;
      case 'team':
        return <TeamView visibility={featureVisibility} />;
      case 'account':
        return <AccountView visibility={featureVisibility} />;
      default:
        return null;
    }
  }, [currentSettingsTab, currentView, featureVisibility]);

  const handleLogin = (username: string, password: string) => {
    setLoginError(null);
    const nextSession = authenticate(username, password);
    if (!nextSession) {
      setLoginError('That username or password did not match the master account.');
      return;
    }

    storeSession(nextSession);
    setSession(nextSession);
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setCurrentView('overview');
    setFeaturePanelOpen(false);
  };

  if (!session) {
    return <LoginView onLogin={handleLogin} error={loginError} />;
  }

  const handleToggleFeature = (id: string) => {
    setFeatureVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen px-4 py-6 transition-colors duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <TopNav
          currentView={currentView}
          onChangeView={(view) => setCurrentView(view)}
          navItems={visibleNavItems.map(({ label, value }) => ({ label, value }))}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          onLogout={handleLogout}
          username={session.username}
          showFeatureToggles={isMaster}
          featurePanelOpen={featurePanelOpen}
          onToggleFeaturePanel={() => setFeaturePanelOpen((prev) => !prev)}
        />
        {isMaster ? (
          <FeatureTogglePanel
            isOpen={featurePanelOpen}
            groups={featureToggleGroups}
            toggles={featureVisibility}
            onToggle={handleToggleFeature}
            onClose={() => setFeaturePanelOpen(false)}
          />
        ) : null}
        {currentView === 'settings' ? (
          <div className="rounded-[40px] border border-white/60 bg-white/80 p-4 shadow-[0_35px_80px_rgba(15,23,42,0.15)] backdrop-blur-2xl sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              <Sidebar
                currentTab={currentSettingsTab}
                onSelectTab={(tab) => setCurrentSettingsTab(tab)}
                mobileOpen={sidebarOpen}
                setMobileOpen={setSidebarOpen}
                tabs={visibleSettingsTabs.map(({ label, value }) => ({ label, value }))}
              />
              <main className="flex-1">
                <div className="lg:hidden">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                  >
                    ☰ Settings menu
                  </button>
                </div>
                {content}
              </main>
            </div>
          </div>
        ) : (
          <main className="w-full">
            <div className="rounded-[40px] border border-white/60 bg-white/80 p-4 shadow-[0_35px_80px_rgba(15,23,42,0.15)] backdrop-blur-2xl sm:p-6">
              {content}
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default App;
