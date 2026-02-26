import Card from '../ui/Card';
import { apiBaseUrl } from '../../config/api';
import { supabase } from '../../lib/supabaseClient';

const ConnectEmailPanel = () => {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl rounded-lg border border-slate-200/80 bg-white/80 p-8 text-center shadow-[0_10px_30px_rgba(148,163,184,0.2)] sm:p-10">
        <h2 className="text-2xl font-semibold leading-tight text-[var(--text-secondary)]">Connect your email</h2>
        <p className="mt-3 text-base text-[var(--text-muted)] sm:text-lg">
          Connect Gmail to unlock dashboard metrics and track your email productivity in real time.
        </p>
        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          onClick={async () => {
            const {
              data: { session }
            } = await supabase.auth.getSession();

            if (!session?.access_token) {
              return;
            }

            const response = await fetch(`${apiBaseUrl}/api/gmail/oauth/start`, {
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            });

            const data = await response.json();
            if (data?.url) {
              window.location.href = data.url;
            }
          }}
        >
          Connect Gmail
        </button>
      </Card>
    </div>
  );
};

export default ConnectEmailPanel;
