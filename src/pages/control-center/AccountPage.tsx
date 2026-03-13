import {
  Field,
  PrimaryButton,
  SecondaryButton,
  SettingsCard,
  SettingsPageShell,
  TextInput
} from '../../components/control-center/SettingsUI';

const AccountPage = () => (
  <SettingsPageShell
    title="Account"
    subtitle="Manage your personal details, access credentials, and billing preferences."
  >
    <SettingsCard className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" htmlFor="account-name">
          <TextInput id="account-name" defaultValue="Master User" />
        </Field>

        <Field label="Email" htmlFor="account-email">
          <TextInput id="account-email" type="email" defaultValue="master@xproflow.ai" />
        </Field>
      </div>

      <Field label="Password change" htmlFor="new-password">
        <div className="grid gap-3 md:grid-cols-3">
          <TextInput id="current-password" type="password" placeholder="Current password" />
          <TextInput id="new-password" type="password" placeholder="New password" />
          <TextInput id="confirm-password" type="password" placeholder="Confirm new password" />
        </div>
      </Field>

      <Field label="Plan" htmlFor="plan">
        <div id="plan" className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Pro Plan — Unlimited AI drafting, rule automation, and integrations.
        </div>
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4">
        <p className="text-sm text-slate-600">Need invoices or payment history?</p>
        <div className="flex gap-2">
          <SecondaryButton type="button">Billing link</SecondaryButton>
          <PrimaryButton type="button">Save account settings</PrimaryButton>
        </div>
      </div>
    </SettingsCard>
  </SettingsPageShell>
);

export default AccountPage;
