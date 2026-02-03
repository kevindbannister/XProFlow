export type OnboardingStatus = 'complete' | 'in-progress' | 'todo';

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  status: OnboardingStatus;
  actionLabel: string;
};

export type OnboardingAccount = {
  id: string;
  provider: string;
  address: string;
  status: 'connected' | 'needs-review' | 'pending';
  lastSync: string;
};

export type PreferenceToggle = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export type SettingsSection = {
  id: string;
  title: string;
  description: string;
  path: string;
  items: string[];
};

export type LabelDefinition = {
  id: string;
  name: string;
  description: string;
  color: string;
  appliedCount: number;
  enabled: boolean;
  updatedAt: string;
};

export type RuleDefinition = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: string;
  conditions: string[];
  actions: string[];
  lastRun: string;
};

export type IntegrationDefinition = {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'available' | 'attention';
  owner: string;
  lastSync: string;
  dataShared: string;
  primaryAction: string;
};

export type WorkflowDefinition = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  trigger: string;
  steps: string[];
  lastUpdated: string;
};
