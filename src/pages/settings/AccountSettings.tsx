import SettingsCategoryPage from '../../components/settings/SettingsCategoryPage';

const AccountSettings = () => (
  <SettingsCategoryPage
    title="Account"
    subtitle="Manage profile, security, and personal preferences."
    description="The old combined Settings page has been split into dedicated sidebar items for faster access."
    sections={[
      { heading: 'Profile', description: 'Update display name and account metadata used in your workspace.' },
      { heading: 'Security', description: 'Configure two-factor authentication and sign-in protections.' },
      { heading: 'Notifications', description: 'Choose product updates and assistant activity alerts.' }
    ]}
  />
);

export default AccountSettings;
