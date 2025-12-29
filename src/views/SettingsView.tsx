import { FC, useMemo, useRef, useState } from 'react';
import { categories as defaultCategories, initialEmailRules, integrations as defaultIntegrations, meetings } from '../data/mockData';
import { connectEmailProvider, connectIntegration, disconnectIntegration, saveSettings } from '../services/api';
import { Category, EmailRule, Integration, SettingsTab } from '../types';
import { RolesSetupView } from './RolesSetupView';

interface SettingsViewProps {
  currentTab: SettingsTab;
  visibility: Record<string, boolean>;
}

const sectionClass =
  'rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-xl dark:shadow-black/20';

const generateId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `rule-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const SettingsView: FC<SettingsViewProps> = ({ currentTab, visibility }) => {
  const renderTab = useMemo(() => {
    switch (currentTab) {
      case 'preferences':
        return <PreferencesTab visibility={visibility} />;
      case 'emailRules':
        return <EmailRulesTab visibility={visibility} />;
      case 'draftReplies':
        return <DraftRepliesTab visibility={visibility} />;
      case 'followUps':
        return <FollowUpsTab visibility={visibility} />;
      case 'scheduling':
        return <SchedulingTab visibility={visibility} />;
      case 'meetingNotetaker':
        return <MeetingNotetakerTab visibility={visibility} />;
      case 'integrations':
        return <IntegrationsTab visibility={visibility} />;
      case 'faq':
        return <FaqTab visibility={visibility} />;
      case 'roles':
        return <RolesSetupView />;
      default:
        return null;
    }
  }, [currentTab]);

  return <div className="space-y-6">{renderTab}</div>;
};

const PreferencesTab: FC<{ visibility: Record<string, boolean> }> = ({ visibility }) => {
  const [emailPreferences] = useState({ primary: 'kevin@firm.co.uk', status: 'Connected' });
  const [toggles, setToggles] = useState({
    categorisation: true,
    drafts: true,
    followUpTracking: false,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConnect = async (provider: 'gmail' | 'outlook') => {
    await connectEmailProvider(provider);
    alert(`Connected ${provider}`);
  };

  return (
    <div className="space-y-6">
      {visibility['settings.preferences.connectedAccounts'] ? (
        <div className={sectionClass}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Connected email accounts</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage how Flowiee connects to Gmail or Outlook via n8n.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleConnect('gmail')}
                className="rounded-full border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 hover:border-emerald-500 dark:text-slate-200"
              >
                Connect Gmail
              </button>
              <button
                onClick={() => handleConnect('outlook')}
                className="rounded-full border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 hover:border-emerald-500 dark:text-slate-200"
              >
                Connect Outlook
              </button>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Primary email</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{emailPreferences.primary}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                {emailPreferences.status}
              </span>
            </div>
          </div>
        </div>
      ) : null}
      {visibility['settings.preferences.general'] ? (
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">General preferences</h3>
          <div className="mt-4 space-y-4">
            {[
              {
                key: 'categorisation',
                title: 'Enable email categorisation',
                description: 'Flowiee will organise messages for downstream automations.',
              },
              {
                key: 'drafts',
                title: 'Enable AI draft replies',
                description: 'Flowiee generates suggested responses for review.',
              },
              {
                key: 'followUpTracking',
                title: 'Enable follow-up tracking',
                description: 'Get nudges when a reply is overdue.',
              },
            ].map((item) => (
              <ToggleRow
                key={item.key}
                title={item.title}
                description={item.description}
                enabled={toggles[item.key as keyof typeof toggles]}
                onToggle={() => handleToggle(item.key as keyof typeof toggles)}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <PrimaryButton label="Save changes" onClick={saveSettings} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const EmailRulesTab: FC<{ visibility: Record<string, boolean> }> = ({ visibility }) => {
  const [categoryState, setCategoryState] = useState<Category[]>(defaultCategories);
  const [rules, setRules] = useState<EmailRule[]>(initialEmailRules);

  const toggleCategory = (id: string) => {
    setCategoryState((prev) => prev.map((cat) => (cat.id === id ? { ...cat, active: !cat.active } : cat)));
  };

  const handleRuleChange = (id: string, field: keyof EmailRule, value: string) => {
    setRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)));
  };

  const addRule = () => {
    setRules((prev) => [...prev, { id: generateId(), value: '', categoryId: categoryState[0]?.id ?? '' }]);
  };

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {visibility['settings.emailRules.categories'] ? (
        <div className={sectionClass}>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Categories</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Flowiee will organise your emails according to these categories in the backend.</p>
        <div className="mt-4 space-y-3">
          {categoryState.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 p-3"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={category.active}
                  onChange={() => toggleCategory(category.id)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{category.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{category.description}</p>
                </div>
              </div>
              <span className={`h-3 w-3 rounded ${category.color}`} />
            </div>
          ))}
        </div>
        </div>
      ) : null}
      {visibility['settings.emailRules.rules'] ? (
        <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Email rules</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Map senders, domains, or keywords to categories. Flowiee respects your filters.</p>
          </div>
          <ToggleRow
            title="Respect user-applied labels"
            description="Avoid overriding labels already applied by you."
            enabled
            onToggle={() => null}
            compact
          />
        </div>
        <div className="mt-4 space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 p-4">
              <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Email / domain / keyword</label>
              <input
                type="text"
                value={rule.value}
                onChange={(event) => handleRuleChange(rule.id, 'value', event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
              <div className="mt-3 flex items-center gap-3">
                <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Category</label>
                <select
                  value={rule.categoryId}
                  onChange={(event) => handleRuleChange(rule.id, 'categoryId', event.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  {categoryState.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button onClick={() => removeRule(rule.id)} className="ml-auto text-sm text-rose-500">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addRule}
            className="w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-emerald-600 hover:border-emerald-400"
          >
            + Add email or subject
          </button>
        </div>
        <div className="mt-6 flex justify-end">
          <PrimaryButton label="Save changes" onClick={saveSettings} />
        </div>
        </div>
      ) : null}
    </div>
  );
};

const DraftRepliesTab: FC<{ visibility: Record<string, boolean> }> = ({ visibility }) => {
  const [enabled, setEnabled] = useState(true);
  const [prompt, setPrompt] = useState('Keep tone concise but warm. Prioritise clients with active projects.');
  const [signature, setSignature] = useState('<p>Best,<br />Kevin</p>');
  const [font, setFont] = useState('default');
  const [fontSize, setFontSize] = useState(14);
  const [fontColor, setFontColor] = useState('#111827');
  const signatureEditorRef = useRef<HTMLDivElement | null>(null);

  const applySignatureCommand = (command: string, value?: string) => {
    signatureEditorRef.current?.focus();
    document.execCommand(command, false, value);
    setSignature(signatureEditorRef.current?.innerHTML ?? '');
  };

  const handleInsertLink = () => {
    const url = window.prompt('Enter a link URL');
    if (url) {
      applySignatureCommand('createLink', url);
    }
  };

  const handleInsertImage = () => {
    const url = window.prompt('Enter an image URL');
    if (url) {
      applySignatureCommand('insertImage', url);
    }
  };

  const signatureFontFamily =
    font === 'sans' ? 'ui-sans-serif, system-ui' : font === 'serif' ? 'ui-serif, Georgia' : 'inherit';

  return (
    <div className="space-y-6">
      {visibility['settings.draftReplies.overview'] ? (
        <div className={sectionClass}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI draft replies</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Let Flowiee suggest responses for you to review.</p>
          </div>
          <ToggleSwitch enabled={enabled} onToggle={() => setEnabled((prev) => !prev)} />
        </div>
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-800">
          Threading must be enabled in Gmail/Outlook to maintain context. Follow the guides below.
        </div>
        <div className="mt-4 space-y-2">
          {['How to enable threading in Gmail', 'How to enable threading in Outlook'].map((item) => (
            <details key={item} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 text-sm">
              <summary className="cursor-pointer font-semibold text-slate-800 dark:text-slate-100">{item}</summary>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Placeholder instructions. TODO: Link to knowledge base article or embed steps.</p>
            </details>
          ))}
        </div>
        </div>
      ) : null}
      {visibility['settings.draftReplies.prompt'] ? (
        <div className={sectionClass}>
        <label className="text-sm font-semibold text-slate-900 dark:text-white">Draft prompt</label>
        <textarea
          value={prompt}
          maxLength={1000}
          onChange={(event) => setPrompt(event.target.value)}
          className="mt-2 h-32 w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
          placeholder="Give Flowiee guidance on tone, priorities, and decision rules."
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{prompt.length}/1000</p>
        </div>
      ) : null}
      {visibility['settings.draftReplies.signature'] ? (
        <div className={sectionClass}>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Signature</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email signature</label>
            <div className="mt-2 flex flex-wrap gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900/60 dark:text-slate-300">
              <button
                type="button"
                onClick={() => applySignatureCommand('bold')}
                className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => applySignatureCommand('italic')}
                className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => applySignatureCommand('underline')}
                className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Underline
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Link
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Image
              </button>
              <span className="self-center text-xs text-slate-400">Paste HTML or format with the toolbar.</span>
            </div>
            <div
              ref={signatureEditorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={() => setSignature(signatureEditorRef.current?.innerHTML ?? '')}
              className="mt-3 min-h-[6rem] w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white px-4 py-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none dark:bg-slate-900/60 dark:text-slate-100"
              style={{ fontFamily: signatureFontFamily, fontSize: `${fontSize}px`, color: fontColor }}
              dangerouslySetInnerHTML={{ __html: signature }}
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Images should be hosted online; Flowiee will embed the HTML in your outbound signatures.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs uppercase text-slate-500 dark:text-slate-400">Font</label>
              <select
                value={font}
                onChange={(event) => setFont(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="default">Email client default</option>
                <option value="sans">Sans</option>
                <option value="serif">Serif</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase text-slate-500 dark:text-slate-400">Font size</label>
              <input
                type="number"
                value={fontSize}
                onChange={(event) => setFontSize(Number(event.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase text-slate-500 dark:text-slate-400">Font colour</label>
              <input
                type="text"
                value={fontColor}
                onChange={(event) => setFontColor(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <PrimaryButton label="Save changes" onClick={saveSettings} />
        </div>
        </div>
      ) : null}
    </div>
  );
};

const FollowUpsTab: FC<{ visibility: Record<string, boolean> }> = ({ visibility }) => {
  const [enabled, setEnabled] = useState(true);
  const [days, setDays] = useState(5);

  return (
    <>
      {visibility['settings.followUps.settings'] ? (
        <div className={sectionClass}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Follow-ups</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Flowiee will draft reminders if someone hasn’t replied.</p>
        </div>
        <ToggleSwitch enabled={enabled} onToggle={() => setEnabled((prev) => !prev)} />
      </div>
      <div className="mt-6">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Days before following up: {days}</label>
        <input
          type="range"
          min={1}
          max={30}
          value={days}
          onChange={(event) => setDays(Number(event.target.value))}
          className="mt-3 w-full accent-emerald-500"
        />
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Flowiee will queue follow-ups {days} days after the original email.</p>
      </div>
          <div className="mt-6 flex justify-end">
            <PrimaryButton label="Save changes" onClick={saveSettings} />
          </div>
        </div>
      ) : null}
    </>
  );
};

const SchedulingTab: FC<{ visibility: Record<string, boolean> }> = ({ visibility }) => {
  const [enabled, setEnabled] = useState(true);
  const [duration, setDuration] = useState(45);
  const [link, setLink] = useState('https://flowmail.ai/kevin');
  const [copied, setCopied] = useState(false);
  const [includeInDrafts, setIncludeInDrafts] = useState(true);
  const [timeZone, setTimeZone] = useState('Europe/London');
  const [notifyPropose, setNotifyPropose] = useState(true);
  const [notifyAccept, setNotifyAccept] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {visibility['settings.scheduling.settings'] ? (
        <div className={sectionClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Scheduling settings</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Share availability and let Flowiee coordinate.</p>
          </div>
          <ToggleSwitch enabled={enabled} onToggle={() => setEnabled((prev) => !prev)} />
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Default meeting duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
              className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Your scheduling link</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
              <button onClick={handleCopy} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <ToggleRow
            title="Include scheduling link in calendar drafts"
            description="Automatically reference your link when drafting meeting emails."
            enabled={includeInDrafts}
            onToggle={() => setIncludeInDrafts((prev) => !prev)}
          />
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Time zone</label>
            <select
              value={timeZone}
              onChange={(event) => setTimeZone(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
            >
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
            </select>
          </div>
          <ToggleRow
            title="Email me when proposing times"
            description="Receive a summary email whenever Flowiee proposes times."
            enabled={notifyPropose}
            onToggle={() => setNotifyPropose((prev) => !prev)}
          />
          <ToggleRow
            title="Email me when accepting times"
            description="Confirmations land in your inbox immediately."
            enabled={notifyAccept}
            onToggle={() => setNotifyAccept((prev) => !prev)}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <PrimaryButton label="Save changes" onClick={saveSettings} />
        </div>
        </div>
      ) : null}
      {visibility['settings.scheduling.preview'] ? (
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Meeting booking preview</h3>
          <div className="mt-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Kevin Brooks</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {duration} minutes · {timeZone.replace('/', ' · ')}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm sm:grid-cols-3">
            {[...Array(9)].map((_, index) => (
              <button
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-slate-700 dark:text-slate-200 shadow-sm"
              >
                {`Day ${index + 1}`}
                <span className="block text-xs text-slate-400 dark:text-slate-500">10:00 · 14:00</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const MeetingNotetakerTab: FC<{ visibility: Record<string, boolean> }> = ({ visibility }) => {
  const [enabled, setEnabled] = useState(true);
  const [meetingState, setMeetingState] = useState(meetings);

  const toggleMeeting = (id: string) => {
    setMeetingState((prev) => prev.map((meeting) => (meeting.id === id ? { ...meeting, sendToNotetaker: !meeting.sendToNotetaker } : meeting)));
  };

  return (
    <>
      {visibility['settings.meetingNotetaker.table'] ? (
        <div className={sectionClass}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Meeting Notetaker</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Automatically join eligible meetings, summarise, and send a recap.
              </p>
            </div>
            <ToggleSwitch enabled={enabled} onToggle={() => setEnabled((prev) => !prev)} />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="pb-2">Date & time</th>
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Platform</th>
                  <th className="pb-2 text-center">Send</th>
                </tr>
              </thead>
              <tbody>
                {meetingState.map((meeting) => (
                  <tr key={meeting.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-3 text-slate-700 dark:text-slate-200">{meeting.date}</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{meeting.title}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{meeting.platform}</td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={meeting.sendToNotetaker}
                        onChange={() => toggleMeeting(meeting.id)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            In production, changes here will trigger n8n workflows. TODO: Hook checkbox state to backend mutation.
          </p>
        </div>
      ) : null}
    </>
  );
};

interface ComplianceService {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface StorageConnection {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  helper?: string;
}

const IntegrationsTab: FC<{ visibility: Record<string, boolean> }> = ({ visibility }) => {
  const [integrationState, setIntegrationState] = useState<Integration[]>(defaultIntegrations);
  const [complianceServices, setComplianceServices] = useState<ComplianceService[]>([
    {
      id: 'accounts-prep',
      name: 'Accounts preparation',
      description: 'Route supporting documents to the accounts prep team.',
      enabled: true,
    },
    {
      id: 'business-tax-prep',
      name: 'Business tax preparation',
      description: 'Track deadlines for CT600 and business tax submissions.',
      enabled: true,
    },
    {
      id: 'personal-tax-prep',
      name: 'Personal tax preparation',
      description: 'Collect statements required for SA100 returns.',
      enabled: false,
    },
    {
      id: 'vat-company-secretarial',
      name: 'VAT & company secretarial',
      description: 'Coordinate VAT filings and company secretarial workflows.',
      enabled: true,
    },
  ]);
  const [storageConnections, setStorageConnections] = useState<StorageConnection[]>([
    {
      id: 'onedrive',
      name: 'OneDrive / SharePoint',
      description: 'Sync working papers and templates from Microsoft 365.',
      connected: false,
      helper: 'Use your practice tenant credentials to authorise.',
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Pull client folders and statements from Drive.',
      connected: true,
      helper: 'Connected via kevin@firm.co.uk',
    },
  ]);

  const handleToggle = async (integration: Integration) => {
    if (integration.connected) {
      await disconnectIntegration(integration.id);
    } else {
      await connectIntegration(integration.id);
    }
    setIntegrationState((prev) =>
      prev.map((item) => (item.id === integration.id ? { ...item, connected: !item.connected } : item))
    );
  };

  const toggleComplianceService = (id: string) => {
    setComplianceServices((prev) => prev.map((service) => (service.id === id ? { ...service, enabled: !service.enabled } : service)));
  };

  const handleStorageConnection = async (connection: StorageConnection) => {
    if (connection.connected) {
      await disconnectIntegration(connection.id);
    } else {
      await connectIntegration(connection.id);
    }
    setStorageConnections((prev) =>
      prev.map((item) => (item.id === connection.id ? { ...item, connected: !item.connected } : item))
    );
  };

  return (
    <div className="space-y-6">
      {visibility['settings.integrations.compliance'] ? (
        <div className={sectionClass}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Compliance services</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tell Flowiee which services your practice delivers so requests route correctly.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
              Beta
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {complianceServices.map((service) => (
              <div
                key={service.id}
                className="flex items-start justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{service.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{service.description}</p>
                </div>
                <ToggleSwitch enabled={service.enabled} onToggle={() => toggleComplianceService(service.id)} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            These services determine which automations n8n should run for each incoming request.
          </p>
        </div>
      ) : null}

      {visibility['settings.integrations.storage'] ? (
        <div className={sectionClass}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Document storage</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Connect your drive so Flowiee can fetch statements, bank feeds, and working papers.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {storageConnections.map((connection) => (
              <div
                key={connection.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/60 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{connection.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{connection.description}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      connection.connected ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 dark:bg-slate-900/40 text-slate-500'
                    }`}
                  >
                    {connection.connected ? 'Connected' : 'Not connected'}
                  </span>
                </div>
                {connection.helper && <p className="text-xs text-slate-500 dark:text-slate-400">{connection.helper}</p>}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleStorageConnection(connection)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      connection.connected
                        ? 'border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200'
                        : 'bg-emerald-600 text-white shadow'
                    }`}
                  >
                    {connection.connected ? 'Manage connection' : 'Connect drive'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {visibility['settings.integrations.apps'] ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {integrationState.map((integration) => (
            <div key={integration.id} className={sectionClass}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{integration.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{integration.description}</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-900/40" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    integration.connected ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 dark:bg-slate-900/40 text-slate-500'
                  }`}
                >
                  {integration.connected ? 'Connected' : 'Not connected'}
                </span>
                <button
                  onClick={() => handleToggle(integration)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    integration.connected
                      ? 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                      : 'bg-emerald-600 text-white shadow'
                  }`}
                >
                  {integration.connected ? 'Manage' : 'Connect'}
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">TODO: Trigger n8n integration call for {integration.name}.</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const FaqTab: FC<{ visibility: Record<string, boolean> }> = ({ visibility }) => {
  const faqs = [
    {
      question: 'What if I already have an email label system?',
      answer: 'Flowiee respects your structure and layers automations without overwriting labels.',
    },
    {
      question: 'Will Flowiee change my inbox permanently?',
      answer: 'No. Settings let you pause or revert at any time. Changes run via automations in n8n.',
    },
    {
      question: 'Can I disable Flowiee and go back to normal?',
      answer: 'Yes, toggle features off and Flowiee steps back immediately.',
    },
    {
      question: 'How does the scheduling feature work?',
      answer: 'Flowiee reads your calendar availability and proposes times via the link provided.',
    },
    {
      question: 'Is my data secure?',
      answer: 'All data is processed via secure connections. TODO: link to compliance docs.',
    },
  ];

  return (
    <>
      {visibility['settings.faq.list'] ? (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className={sectionClass}>
              <summary className="cursor-pointer text-base font-semibold text-slate-900 dark:text-white">{faq.question}</summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      ) : null}
    </>
  );
};

interface ToggleRowProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  compact?: boolean;
}

const ToggleRow: FC<ToggleRowProps> = ({ title, description, enabled, onToggle, compact }) => (
  <div className={`flex items-start justify-between gap-4 ${compact ? 'py-0' : 'py-2'}`}>
    <div>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </div>
    <ToggleSwitch enabled={enabled} onToggle={onToggle} />
  </div>
);

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
      enabled ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
    }`}
  >
    <span className={`inline-block h-4 w-4 rounded-full bg-white dark:bg-slate-950 transition ${enabled ? 'translate-x-5' : 'translate-x-1'}`} />
  </button>
);

interface PrimaryButtonProps {
  label: string;
  onClick: () => void | Promise<void>;
}

const PrimaryButton: FC<PrimaryButtonProps> = ({ label, onClick }) => (
  <button onClick={onClick} className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500">
    {label}
  </button>
);
