import type { ProfessionalContextPayload } from '../types/professionalContext';

const riskGuidanceMap: Record<string, string> = {
  'Compliance-first (very cautious; avoid over-asserting)': 'Avoid legal conclusions, mark assumptions clearly, and ask clarifying questions when evidence is incomplete.',
  'Balanced (professional + pragmatic)': 'Be clear and practical, include concise next steps, and avoid unnecessary jargon.',
  'Commercial (direct, action-focused)': 'Lead with outcomes, decisions, and deadlines while remaining professionally courteous.'
};

const styleGuidanceMap: Record<string, string> = {
  'Very formal (traditional)': 'Use formal salutations and complete sentences with reserved wording.',
  Professional: 'Use a confident professional tone with concise structure.',
  'Plain English (client-friendly)': 'Prefer plain English and explain technical terms briefly.'
};

export const generateAIContextBlock = (context: ProfessionalContextPayload): string => {
  const role = context.user.primary_role;
  const title = context.user.job_title_custom.trim() || context.user.job_title_selected;
  const specialisms = context.user.specialisms.length ? context.user.specialisms.join(', ') : 'General finance';
  const audiences = context.user.audiences.join(', ');

  return [
    `CONTEXT_VERSION: ${context.user.context_version}`,
    'USER CONTEXT:',
    `Role: ${role}`,
    `Title: ${title}`,
    `Seniority: ${context.user.seniority_level}`,
    `Work setting: ${context.user.work_setting}`,
    `Specialisms: ${specialisms}`,
    `Audience: ${audiences}`,
    `Writing style: ${context.user.writing_style}`,
    `Risk posture: ${context.user.risk_posture}`,
    `Locale: ${context.user.locale || 'en-GB'} (UK spelling and HMRC-aligned terminology)`,
    `Organisation: ${context.org.firm_name || 'Not provided'}`,
    `Signature default: ${context.org.signature_block || 'Not provided'}`,
    `Disclaimer: ${context.org.disclaimer_text || 'None'}`,
    `Guidance: ${styleGuidanceMap[context.user.writing_style]} ${riskGuidanceMap[context.user.risk_posture]} Include next-step bullets where useful and keep tone polite but firm.`
  ].join('\n');
};
