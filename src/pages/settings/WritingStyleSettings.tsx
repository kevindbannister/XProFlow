import SettingsCategoryPage from '../../components/settings/SettingsCategoryPage';

const WritingStyleSettings = () => (
  <SettingsCategoryPage
    title="Writing Style"
    subtitle="Tune voice, formality, and response structure in drafts."
    sections={[
      { heading: 'Tone preset', description: 'Keep a friendly and professional voice across all conversations.' },
      { heading: 'Response length', description: 'Choose concise defaults while allowing detailed replies when needed.' },
      { heading: 'Formatting', description: 'Enable clean summaries and action-first paragraph structure.' }
    ]}
  />
);

export default WritingStyleSettings;
