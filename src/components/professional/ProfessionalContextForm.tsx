import { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { fetchProfessionalContext, saveProfessionalContext } from '../../lib/professionalContextApi';
import {
  AUDIENCES,
  COMMON_JOB_TITLES,
  DEFAULT_PROFESSIONAL_CONTEXT,
  PRIMARY_ROLES,
  RISK_POSTURES,
  SENIORITY_LEVELS,
  SPECIALISMS,
  WORK_SETTINGS,
  WRITING_STYLES
} from '../../lib/professionalContextTaxonomy';
import type { ProfessionalContextPayload } from '../../types/professionalContext';
import { generateAIContextBlock } from '../../lib/aiContextBlock';

const requiredComplete = (context: ProfessionalContextPayload) =>
  Boolean(
    context.user.primary_role &&
      (context.user.job_title_selected || context.user.job_title_custom) &&
      context.user.seniority_level &&
      context.user.work_setting &&
      context.user.audiences.length &&
      context.user.writing_style &&
      context.user.risk_posture
  );

const ProfessionalContextForm = ({ mode }: { mode: 'onboarding' | 'settings' }) => {
  const [context, setContext] = useState<ProfessionalContextPayload>(DEFAULT_PROFESSIONAL_CONTEXT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProfessionalContext();
        setContext(data);
      } catch {
        setContext(DEFAULT_PROFESSIONAL_CONTEXT);
        setStatus('Using default professional context for now.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const contextPreview = useMemo(() => generateAIContextBlock(context), [context]);

  const toggleArrayValue = (values: string[], value: string) =>
    values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

  const onSave = async (allowSkip = false) => {
    if (!allowSkip && !requiredComplete(context)) {
      setStatus('Please complete required fields before saving.');
      return;
    }

    setSaving(true);
    setStatus('');
    try {
      const payload = allowSkip && !requiredComplete(context) ? DEFAULT_PROFESSIONAL_CONTEXT : context;
      await saveProfessionalContext(payload);
      setContext(payload);
      setStatus('Professional context saved.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-sm text-slate-600">Loading professional context…</div>;

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Professional Context</h1>
        <p className="mt-2 text-sm text-slate-600">XProFlow tailors tone, risk and language based on your role so drafts sound like you.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="text-sm">Primary role
          <select className="mt-1 w-full rounded-md border p-2" value={context.user.primary_role} onChange={(e) => setContext({ ...context, user: { ...context.user, primary_role: e.target.value as ProfessionalContextPayload['user']['primary_role'] } })}>
            {PRIMARY_ROLES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-sm">Seniority / authority
          <select className="mt-1 w-full rounded-md border p-2" value={context.user.seniority_level} onChange={(e) => setContext({ ...context, user: { ...context.user, seniority_level: e.target.value as ProfessionalContextPayload['user']['seniority_level'] } })}>
            {SENIORITY_LEVELS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-sm">Job title
          <input className="mt-1 w-full rounded-md border p-2" list="job-titles" value={context.user.job_title_selected} onChange={(e) => setContext({ ...context, user: { ...context.user, job_title_selected: e.target.value } })} placeholder="Select or type" />
          <datalist id="job-titles">{COMMON_JOB_TITLES.map((item) => <option key={item} value={item} />)}</datalist>
        </label>
        <label className="text-sm">Custom title (optional)
          <input className="mt-1 w-full rounded-md border p-2" value={context.user.job_title_custom} onChange={(e) => setContext({ ...context, user: { ...context.user, job_title_custom: e.target.value } })} placeholder="e.g. Outsourced Finance Lead" />
        </label>
        <label className="text-sm">Work setting
          <select className="mt-1 w-full rounded-md border p-2" value={context.user.work_setting} onChange={(e) => setContext({ ...context, user: { ...context.user, work_setting: e.target.value as ProfessionalContextPayload['user']['work_setting'] } })}>
            {WORK_SETTINGS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-sm">Writing style
          <select className="mt-1 w-full rounded-md border p-2" value={context.user.writing_style} onChange={(e) => setContext({ ...context, user: { ...context.user, writing_style: e.target.value as ProfessionalContextPayload['user']['writing_style'] } })}>
            {WRITING_STYLES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-sm lg:col-span-2">Risk / compliance posture
          <select className="mt-1 w-full rounded-md border p-2" value={context.user.risk_posture} onChange={(e) => setContext({ ...context, user: { ...context.user, risk_posture: e.target.value as ProfessionalContextPayload['user']['risk_posture'] } })}>
            {RISK_POSTURES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div>
        <p className="text-sm font-medium">Specialisms</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SPECIALISMS.map((item) => (
            <button key={item} type="button" onClick={() => setContext({ ...context, user: { ...context.user, specialisms: toggleArrayValue(context.user.specialisms, item) } })} className={`rounded-full border px-3 py-1 text-xs ${context.user.specialisms.includes(item) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 text-slate-700'}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Typical email audiences *</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {AUDIENCES.map((item) => (
            <button key={item} type="button" onClick={() => setContext({ ...context, user: { ...context.user, audiences: toggleArrayValue(context.user.audiences, item) } })} className={`rounded-full border px-3 py-1 text-xs ${context.user.audiences.includes(item) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 text-slate-700'}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="text-sm">Firm/organisation name
          <input className="mt-1 w-full rounded-md border p-2" value={context.org.firm_name} onChange={(e) => setContext({ ...context, org: { ...context.org, firm_name: e.target.value } })} />
        </label>
        <label className="text-sm">Locale
          <input className="mt-1 w-full rounded-md border p-2" value={context.user.locale} onChange={(e) => setContext({ ...context, user: { ...context.user, locale: e.target.value } })} />
        </label>
        <label className="text-sm lg:col-span-2">Signature block
          <textarea className="mt-1 w-full rounded-md border p-2" rows={3} value={context.org.signature_block} onChange={(e) => setContext({ ...context, org: { ...context.org, signature_block: e.target.value } })} />
        </label>
        <label className="text-sm lg:col-span-2">Disclaimer text
          <textarea className="mt-1 w-full rounded-md border p-2" rows={2} value={context.org.disclaimer_text} onChange={(e) => setContext({ ...context, org: { ...context.org, disclaimer_text: e.target.value } })} />
        </label>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">AI Context Block preview</p>
        <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-700">{contextPreview}</pre>
      </div>

      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
      <div className="flex gap-3">
        <Button type="button" onClick={() => void onSave(false)} disabled={saving}>{saving ? 'Saving…' : 'Save professional context'}</Button>
        {mode === 'onboarding' ? <Button type="button" variant="outline" onClick={() => void onSave(true)} disabled={saving}>Skip for now</Button> : null}
      </div>
    </section>
  );
};

export default ProfessionalContextForm;
