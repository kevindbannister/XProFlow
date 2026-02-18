const fs = require('fs/promises');
const path = require('path');
const { getUserFromRequest } = require('../auth/supabaseAuth');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'featureFlags.json');
const FEATURE_FLAGS_ROW_KEY = 'global';
const FEATURE_FLAGS_TABLE = 'feature_flags';

const DEFAULT_FLAGS = {
  dashboard: true,
  inbox: true,
  labels: true,
  rules: true,
  drafting: true,
  writingStyle: true,
  signatureTimeZone: true,
  professionalContext: true,
  account: true,
  help: true,
};

const normalizeFlags = (incomingFlags) => {
  const normalizedFlags = { ...DEFAULT_FLAGS };
  Object.keys(DEFAULT_FLAGS).forEach((key) => {
    if (typeof incomingFlags?.[key] === 'boolean') {
      normalizedFlags[key] = incomingFlags[key];
    }
  });
  return normalizedFlags;
};

const getConfiguredMasterEmails = () => {
  const configured = [
    process.env.MASTER_USER_EMAILS,
    process.env.MASTER_USER_EMAIL,
    process.env.MASTER_LOGIN_EMAIL,
    process.env.MASTER_EMAIL,
    process.env.ADMIN_EMAIL,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return new Set(configured);
};

const isMasterUserEmail = (email) => {
  if (!email) {
    return false;
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const configuredMasterEmails = getConfiguredMasterEmails();
  if (configuredMasterEmails.size > 0) {
    return configuredMasterEmails.has(normalizedEmail);
  }

  return false;
};

async function readFlagsFromDisk() {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return normalizeFlags(parsed.flags || {});
  } catch (_error) {
    return { ...DEFAULT_FLAGS };
  }
}

async function writeFlagsToDisk(flags) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    STORE_PATH,
    JSON.stringify({ flags, updatedAt: new Date().toISOString() }, null, 2),
    'utf8'
  );
}

async function loadFlagsFromSupabase(supabase) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from(FEATURE_FLAGS_TABLE)
    .select('flags')
    .eq('id', FEATURE_FLAGS_ROW_KEY)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data || !data.flags || typeof data.flags !== 'object') {
    return null;
  }

  return normalizeFlags(data.flags);
}

async function saveFlagsToSupabase(supabase, flags) {
  if (!supabase) {
    return false;
  }

  const { error } = await supabase.from(FEATURE_FLAGS_TABLE).upsert(
    {
      id: FEATURE_FLAGS_ROW_KEY,
      flags,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error) {
    throw error;
  }

  return true;
}

async function loadFlags(supabase) {
  try {
    const supabaseFlags = await loadFlagsFromSupabase(supabase);
    if (supabaseFlags) {
      return supabaseFlags;
    }
  } catch (error) {
    console.error('Failed to load feature flags from Supabase, falling back to disk:', error);
  }

  return readFlagsFromDisk();
}

async function saveFlags(flags, supabase) {
  try {
    const savedToSupabase = await saveFlagsToSupabase(supabase, flags);
    if (savedToSupabase) {
      return { source: 'supabase' };
    }
  } catch (error) {
    console.error('Failed to save feature flags to Supabase, falling back to disk:', error);
  }

  await writeFlagsToDisk(flags);
  return { source: 'disk' };
}

async function canManageFeatureFlags(req, supabase) {
  const isManualMasterSession = req.headers['x-master-session'] === 'true';
  if (isManualMasterSession) {
    return true;
  }

  if (!supabase) {
    return false;
  }

  const user = await getUserFromRequest(req, supabase);
  return isMasterUserEmail(user?.email);
}

function registerFeatureFlagRoutes(app, supabase) {
  app.get('/api/feature-flags', async (_req, res) => {
    try {
      const flags = await loadFlags(supabase);
      res.json({ flags });
    } catch (error) {
      console.error('Failed to load feature flags:', error);
      res.status(500).json({ error: 'Failed to load feature flags' });
    }
  });

  app.put('/api/feature-flags', async (req, res) => {
    try {
      const isAllowed = await canManageFeatureFlags(req, supabase);
      if (!isAllowed) {
        res.status(403).json({ error: 'Master access required' });
        return;
      }

      const incomingFlags = req.body?.flags;
      if (!incomingFlags || typeof incomingFlags !== 'object') {
        res.status(400).json({ error: 'Invalid flags payload' });
        return;
      }

      const updatedFlags = normalizeFlags(incomingFlags);
      const { source } = await saveFlags(updatedFlags, supabase);

      res.json({ flags: updatedFlags, persistedTo: source });
    } catch (error) {
      console.error('Failed to update feature flags:', error);
      res.status(500).json({ error: 'Failed to update feature flags' });
    }
  });
}

module.exports = { registerFeatureFlagRoutes, DEFAULT_FLAGS, isMasterUserEmail };
