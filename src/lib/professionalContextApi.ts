import { api } from './api';
import { DEFAULT_PROFESSIONAL_CONTEXT } from './professionalContextTaxonomy';
import type { ProfessionalContextPayload } from '../types/professionalContext';

type MaybeProfessionalContextResponse = Partial<ProfessionalContextPayload> | null | undefined;

const mergeWithDefaults = (payload: MaybeProfessionalContextResponse): ProfessionalContextPayload => ({
  user: {
    ...DEFAULT_PROFESSIONAL_CONTEXT.user,
    ...(payload?.user || {})
  },
  org: {
    ...DEFAULT_PROFESSIONAL_CONTEXT.org,
    ...(payload?.org || {})
  }
});

export const fetchProfessionalContext = async (): Promise<ProfessionalContextPayload> => {
  try {
    const data = await api.get<ProfessionalContextPayload>('/api/professional-context');
    return mergeWithDefaults(data);
  } catch {
    return DEFAULT_PROFESSIONAL_CONTEXT;
  }
};

export const saveProfessionalContext = async (payload: ProfessionalContextPayload) => {
  try {
    const response = await api.put<ProfessionalContextPayload>('/api/professional-context', payload);
    return mergeWithDefaults(response);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to save professional context');
  }
};
