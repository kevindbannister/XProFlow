import type { ProfessionalContextPayload } from '../types/professionalContext';

export const PRIMARY_ROLES = [
  'Accountant (Practice)',
  'Finance Director / CFO',
  'Financial Controller',
  'Finance Manager',
  'Management Accountant / FP&A',
  'Bookkeeper',
  'Tax Advisor',
  'Payroll Specialist',
  'Practice Manager / Operations',
  'Other'
] as const;

export const SENIORITY_LEVELS = [
  'Owner/Partner',
  'Director/Head of Finance',
  'Manager',
  'Senior/Qualified',
  'Junior/Trainee/Assistant'
] as const;

export const WORK_SETTINGS = [
  'Accounting Practice (public practice)',
  'In-house / Industry',
  'Fractional / Interim / Consultant',
  'Outsourced finance provider / bureau',
  'Other'
] as const;

export const SPECIALISMS = [
  'Accounts prep / statutory accounts',
  'Bookkeeping',
  'Management accounts',
  'FP&A / budgeting / forecasting',
  'VAT',
  'Payroll',
  'Corporation tax',
  'Personal tax',
  'Audit',
  'Advisory / CFO services',
  'Credit control',
  'Treasury / cashflow',
  'Finance business partnering',
  'Insolvency / restructuring',
  'Forensic / investigations',
  'Systems / process improvement'
] as const;

export const AUDIENCES = [
  'Business owners / directors',
  'Non-finance client contacts',
  'Internal finance team',
  'Wider internal stakeholders',
  'HMRC / regulators',
  'Banks / lenders',
  'Suppliers',
  'Other advisors (lawyers, IPs, etc.)'
] as const;

export const WRITING_STYLES = [
  'Very formal (traditional)',
  'Professional',
  'Plain English (client-friendly)'
] as const;

export const RISK_POSTURES = [
  'Compliance-first (very cautious; avoid over-asserting)',
  'Balanced (professional + pragmatic)',
  'Commercial (direct, action-focused)'
] as const;

export const COMMON_JOB_TITLES = [
  'Partner','Managing Partner','Director','Senior Manager','Manager','Assistant Manager','Senior Accountant','Semi Senior Accountant','Accounts Senior','Trainee Accountant','Audit Partner','Audit Director','Audit Manager','Audit Senior',
  'Tax Partner','Tax Director','Tax Manager','Tax Senior','VAT Manager','Payroll Manager','Bookkeeper','Senior Bookkeeper','Practice Manager','Client Manager',
  'Chief Financial Officer','Finance Director','Group Finance Director','Head of Finance','Financial Controller','Group Financial Controller','Assistant Financial Controller','Finance Manager',
  'Senior Finance Manager','Management Accountant','Assistant Management Accountant','FP&A Manager','FP&A Analyst','Commercial Finance Manager','Finance Business Partner','Credit Controller','Treasury Manager',
  'Payroll Specialist','Payroll Administrator','Payroll Officer','Corporate Tax Manager','Personal Tax Manager','Insolvency Practitioner','Forensic Accountant','Restructuring Manager','Interim Finance Director','Fractional CFO'
] as const;

export const DEFAULT_PROFESSIONAL_CONTEXT: ProfessionalContextPayload = {
  user: {
    primary_role: 'Accountant (Practice)',
    job_title_selected: 'Accountant',
    job_title_custom: '',
    seniority_level: 'Senior/Qualified',
    work_setting: 'Accounting Practice (public practice)',
    specialisms: [],
    audiences: ['Business owners / directors'],
    writing_style: 'Professional',
    risk_posture: 'Balanced (professional + pragmatic)',
    locale: 'en-GB',
    context_version: 1
  },
  org: {
    firm_name: '',
    signature_block: '',
    disclaimer_text: ''
  }
};
