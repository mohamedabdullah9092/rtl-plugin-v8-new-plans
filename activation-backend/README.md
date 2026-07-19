# RTL Master Activation Backend

This backend links a Gumroad license to a Figma user ID so the same user can use the plugin across multiple devices.

## Endpoints

- `POST /api/activate-license`
- `POST /api/license-status`
- `POST /api/unlink-license`
- `POST /api/telemetry`
- `POST /api/admin/dashboard`
- `POST /api/admin/diagnostics`
- `POST /api/admin/test-telemetry`
- `POST /api/admin/backfill-purchases`
- `POST /api/admin/import-gumroad-sales`

The admin dashboard endpoint requires an `ADMIN_TOKEN` secret sent as:

```text
Authorization: Bearer <ADMIN_TOKEN>
```

## Deploy

1. Create a Cloudflare D1 database.
2. Put the D1 database ID into `wrangler.toml`.
3. Run the schema in `schema.sql`.
4. Set the `ADMIN_TOKEN` secret.
5. Deploy the worker.
6. Copy the Worker URL.
7. Set `ACTIVATION_SERVER_BASE_URL` in `code.js`.
8. Add the Worker domain to `manifest.json > networkAccess.allowedDomains`.

## Admin Setup

For a new database, apply the full schema:

```bash
npx wrangler d1 execute rtl-master-activation-db --remote --file ./schema.sql
npx wrangler secret put ADMIN_TOKEN
npx wrangler deploy
```

For an existing deployed database that already has `license_bindings` but was created before buyer email and purchase-date fields were added, run the purchase-field migration once:

```bash
npx wrangler d1 execute rtl-master-activation-db --remote --file ./migrations/0002_license_purchase_fields.sql
```

To show whether a user is monthly/yearly and any subscription end date Gumroad returns, run the subscription-field migration once:

```bash
npx wrangler d1 execute rtl-master-activation-db --remote --file ./migrations/0003_license_subscription_fields.sql
```

To pull buyers and sales directly from Gumroad into D1, run the Gumroad sales migration once and set the Gumroad API access token as a Worker secret:

```bash
npx wrangler d1 execute rtl-master-activation-db --remote --file ./migrations/0004_gumroad_sales.sql
npx wrangler secret put GUMROAD_ACCESS_TOKEN
npx wrangler deploy
```

If data does not appear in the dashboard, check the schema and telemetry path:

```bash
curl -X POST "https://<your-worker>/api/admin/diagnostics" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

curl -X POST "https://<your-worker>/api/admin/test-telemetry" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

To fill buyer email, purchase dates, billing cycle, and subscription end dates for old linked licenses, call the admin backfill after deploying:

```bash
curl -X POST "https://<your-worker>/api/admin/backfill-purchases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"limit\":50}"
```

To import Gumroad sales after setting `GUMROAD_ACCESS_TOKEN`, use the dashboard Settings import button or call:

```bash
curl -X POST "https://<your-worker>/api/admin/import-gumroad-sales" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"limit\":500}"
```

## Notes

- `figma.clientStorage` is still used only as a local cache.
- The server becomes the source of truth for whether a Figma user is Pro.
- If a Gumroad subscription ends, the backend will revoke Pro on the next status check.
- The admin dashboard can show buyer email, buyer/Figma name, full activation code, and purchase date after the user activates through the plugin.
- Product telemetry records usage counts, plans, features, languages, trials, timing, and error codes only.
- Do not send design text, API keys, full license keys, or document content to `/api/telemetry`.
