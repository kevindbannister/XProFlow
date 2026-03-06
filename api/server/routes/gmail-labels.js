const { decrypt, encrypt } = require('../encryption');
const { refreshAccessToken } = require('../google/oauth');
const { requireInternalApiAuth } = require('../middleware/internalApiAuth');
const { requireUser } = require('../auth/supabaseAuth');

const GMAIL_BASE_URL = 'https://gmail.googleapis.com/gmail/v1';

function resolveExpiryDate(credentials) {
  if (credentials?.expiry_date) {
    const parsed = new Date(credentials.expiry_date);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date(Date.now() + 3600 * 1000).toISOString();
}

function isTokenExpired(tokenExpiresAt) {
  const expiry = new Date(tokenExpiresAt).getTime();
  return Number.isNaN(expiry) || expiry <= Date.now();
}

function decryptToken(encryptedToken) {
  if (!encryptedToken) {
    return null;
  }

  return decrypt(encryptedToken);
}

async function getConnectedAccount(supabase, userIdOrConnectedAccountId, maybeConnectedAccountId) {
  const isScopedToUser = Boolean(maybeConnectedAccountId);
  const userId = isScopedToUser ? userIdOrConnectedAccountId : null;
  const connectedAccountId = isScopedToUser ? maybeConnectedAccountId : userIdOrConnectedAccountId;

  let query = supabase
    .from('connected_accounts')
    .select('id,provider,access_token_encrypted,refresh_token_encrypted,token_expires_at')
    .eq('provider', 'google');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  if (connectedAccountId) {
    query = query.eq('id', connectedAccountId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  return data || null;
}

async function getAccessToken(supabase, account) {
  if (!account?.access_token_encrypted) {
    throw new Error('Connected account missing access token.');
  }

  let accessToken = decryptToken(account.access_token_encrypted);
  if (!isTokenExpired(account.token_expires_at)) {
    return accessToken;
  }

  if (!account.refresh_token_encrypted) {
    throw new Error('Connected account missing refresh token.');
  }

  const refreshToken = decryptToken(account.refresh_token_encrypted);
  const { credentials } = await refreshAccessToken(refreshToken);
  if (!credentials?.access_token) {
    throw new Error('Failed to refresh Gmail access token.');
  }

  accessToken = credentials.access_token;
  const { error: updateError } = await supabase
    .from('connected_accounts')
    .update({
      access_token_encrypted: encrypt(accessToken),
      refresh_token_encrypted: credentials.refresh_token
        ? encrypt(credentials.refresh_token)
        : account.refresh_token_encrypted,
      token_expires_at: resolveExpiryDate(credentials)
    })
    .eq('id', account.id);

  if (updateError) {
    throw updateError;
  }

  return accessToken;
}

async function gmailRequest({ accessToken, path, method = 'GET', body }) {
  const response = await fetch(`${GMAIL_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(`Gmail API request failed: ${method} ${path} (${response.status})`);
    error.status = response.status;
    error.body = errorText;
    throw error;
  }

  return response.json();
}

function mapLabelRow(connectedAccountId, label) {
  const labelListVisibility = label.labelListVisibility || null;
  const messageListVisibility = label.messageListVisibility || null;
  const isVisibleInLabelList =
    labelListVisibility === 'labelShow' || labelListVisibility === 'labelShowIfUnread';
  const isVisibleInMessageList = messageListVisibility === 'show';

  return {
    connected_account_id: connectedAccountId,
    gmail_label_id: label.id,
    label_name: label.name || null,
    label_type: label.type || null,
    is_enabled: isVisibleInLabelList || isVisibleInMessageList,
    color_background: label.color?.backgroundColor || null,
    color_text: label.color?.textColor || null,
    updated_at: new Date().toISOString()
  };
}

function registerGmailLabelRoutes(app, supabase) {
  app.get('/api/gmail/labels', async (req, res) => {
    try {
      const user = await requireUser(req, res, supabase);
      if (!user) {
        return;
      }

      const connectedAccountId = req.query.connected_account_id;
      if (!connectedAccountId) {
        return res.status(400).json({ error: 'connected_account_id is required' });
      }

      const account = await getConnectedAccount(supabase, user.id, connectedAccountId);
      if (!account) {
        return res.status(404).json({ error: 'Connected account not found' });
      }

      let query = supabase
        .from('gmail_labels')
        .select('*')
        .eq('connected_account_id', account.id)
        .order('label_name', { ascending: true });

      const { data, error } = await query;
      if (error) {
        throw error;
      }

      return res.json({ labels: data || [] });
    } catch (error) {
      console.error('Gmail labels list error:', error);
      return res.status(500).json({ error: 'Failed to list Gmail labels' });
    }
  });

  app.post('/api/gmail/labels/sync', async (req, res) => {
    const { connected_account_id: connectedAccountId } = req.body || {};

    try {
      const user = await requireUser(req, res, supabase);
      if (!user) {
        return;
      }

      if (!connectedAccountId) {
        return res.status(400).json({ error: 'connected_account_id is required' });
      }

      const account = await getConnectedAccount(supabase, user.id, connectedAccountId);
      if (!account) {
        return res.status(404).json({ error: 'Connected account not found' });
      }

      const accessToken = await getAccessToken(supabase, account);
      const payload = await gmailRequest({
        accessToken,
        path: '/users/me/labels',
        method: 'GET'
      });

      const labels = Array.isArray(payload?.labels) ? payload.labels : [];
      if (labels.length > 0) {
        const rows = labels.map((label) => mapLabelRow(connectedAccountId, label));
        const { error: upsertError } = await supabase
          .from('gmail_labels')
          .upsert(rows, { onConflict: 'connected_account_id,gmail_label_id' });

        if (upsertError) {
          throw upsertError;
        }
      }

      return res.json({ synced_count: labels.length });
    } catch (error) {
      console.error('Gmail labels sync Gmail API failure:', {
        connected_account_id: connectedAccountId,
        status: error?.status,
        body: error?.body,
        message: error?.message
      });
      return res.status(500).json({ error: 'Failed to sync Gmail labels' });
    }
  });

  app.post('/api/gmail/labels', requireInternalApiAuth, async (req, res) => {
    const {
      connected_account_id: connectedAccountId,
      name,
      text_color: textColor
    } = req.body || {};

    try {
      if (!connectedAccountId || !name) {
        return res.status(400).json({ error: 'connected_account_id and name are required' });
      }

      const account = await getConnectedAccount(supabase, connectedAccountId);
      if (!account) {
        return res.status(404).json({ error: 'Connected account not found' });
      }

      const accessToken = await getAccessToken(supabase, account);
      const createdLabel = await gmailRequest({
        accessToken,
        path: '/users/me/labels',
        method: 'POST',
        body: {
          name,
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show',
          color: {
            textColor: textColor || undefined
          }
        }
      });

      const row = mapLabelRow(connectedAccountId, createdLabel);
      const { data, error } = await supabase
        .from('gmail_labels')
        .insert(row)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      return res.status(201).json({ label: data });
    } catch (error) {
      console.error('Gmail labels create Gmail API failure:', {
        connected_account_id: connectedAccountId,
        status: error?.status,
        body: error?.body,
        message: error?.message
      });
      return res.status(500).json({ error: 'Failed to create Gmail label' });
    }
  });

  app.patch('/api/gmail/labels/:label_id', requireInternalApiAuth, async (req, res) => {
    const labelId = req.params.label_id;
    const {
      connected_account_id: connectedAccountId,
      text_color: textColor,
      ai_enabled: aiEnabled
    } = req.body || {};

    try {
      if (!connectedAccountId || !labelId) {
        return res.status(400).json({ error: 'connected_account_id and label_id are required' });
      }

      const account = await getConnectedAccount(supabase, connectedAccountId);
      if (!account) {
        return res.status(404).json({ error: 'Connected account not found' });
      }

      const accessToken = await getAccessToken(supabase, account);
      if (typeof textColor !== 'undefined') {
        await gmailRequest({
          accessToken,
          path: `/users/me/labels/${encodeURIComponent(labelId)}`,
          method: 'PATCH',
          body: {
            color: {
              textColor: textColor || undefined
            }
          }
        });
      }

      const { data, error } = await supabase
        .from('gmail_labels')
        .update({
          ...(typeof textColor !== 'undefined' ? { text_color: textColor || null } : {}),
          ...(typeof aiEnabled === 'boolean' ? { ai_enabled: aiEnabled } : {}),
          updated_at: new Date().toISOString()
        })
        .eq('connected_account_id', connectedAccountId)
        .eq('gmail_label_id', labelId)
        .select('*')
        .maybeSingle();

      if (error) {
        throw error;
      }

      return res.json({ label: data });
    } catch (error) {
      console.error('Gmail labels update Gmail API failure:', {
        connected_account_id: connectedAccountId,
        gmail_label_id: labelId,
        status: error?.status,
        body: error?.body,
        message: error?.message
      });
      return res.status(500).json({ error: 'Failed to update Gmail label' });
    }
  });


  app.patch('/api/gmail/labels/bulk', requireInternalApiAuth, async (req, res) => {
    const {
      connected_account_id: connectedAccountId,
      ai_enabled: aiEnabled
    } = req.body || {};

    try {
      if (!connectedAccountId || typeof aiEnabled !== 'boolean') {
        return res.status(400).json({ error: 'connected_account_id and ai_enabled are required' });
      }

      const { data, error } = await supabase
        .from('gmail_labels')
        .update({
          ai_enabled: aiEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('connected_account_id', connectedAccountId)
        .select('*');

      if (error) {
        throw error;
      }

      return res.json({ labels: data || [] });
    } catch (error) {
      console.error('Gmail labels bulk update error:', error);
      return res.status(500).json({ error: 'Failed to bulk update Gmail labels' });
    }
  });

  app.post('/api/gmail/labels/archive', requireInternalApiAuth, async (req, res) => {
    const {
      connected_account_id: connectedAccountId,
      label_id: labelId,
      gmail_label_id: gmailLabelId
    } = req.body || {};

    try {
      const resolvedLabelId = gmailLabelId || labelId;
      if (!connectedAccountId || !resolvedLabelId) {
        return res.status(400).json({ error: 'connected_account_id and label_id are required' });
      }

      const { data, error } = await supabase
        .from('gmail_labels')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('connected_account_id', connectedAccountId)
        .eq('gmail_label_id', resolvedLabelId)
        .select('*')
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return res.status(404).json({ error: 'Label not found' });
      }

      return res.json({ label: data });
    } catch (error) {
      console.error('Gmail labels archive error:', error);
      return res.status(500).json({ error: 'Failed to archive Gmail label' });
    }
  });
}

module.exports = {
  registerGmailLabelRoutes,
  getAccessToken,
  decryptToken
};
