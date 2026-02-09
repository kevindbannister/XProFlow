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

module.exports = {
  getFolderQuery,
  listMessages,
  getMessageMetadata,
  fetchProfile
};
