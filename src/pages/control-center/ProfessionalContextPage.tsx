import {
  Field,
  SettingsCard,
  SettingsPageShell,
  TextAreaInput,
  TextInput
} from '../../components/control-center/SettingsUI';

const ProfessionalContextPage = () => (
  <SettingsPageShell
    title="Professional Context"
    subtitle="Provide business context so AI can generate more relevant and accurate replies."
  >
    <SettingsCard className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Company name" htmlFor="company-name">
          <TextInput id="company-name" placeholder="XProFlow" />
        </Field>

        <Field label="Role" htmlFor="role">
          <TextInput id="role" placeholder="Head of Operations" />
        </Field>
      </div>

      <Field label="Industry" htmlFor="industry">
        <TextInput id="industry" placeholder="SaaS / Productivity" />
      </Field>

      <Field label="Services" htmlFor="services">
        <TextAreaInput id="services" placeholder="List your core services and product offerings." className="min-h-24" />
      </Field>

      <Field label="Communication preferences" htmlFor="communication-preferences">
        <TextAreaInput id="communication-preferences" placeholder="Preferred tone, response length, and formatting style." className="min-h-24" />
      </Field>

      <Field label="Example replies" htmlFor="example-replies">
        <TextAreaInput id="example-replies" placeholder="Paste sample responses that reflect your writing style." className="min-h-40" />
      </Field>
    </SettingsCard>
  </SettingsPageShell>
);

export default ProfessionalContextPage;
