import {
  Field,
  SelectInput,
  SettingsCard,
  SettingsPageShell,
  TextAreaInput,
  TextInput
} from '../../components/control-center/SettingsUI';

const SignaturePage = () => (
  <SettingsPageShell
    title="Signature"
    subtitle="Manage signatures used by AI-generated drafts across accounts."
  >
    <SettingsCard className="space-y-4">
      <Field label="Default signature editor" htmlFor="default-signature">
        <TextAreaInput
          id="default-signature"
          className="min-h-40"
          defaultValue={'Best regards,\nAlex Morgan\nHead of Customer Operations\nXProFlow'}
        />
      </Field>

      <Field label="Account-specific signatures" htmlFor="account-signature">
        <SelectInput id="account-signature" defaultValue="support@xproflow.com">
          <option>support@xproflow.com</option>
          <option>sales@xproflow.com</option>
          <option>founder@xproflow.com</option>
        </SelectInput>
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Font selector" htmlFor="font-selector">
          <SelectInput id="font-selector" defaultValue="Inter">
            <option>Inter</option>
            <option>Arial</option>
            <option>Georgia</option>
            <option>Verdana</option>
          </SelectInput>
        </Field>

        <Field label="Font color selector" htmlFor="font-color">
          <TextInput id="font-color" type="color" defaultValue="#1e293b" className="h-11 p-1" />
        </Field>
      </div>

      <Field label="Signature preview" htmlFor="signature-preview">
        <div id="signature-preview" className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
          <p>Best regards,</p>
          <p className="font-semibold">Alex Morgan</p>
          <p>Head of Customer Operations</p>
          <p>XProFlow</p>
        </div>
      </Field>
    </SettingsCard>
  </SettingsPageShell>
);

export default SignaturePage;
