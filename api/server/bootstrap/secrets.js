const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');

let secretsLoaded = false;

async function loadSecrets() {
  if (secretsLoaded) {
    return;
  }

  const secretName = process.env.AWS_SECRET_NAME;
  const region = process.env.AWS_REGION;

  if (!secretName || !region) {
    console.warn(
      'AWS secrets not configured. Falling back to existing environment variables.'
    );
    return;
  }

  const client = new SecretsManagerClient({ region });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretName })
  );

  let secretPayload = response.SecretString;
  if (!secretPayload && response.SecretBinary) {
    secretPayload = Buffer.from(response.SecretBinary, 'base64').toString(
      'utf8'
    );
  }

  if (!secretPayload) {
    throw new Error(`Secret "${secretName}" has no payload.`);
  }

  let secrets;
  try {
    secrets = JSON.parse(secretPayload);
  } catch (error) {
    throw new Error(
      `Secret "${secretName}" must be a JSON object. Failed to parse payload.`
    );
  }

  const keys = [];
  for (const [key, value] of Object.entries(secrets)) {
    process.env[key] = value == null ? '' : String(value);
    keys.push(key);
  }

  console.log(
    `Loaded ${keys.length} secrets from AWS Secrets Manager: ${keys.join(', ')}`
  );

  secretsLoaded = true;
}

module.exports = { loadSecrets };
