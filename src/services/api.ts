export const connectEmailProvider = async (provider: 'gmail' | 'outlook'): Promise<void> => {
  // TODO: Replace with n8n workflow trigger to start OAuth for the selected provider.
  return new Promise((resolve) => setTimeout(resolve, 500));
};

export const connectIntegration = async (id: string): Promise<void> => {
  // TODO: Wire up to backend integration connector for the given integration id.
  return new Promise((resolve) => setTimeout(resolve, 500));
};

export const disconnectIntegration = async (id: string): Promise<void> => {
  // TODO: Call backend to disconnect integration.
  return new Promise((resolve) => setTimeout(resolve, 500));
};

export const saveSettings = async (): Promise<void> => {
  // TODO: Persist settings to backend or trigger n8n workflow.
  return new Promise((resolve) => setTimeout(resolve, 600));
};
