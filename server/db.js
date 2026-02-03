const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'data', 'app.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS gmail_connections (
    user_id TEXT PRIMARY KEY,
    google_user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    refresh_token_enc TEXT NOT NULL,
    scopes TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

function upsertConnection({
  userId,
  googleUserId,
  email,
  refreshTokenEnc,
  scopes
}) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO gmail_connections
      (user_id, google_user_id, email, refresh_token_enc, scopes, created_at, updated_at)
    VALUES
      (@userId, @googleUserId, @email, @refreshTokenEnc, @scopes, @now, @now)
    ON CONFLICT(user_id) DO UPDATE SET
      google_user_id = excluded.google_user_id,
      email = excluded.email,
      refresh_token_enc = excluded.refresh_token_enc,
      scopes = excluded.scopes,
      updated_at = excluded.updated_at;
  `);
  stmt.run({ userId, googleUserId, email, refreshTokenEnc, scopes, now });
}

function getConnection(userId) {
  const stmt = db.prepare('SELECT * FROM gmail_connections WHERE user_id = ?');
  return stmt.get(userId) || null;
}

function deleteConnection(userId) {
  const stmt = db.prepare('DELETE FROM gmail_connections WHERE user_id = ?');
  stmt.run(userId);
}

module.exports = { db, upsertConnection, getConnection, deleteConnection };
