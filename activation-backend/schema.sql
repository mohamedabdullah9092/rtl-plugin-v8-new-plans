CREATE TABLE IF NOT EXISTS license_bindings (
  figma_user_id TEXT PRIMARY KEY,
  figma_user_name TEXT,
  license_key TEXT NOT NULL UNIQUE,
  gumroad_sale_id TEXT,
  gumroad_email TEXT,
  gumroad_buyer_name TEXT,
  gumroad_purchase_created_at TEXT,
  gumroad_product_name TEXT,
  gumroad_subscription_plan TEXT,
  gumroad_subscription_status TEXT,
  gumroad_subscription_ends_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_license_bindings_license_key
ON license_bindings (license_key);

CREATE TABLE IF NOT EXISTS gumroad_sales (
  gumroad_sale_id TEXT PRIMARY KEY,
  license_key TEXT,
  email TEXT,
  buyer_name TEXT,
  product_name TEXT,
  product_id TEXT,
  product_permalink TEXT,
  purchase_created_at TEXT,
  subscription_plan TEXT,
  subscription_status TEXT,
  subscription_ends_at TEXT,
  refunded INTEGER NOT NULL DEFAULT 0,
  chargebacked INTEGER NOT NULL DEFAULT 0,
  imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gumroad_sales_license_key
ON gumroad_sales (license_key);

CREATE INDEX IF NOT EXISTS idx_gumroad_sales_email
ON gumroad_sales (email);

CREATE TABLE IF NOT EXISTS license_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  figma_user_id TEXT,
  figma_user_name TEXT,
  license_key_hint TEXT,
  success INTEGER NOT NULL,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_license_events_created_at
ON license_events (created_at);

CREATE INDEX IF NOT EXISTS idx_license_events_figma_user_id
ON license_events (figma_user_id);

CREATE TABLE IF NOT EXISTS plugin_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  figma_user_id TEXT,
  figma_user_name TEXT,
  plan TEXT,
  feature TEXT,
  trial_count INTEGER,
  from_language TEXT,
  to_language TEXT,
  selection_count INTEGER,
  text_layer_count INTEGER,
  duration_ms INTEGER,
  success INTEGER NOT NULL DEFAULT 1,
  error_code TEXT,
  message TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_plugin_events_created_at
ON plugin_events (created_at);

CREATE INDEX IF NOT EXISTS idx_plugin_events_figma_user_id
ON plugin_events (figma_user_id);

CREATE INDEX IF NOT EXISTS idx_plugin_events_event_type
ON plugin_events (event_type);

CREATE INDEX IF NOT EXISTS idx_plugin_events_feature
ON plugin_events (feature);
