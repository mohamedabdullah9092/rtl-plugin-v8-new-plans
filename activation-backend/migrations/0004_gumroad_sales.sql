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
