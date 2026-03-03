async function getOrCreateLabel(gmail, labelName) {
  const { data } = await gmail.users.labels.list({ userId: 'me' });
  const existingLabel = (data.labels || []).find((label) => label.name === labelName);

  if (existingLabel) {
    return existingLabel;
  }

  const createResponse = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
      name: labelName
    }
  });

  return createResponse.data;
}

module.exports = {
  getOrCreateLabel
};
