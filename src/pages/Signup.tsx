import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';
import { supabase } from '../lib/supabaseClient';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      await api.post('/api/auth/signup', { email, password, organisationName });
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      navigate('/dashboard');
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : 'Signup failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12 dark:bg-slate-950">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-slate-500">Includes a 14-day free trial and auto-created workspace.</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" type="email" placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" type="password" placeholder="Password" />
        <input value={organisationName} onChange={(e) => setOrganisationName(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" type="text" placeholder="Organisation (optional)" />
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
        <Button type="button" className="w-full" onClick={handleSignup}>Create account</Button>
        <p className="text-xs">Already registered? <Link className="text-blue-600" to="/login">Log in</Link></p>
      </Card>
    </div>
  );
};

export default Signup;
