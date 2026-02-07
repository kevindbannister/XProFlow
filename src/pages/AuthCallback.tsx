import { useEffect } from 'react';

const AuthCallback = () => {
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Supabase auth callback error', error);
        throw error;
      }
      console.log('Supabase session', data.session);
    };

    void loadSession();
  }, []);

  return null;
};

export default AuthCallback;
