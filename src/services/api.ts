export const connectEmailProvider = async (provider: 'gmail' | 'outlook'): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.info(`Connected ${provider} provider (placeholder API call).`);
};

export const connectIntegration = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.info(`Connected integration ${id} (placeholder API call).`);
};

export const disconnectIntegration = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.info(`Disconnected integration ${id} (placeholder API call).`);
};

export const saveSettings = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  console.info('Settings saved (placeholder API call).');
};
