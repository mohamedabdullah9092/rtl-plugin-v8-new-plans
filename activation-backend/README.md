# RTL Master Activation Backend

This backend links a Gumroad license to a Figma user ID so the same user can use the plugin across multiple devices.

## Endpoints

- `POST /api/activate-license`
- `POST /api/license-status`
- `POST /api/unlink-license`

## Deploy

1. Create a Cloudflare D1 database.
2. Put the D1 database ID into `wrangler.toml`.
3. Run the schema in `schema.sql`.
4. Deploy the worker.
5. Copy the Worker URL.
6. Set `ACTIVATION_SERVER_BASE_URL` in `code.js`.
7. Add the Worker domain to `manifest.json > networkAccess.allowedDomains`.

## Notes

- `figma.clientStorage` is still used only as a local cache.
- The server becomes the source of truth for whether a Figma user is Pro.
- If a Gumroad subscription ends, the backend will revoke Pro on the next status check.
