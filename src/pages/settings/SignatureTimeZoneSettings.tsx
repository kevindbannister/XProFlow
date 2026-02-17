import SettingsCategoryPage from '../../components/settings/SettingsCategoryPage';

const SignatureTimeZoneSettings = () => (
  <SettingsCategoryPage
    title="Signature & Time Zone"
    subtitle="Set identity details and schedule behavior."
    sections={[
      { heading: 'Signature block', description: 'Attach your preferred signature to outbound drafts by default.' },
      { heading: 'Send scheduling', description: 'Use your local time zone when suggesting delayed send times.' },
      { heading: 'Availability notes', description: 'Optionally include office hours in generated responses.' }
    ]}
  />
);

export default SignatureTimeZoneSettings;
