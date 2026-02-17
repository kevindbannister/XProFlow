export type PrimaryRole =
  | 'Accountant (Practice)'
  | 'Finance Director / CFO'
  | 'Financial Controller'
  | 'Finance Manager'
  | 'Management Accountant / FP&A'
  | 'Bookkeeper'
  | 'Tax Advisor'
  | 'Payroll Specialist'
  | 'Practice Manager / Operations'
  | 'Other';

export type SeniorityLevel =
  | 'Owner/Partner'
  | 'Director/Head of Finance'
  | 'Manager'
  | 'Senior/Qualified'
  | 'Junior/Trainee/Assistant';

export type WorkSetting =
  | 'Accounting Practice (public practice)'
  | 'In-house / Industry'
  | 'Fractional / Interim / Consultant'
  | 'Outsourced finance provider / bureau'
  | 'Other';

export type WritingStyle = 'Very formal (traditional)' | 'Professional' | 'Plain English (client-friendly)';

export type RiskPosture =
  | 'Compliance-first (very cautious; avoid over-asserting)'
  | 'Balanced (professional + pragmatic)'
  | 'Commercial (direct, action-focused)';

export interface ProfessionalContextUser {
  primary_role: PrimaryRole;
  job_title_selected: string;
  job_title_custom: string;
  seniority_level: SeniorityLevel;
  work_setting: WorkSetting;
  specialisms: string[];
  audiences: string[];
  writing_style: WritingStyle;
  risk_posture: RiskPosture;
  locale: string;
  context_version: number;
}

export interface ProfessionalContextOrg {
  firm_name: string;
  signature_block: string;
  disclaimer_text: string;
}

export interface ProfessionalContextPayload {
  user: ProfessionalContextUser;
  org: ProfessionalContextOrg;
}
