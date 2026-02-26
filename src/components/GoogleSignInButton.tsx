import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

type GoogleSignInButtonProps = {
  className?: string;
};

const GoogleSignInButton = ({ className }: GoogleSignInButtonProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    if (isLoading) {
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      await loginWithGoogle();
      console.info('Google OAuth redirect initiated.');
    } catch (oauthError) {
      console.error('Supabase Google OAuth sign-in failed.', oauthError);
      const message = oauthError instanceof Error ? oauthError.message : 'Google sign-in failed. Please try again.';
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        type="button"
        className={`w-full ${className ?? ''}`}
        onClick={() => void handleGoogleSignIn()}
        disabled={isLoading}
        aria-label="Sign in with Google"
      >
        <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.64 9.2045c0-.6382-.0573-1.2518-.1636-1.8409H9v3.4818h4.8436c-.2086 1.125-.8436 2.0782-1.7986 2.7164v2.2582h2.9086c1.7018-1.5668 2.6864-3.8741 2.6864-6.6155z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1791l-2.9086-2.2582c-.8059.54-1.8368.8591-3.0477.8591-2.3441 0-4.3282-1.5832-5.0368-3.7104H.9568v2.332C2.4377 15.9832 5.4818 18 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.9632 10.7104c-.18-.54-.2836-1.1168-.2836-1.7104s.1036-1.1705.2836-1.7105V4.9577H.9568A8.9955 8.9955 0 000 9c0 1.4523.3486 2.8268.9568 4.0423l3.0064-2.3319z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.5782c1.3214 0 2.5077.4555 3.4405 1.35l2.5805-2.5804C13.4632.8918 11.426.0004 9 .0004 5.4818.0004 2.4377 2.0168.9568 4.9577l3.0064 2.3318C4.6718 5.1618 6.6559 3.5782 9 3.5782z"
            fill="#EA4335"
          />
        </svg>
        <span>{isLoading ? 'Redirecting to Google…' : 'Sign in with Google'}</span>
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
