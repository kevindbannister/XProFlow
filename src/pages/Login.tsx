import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12 dark:bg-slate-950">
      <Card className="w-full max-w-md space-y-4 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            EmailAI
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue to your workspace.
          </p>
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={() => {
            login();
            navigate('/dashboard');
          }}
        >
          Sign in
        </Button>
      </Card>
    </div>
  );
};

export default Login;
