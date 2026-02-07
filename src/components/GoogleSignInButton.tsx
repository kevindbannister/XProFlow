import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/Button';

const GoogleSignInButton = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    console.log('Google clicked');
    setErrorMessage(null);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
    console.log('OAuth result', { data, error });
    if (error) {
      console.error('Supabase Google OAuth sign-in failed.', error);
      setErrorMessage(error.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Button type="button" className="w-full" onClick={() => void handleGoogleSignIn()}>
        Sign in with Google
      </Button>
      {errorMessage ? (
        <p className="text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};

export default GoogleSignInButton;
