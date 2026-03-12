import { useState } from 'react';
import {
  Field,
  PrimaryButton,
  SecondaryButton,
  SelectInput,
  SettingsCard,
  SettingsPageShell,
  TextInput
} from '../../components/control-center/SettingsUI';

const RulesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SettingsPageShell
      title="Rules"
      subtitle="Build conditional automation rules to route and categorise incoming emails."
    >
      <SettingsCard className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">Rule list</h2>
          <PrimaryButton type="button" onClick={() => setIsModalOpen(true)}>Create rule</PrimaryButton>
        </div>

        <div className="space-y-3">
          <article className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">IF sender contains "@client.com"</p>
            <p className="mt-1 text-sm text-slate-600">THEN category = <span className="font-medium">To Respond</span></p>
          </article>
          <article className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">IF subject contains "invoice"</p>
            <p className="mt-1 text-sm text-slate-600">THEN category = <span className="font-medium">Notification</span></p>
          </article>
        </div>
      </SettingsCard>

      {isModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-6">
          <SettingsCard className="z-50 w-full max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Rule Builder</h3>
              <SecondaryButton type="button" onClick={() => setIsModalOpen(false)}>Close</SecondaryButton>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Sender email" htmlFor="sender-email">
                <TextInput id="sender-email" placeholder="person@client.com" />
              </Field>
              <Field label="Domain" htmlFor="domain">
                <TextInput id="domain" placeholder="@client.com" />
              </Field>
              <Field label="Subject contains" htmlFor="subject-contains">
                <TextInput id="subject-contains" placeholder="project kickoff" />
              </Field>
              <Field label="Category assignment" htmlFor="category-assignment">
                <SelectInput id="category-assignment" defaultValue="to-respond">
                  <option value="to-respond">To Respond</option>
                  <option value="fyi">FYI</option>
                  <option value="comment">Comment</option>
                  <option value="notification">Notification</option>
                  <option value="meeting-update">Meeting Update</option>
                </SelectInput>
              </Field>
            </div>

            <div className="flex justify-end gap-2">
              <SecondaryButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</SecondaryButton>
              <PrimaryButton type="button" onClick={() => setIsModalOpen(false)}>Save rule</PrimaryButton>
            </div>
          </SettingsCard>
        </div>
      ) : null}
    </SettingsPageShell>
  );
};

export default RulesPage;
