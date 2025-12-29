import { RoleProfile, ThinkingMode } from '../types';

const ROLE_PROFILE_KEY = 'flowiee.roleProfile';

const defaultProfile: RoleProfile = {
  primaryRole: '',
  secondaryRoles: [],
  responsibilities: [],
  industryFocus: [],
  lastUpdatedAt: null,
  thinkingMode: 'Processor',
};

const advisoryResponsibilities = new Set([
  'Business advisory',
  'Virtual FD / CFO support',
  'Forecasting & budgeting',
  'KPI reporting',
  'Pricing & profitability advice',
  'Funding & finance support',
]);

const reviewerResponsibilities = new Set([
  'Statutory reporting',
  'Month-end close',
  'Year-end accounts',
  'Management accounts',
  'Companies House filings',
  'Confirmation statements',
  'Practice compliance',
  'AML checks',
]);

const ownerRoles = new Set(['Practice Owner / Partner', 'Sole Practitioner', 'Fractional FD / CFO']);

const normalizeList = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

export const inferThinkingMode = (profile: RoleProfile): ThinkingMode => {
  const combinedRoles = [profile.primaryRole, ...profile.secondaryRoles].filter(Boolean);
  const responsibilities = profile.responsibilities;

  if (combinedRoles.some((role) => ownerRoles.has(role))) {
    return 'Owner';
  }

  if (responsibilities.some((item) => advisoryResponsibilities.has(item))) {
    return 'Advisor';
  }

  if (responsibilities.some((item) => reviewerResponsibilities.has(item))) {
    return 'Reviewer';
  }

  return 'Processor';
};

export const getRoleProfile = (): RoleProfile => {
  if (typeof window === 'undefined') {
    return defaultProfile;
  }

  const raw = window.localStorage.getItem(ROLE_PROFILE_KEY);
  if (!raw) {
    return defaultProfile;
  }

  try {
    const parsed = JSON.parse(raw) as RoleProfile;
    return {
      ...defaultProfile,
      ...parsed,
      secondaryRoles: normalizeList(parsed.secondaryRoles ?? []),
      responsibilities: normalizeList(parsed.responsibilities ?? []),
      industryFocus: normalizeList(parsed.industryFocus ?? []),
    };
  } catch (error) {
    console.warn('Unable to parse role profile', error);
    return defaultProfile;
  }
};

export const saveRoleProfile = (profile: RoleProfile): RoleProfile => {
  if (typeof window === 'undefined') {
    return profile;
  }

  const nextProfile: RoleProfile = {
    ...profile,
    secondaryRoles: normalizeList(profile.secondaryRoles),
    responsibilities: normalizeList(profile.responsibilities),
    industryFocus: normalizeList(profile.industryFocus),
    thinkingMode: inferThinkingMode(profile),
    lastUpdatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(ROLE_PROFILE_KEY, JSON.stringify(nextProfile));
  return nextProfile;
};
