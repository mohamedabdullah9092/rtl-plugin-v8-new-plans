ALTER TABLE gumroad_sales ADD COLUMN price_cents INTEGER;
ALTER TABLE gumroad_sales ADD COLUMN sale_currency TEXT;
ALTER TABLE gumroad_sales ADD COLUMN partially_refunded INTEGER NOT NULL DEFAULT 0;
