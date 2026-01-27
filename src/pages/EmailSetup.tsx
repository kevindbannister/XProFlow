import Card from '../components/ui/Card';

const EmailSetup = () => {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Email Setup
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Connect providers and manage sync preferences. Content coming soon.
        </p>
      </div>
      <Card>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Placeholder for email setup details and provider connections.
        </p>
      </Card>
    </section>
  );
};

export default EmailSetup;
