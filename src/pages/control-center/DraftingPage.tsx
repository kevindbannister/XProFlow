import {
  Field,
  SelectInput,
  SettingsCard,
  SettingsPageShell,
  ToggleRow
} from '../../components/control-center/SettingsUI';

const DraftingPage = () => (
  <SettingsPageShell
    title="Drafting"
    subtitle="Control how AI drafts are generated, styled, and followed up."
  >
    <SettingsCard className="space-y-4">
      <ToggleRow
        id="enable-ai-drafts"
        defaultChecked
        title="Enable AI drafts"
        description="Automatically generate draft replies for matching incoming emails."
      />

      <Field label="Draft tone selector" htmlFor="draft-tone">
        <SelectInput id="draft-tone" defaultValue="professional">
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="concise">Concise</option>
        </SelectInput>
      </Field>

      <ToggleRow
        id="follow-up-automation"
        title="Follow-up automation"
        description="Automatically schedule and prepare follow-up drafts when no reply is received."
        defaultChecked
      />

      <Field label="Days before follow up slider" htmlFor="follow-up-days">
        <div className="rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
          <input id="follow-up-days" type="range" min={1} max={14} defaultValue={4} className="w-full" />
          <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>1 day</span>
            <span>4 days</span>
            <span>14 days</span>
          </div>
        </div>
      </Field>
    </SettingsCard>
  </SettingsPageShell>
);

export default DraftingPage;
