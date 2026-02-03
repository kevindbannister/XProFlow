const crypto = require('crypto');

function getKey(keyBase64) {
  const key = Buffer.from(keyBase64, 'base64');
  if (key.length !== 32) {
    throw new Error('TOKEN_ENC_KEY must be 32 bytes base64-encoded');
  }
  return key;
}

function encrypt(keyBase64, plaintext) {
  const key = getKey(keyBase64);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

function decrypt(keyBase64, payload) {
  const key = getKey(keyBase64);
  const raw = Buffer.from(payload, 'base64');
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ciphertext = raw.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}

module.exports = { encrypt, decrypt };
