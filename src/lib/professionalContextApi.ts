import { apiBaseUrl } from '../config/api';
import { supabase } from './supabaseClient';
import { DEFAULT_PROFESSIONAL_CONTEXT } from './professionalContextTaxonomy';
import type { ProfessionalContextPayload } from '../types/professionalContext';

const withAuthHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  return {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
  };
};

export const fetchProfessionalContext = async (): Promise<ProfessionalContextPayload> => {
  const response = await fetch(`${apiBaseUrl}/professional-context`, {
    method: 'GET',
    headers: await withAuthHeaders()
  });

  if (!response.ok) {
    return DEFAULT_PROFESSIONAL_CONTEXT;
  }

  return response.json();
};

export const saveProfessionalContext = async (payload: ProfessionalContextPayload) => {
  const response = await fetch(`${apiBaseUrl}/professional-context`, {
    method: 'PUT',
    headers: await withAuthHeaders(),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error ?? 'Failed to save professional context');
  }

  return response.json();
};
