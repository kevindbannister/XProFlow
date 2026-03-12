import {
  Field,
  SelectInput,
  SettingsCard,
  SettingsPageShell,
  TextAreaInput
} from '../../components/control-center/SettingsUI';

const WritingStylePage = () => (
  <SettingsPageShell
    title="Writing Style"
    subtitle="Train AI with your preferred writing style and tone guidance."
  >
    <SettingsCard className="space-y-4">
      <Field label="Writing style training" htmlFor="style-instructions">
        <TextAreaInput
          id="style-instructions"
          className="min-h-52"
          placeholder={'"My emails are concise."\n"I prefer bullet points."'}
          defaultValue={'My emails are concise.\nI prefer bullet points and clear action items.'}
        />
      </Field>

      <Field label="Tone selector" htmlFor="tone-selector">
        <SelectInput id="tone-selector" defaultValue="professional">
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="concise">Concise</option>
        </SelectInput>
      </Field>
    </SettingsCard>
  </SettingsPageShell>
);

export default WritingStylePage;
