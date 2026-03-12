import {
  PrimaryButton,
  SelectInput,
  SettingsCard,
  SettingsPageShell,
  ToggleRow
} from '../../components/control-center/SettingsUI';

const categories = [
  { name: 'To Respond', color: 'bg-blue-100 text-blue-800', description: 'Needs a response from you or your team.' },
  { name: 'FYI', color: 'bg-slate-100 text-slate-700', description: 'Informational updates that do not require action.' },
  { name: 'Comment', color: 'bg-violet-100 text-violet-700', description: 'Conversation threads where commentary is the main intent.' },
  { name: 'Notification', color: 'bg-amber-100 text-amber-800', description: 'System alerts, reminders, and account notices.' },
  { name: 'Meeting Update', color: 'bg-cyan-100 text-cyan-800', description: 'Changes related to events, calls, and scheduling.' },
  { name: 'Awaiting Reply', color: 'bg-orange-100 text-orange-800', description: 'Messages waiting on an external response.' },
  { name: 'Actioned', color: 'bg-emerald-100 text-emerald-800', description: 'Tasks already handled and ready for archive.' },
  { name: 'Marketing', color: 'bg-pink-100 text-pink-700', description: 'Promotional outreach and campaign communications.' }
];

const CategorisationPage = () => (
  <SettingsPageShell
    title="Categorisation"
    subtitle="Define the inbox categories AI uses to tag and prioritise incoming messages."
  >
    <SettingsCard className="space-y-4">
      {categories.map((category) => (
        <ToggleRow
          key={category.name}
          id={`category-${category.name}`}
          defaultChecked
          title={category.name}
          description={category.description}
          rightContent={<span className={`rounded-full px-2.5 py-1 text-xs font-medium ${category.color}`}>{category.name}</span>}
        />
      ))}
    </SettingsCard>

    <SettingsCard className="space-y-4">
      <h2 className="text-base font-semibold text-slate-900">Move to folder / label</h2>
      <SelectInput defaultValue="to-respond">
        <option value="to-respond">To Respond</option>
        <option value="fyi">FYI</option>
        <option value="comment">Comment</option>
        <option value="notification">Notification</option>
      </SelectInput>
      <div className="flex justify-end">
        <PrimaryButton type="button">Update Preferences</PrimaryButton>
      </div>
    </SettingsCard>
  </SettingsPageShell>
);

export default CategorisationPage;
