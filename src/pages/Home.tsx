import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const Home = () => {
  return (
    <section className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Home</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Welcome to XProFlow. Start from your inbox or open settings from the profile menu.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Get started</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          Your Inbox experience is still available and has also been preserved as a backup page for later development.
        </p>
        <Link
          to="/inbox"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)] transition hover:bg-blue-500"
        >
          Open Inbox
        </Link>
      </Card>
    </section>
  );
};

export default Home;
