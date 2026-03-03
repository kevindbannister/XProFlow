const GMAIL_BASE_URL = 'https://gmail.googleapis.com/gmail/v1';

function getFolderQuery(folder) {
  switch (folder) {
    case 'INBOX':
      return 'in:inbox';
    case 'PROMOTIONS':
      return 'category:promotions';
    case 'DRAFT':
      return 'in:drafts';
    case 'SPAM':
      return 'in:spam';
    case 'TRASH':
      return 'in:trash';
    case 'ALL':
      return '';
    default:
      return 'in:inbox';
  }
}

async function listMessages(accessToken, folder) {
  const query = getFolderQuery(folder);
  const params = new URLSearchParams();
  if (query) {
    params.set('q', query);
  }
  params.set('maxResults', '25');

  const response = await fetch(
    `${GMAIL_BASE_URL}/users/me/messages?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to list Gmail messages: ${response.status}`);
  }

  const data = await response.json();
  return data.messages || [];
}

async function getMessageMetadata(accessToken, messageId) {
  const params = new URLSearchParams();
  params.set('format', 'metadata');
  params.append('metadataHeaders', 'From');
  params.append('metadataHeaders', 'Subject');
  params.append('metadataHeaders', 'Date');

  const response = await fetch(
    `${GMAIL_BASE_URL}/users/me/messages/${messageId}?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Gmail message: ${response.status}`);
  }

  return response.json();
}

async function fetchProfile(accessToken) {
  const response = await fetch(`${GMAIL_BASE_URL}/users/me/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Gmail profile: ${response.status}`);
  }

  return response.json();
}

function getGmailClient(accessToken) {
  const authHeaders = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  return {
    users: {
      messages: {
        modify: async ({ userId = 'me', id, requestBody }) => {
          const response = await fetch(
            `${GMAIL_BASE_URL}/users/${encodeURIComponent(userId)}/messages/${encodeURIComponent(id)}/modify`,
            {
              method: 'POST',
              headers: authHeaders,
              body: JSON.stringify(requestBody || {})
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to modify Gmail message: ${response.status} ${errorText}`);
          }

          const data = await response.json();
          return { data };
        }
      },
      labels: {
        list: async ({ userId = 'me' }) => {
          const response = await fetch(
            `${GMAIL_BASE_URL}/users/${encodeURIComponent(userId)}/labels`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to list Gmail labels: ${response.status} ${errorText}`);
          }

          const data = await response.json();
          return { data };
        },
        create: async ({ userId = 'me', requestBody }) => {
          const response = await fetch(
            `${GMAIL_BASE_URL}/users/${encodeURIComponent(userId)}/labels`,
            {
              method: 'POST',
              headers: authHeaders,
              body: JSON.stringify(requestBody || {})
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create Gmail label: ${response.status} ${errorText}`);
          }

          const data = await response.json();
          return { data };
        }
      }
    }
  };
}

async function getOrCreateLabel(gmail, labelName) {
  const { data } = await gmail.users.labels.list({ userId: 'me' });
  const existing = (data.labels || []).find((label) => label.name === labelName);
  if (existing) {
    return existing;
  }

  const created = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
      name: labelName,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show'
    }
  });
  return created.data;
}

module.exports = {
  getFolderQuery,
  listMessages,
  getMessageMetadata,
  fetchProfile,
  getGmailClient,
  getOrCreateLabel
};
