CREATE TABLE IF NOT EXISTS plugin_users (
  figma_user_id TEXT PRIMARY KEY,
  figma_user_name TEXT,
  plan TEXT,
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_event_type TEXT,
  last_feature TEXT,
  usage_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_plugin_users_last_seen_at
ON plugin_users (last_seen_at);

CREATE INDEX IF NOT EXISTS idx_plugin_users_plan
ON plugin_users (plan);

INSERT INTO plugin_users (
  figma_user_id,
  figma_user_name,
  plan,
  first_seen_at,
  last_seen_at,
  last_event_type,
  last_feature,
  usage_count,
  updated_at
)
SELECT
  events.figma_user_id,
  (
    SELECT latest.figma_user_name
    FROM plugin_events latest
    WHERE latest.figma_user_id = events.figma_user_id
      AND latest.figma_user_name IS NOT NULL
      AND latest.figma_user_name <> ''
    ORDER BY datetime(latest.created_at) DESC
    LIMIT 1
  ),
  (
    SELECT latest.plan
    FROM plugin_events latest
    WHERE latest.figma_user_id = events.figma_user_id
      AND latest.plan IS NOT NULL
      AND latest.plan <> ''
    ORDER BY datetime(latest.created_at) DESC
    LIMIT 1
  ),
  MIN(events.created_at),
  MAX(events.created_at),
  (
    SELECT latest.event_type
    FROM plugin_events latest
    WHERE latest.figma_user_id = events.figma_user_id
    ORDER BY datetime(latest.created_at) DESC
    LIMIT 1
  ),
  (
    SELECT latest.feature
    FROM plugin_events latest
    WHERE latest.figma_user_id = events.figma_user_id
      AND latest.feature IS NOT NULL
      AND latest.feature <> ''
    ORDER BY datetime(latest.created_at) DESC
    LIMIT 1
  ),
  COUNT(*),
  CURRENT_TIMESTAMP
FROM plugin_events events
WHERE events.figma_user_id IS NOT NULL
  AND TRIM(events.figma_user_id) <> ''
GROUP BY events.figma_user_id
ON CONFLICT(figma_user_id) DO UPDATE SET
  figma_user_name = COALESCE(excluded.figma_user_name, plugin_users.figma_user_name),
  plan = COALESCE(excluded.plan, plugin_users.plan),
  first_seen_at = MIN(plugin_users.first_seen_at, excluded.first_seen_at),
  last_seen_at = MAX(plugin_users.last_seen_at, excluded.last_seen_at),
  last_event_type = excluded.last_event_type,
  last_feature = COALESCE(excluded.last_feature, plugin_users.last_feature),
  usage_count = MAX(plugin_users.usage_count, excluded.usage_count),
  updated_at = CURRENT_TIMESTAMP;
