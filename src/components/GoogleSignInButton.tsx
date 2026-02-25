import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

type GoogleSignInButtonProps = {
  className?: string;
};

const GoogleSignInButton = ({ className }: GoogleSignInButtonProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { loginWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);

    try {
      await loginWithGoogle();
      console.info('Google OAuth redirect initiated.');
    } catch (oauthError) {
      console.error('Supabase Google OAuth sign-in failed.', oauthError);
      const message = oauthError instanceof Error ? oauthError.message : 'Google sign-in failed. Please try again.';
      setErrorMessage(message);
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Button type="button" className={`w-full ${className ?? ''}`} onClick={() => void handleGoogleSignIn()}>
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
