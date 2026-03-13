import {
  Field,
  SelectInput,
  SettingsCard,
  SettingsPageShell,
  TextInput
} from '../../components/control-center/SettingsUI';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SchedulingPage = () => (
  <SettingsPageShell
    title="Scheduling"
    subtitle="Set meeting defaults and availability preferences for scheduling responses."
  >
    <SettingsCard className="space-y-4">
      <Field label="Meeting link" htmlFor="meeting-link">
        <TextInput id="meeting-link" defaultValue="https://cal.com/xproflow/intro-call" />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Timezone selector" htmlFor="timezone">
          <SelectInput id="timezone" defaultValue="America/New_York">
            <option>America/New_York</option>
            <option>Europe/London</option>
            <option>UTC</option>
            <option>Asia/Singapore</option>
          </SelectInput>
        </Field>

        <Field label="Default meeting duration" htmlFor="meeting-duration">
          <SelectInput id="meeting-duration" defaultValue="30">
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </SelectInput>
        </Field>
      </div>

      <Field label="Availability grid (Mon–Sun)" htmlFor="availability-grid">
        <div id="availability-grid" className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {days.map((day) => (
            <label key={day} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
              <input type="checkbox" defaultChecked={day !== 'Sat' && day !== 'Sun'} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
              {day}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Minimum notice input" htmlFor="minimum-notice">
        <TextInput id="minimum-notice" type="number" min={0} defaultValue={24} />
      </Field>
    </SettingsCard>
  </SettingsPageShell>
);

export default SchedulingPage;
