import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const GmailCallback = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [message, setMessage] = useState('Connecting Gmail…');

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (!code) {
        setMessage('Missing Gmail authorization code.');
        navigate('/integrations?error=gmail_code', { replace: true });
        return;
      }

      try {
        setMessage('Saving Gmail connection…');
        await api.post('/api/gmail/connect', { code });
        await refreshSession();
        navigate('/inbox?connected=gmail', { replace: true });
      } catch (error) {
        console.error('Gmail connect failed:', error);
        setMessage('Gmail connection failed.');
        navigate('/integrations?error=gmail_connect', { replace: true });
      }
    })();
  }, [navigate, refreshSession]);

  return <div style={{ padding: 24 }}>{message}</div>;
};

export default GmailCallback;
