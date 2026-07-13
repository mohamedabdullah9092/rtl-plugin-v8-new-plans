CREATE TABLE IF NOT EXISTS license_bindings (
  figma_user_id TEXT PRIMARY KEY,
  figma_user_name TEXT,
  license_key TEXT NOT NULL UNIQUE,
  gumroad_sale_id TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_license_bindings_license_key
ON license_bindings (license_key);
