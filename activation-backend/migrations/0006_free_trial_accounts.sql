CREATE TABLE IF NOT EXISTS free_trial_accounts (
  figma_user_id TEXT PRIMARY KEY,
  remaining INTEGER NOT NULL DEFAULT 10 CHECK (remaining >= 0 AND remaining <= 10),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

