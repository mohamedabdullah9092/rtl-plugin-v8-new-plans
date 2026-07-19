# RTL Master Admin Dashboard

Standalone admin dashboard for the RTL Master plugin.

## What is included

- `index.html`: the dashboard shell and page sections
- `styles.css`: responsive visual system and layout
- `app.js`: live Cloudflare Worker data loading, fallback mock data, tab switching, and small interactions
- `WIREFRAME.md`: page structure and product wireframe

## Open locally

For local development, serve the folder with a small static server:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173/`.

## Live Data

The dashboard reads live data from:

```text
POST /api/admin/dashboard
```

The live endpoint now combines license records with plugin telemetry from:

```text
POST /api/telemetry
```

To connect it:

1. Open `Settings`.
2. Keep the Activation Worker URL set to your deployed Worker URL.
3. Paste the `ADMIN_TOKEN`.
4. Click `Save Dashboard Settings`.

The token is stored only in the current browser's `localStorage`; it is not committed into the project.

## Telemetry Captured

- Plugin opens and upgrade-screen opens
- Gumroad and support clicks
- Trial usage and trial exhaustion
- Feature start/completion/failure for mirror, translate, variants, and font changing
- Selection counts, text-layer counts, language pair, duration, plan, and error code

No design text, full license key, API key, or document content is sent.

## Buyer Data

After a successful Gumroad activation, the admin-only dashboard can show and export:

- Buyer email
- Buyer/Figma name
- Full activation code
- Purchase date

Keep the `ADMIN_TOKEN` private because the Users CSV includes full activation codes.

## Why this shape

This version is static on purpose so it can be deployed easily to:

- Vercel
- Cloudflare Pages

without adding a framework build step yet.

## Next integration step

Deploy this static folder to Vercel or Cloudflare Pages, then enter the same `ADMIN_TOKEN` from the deployed dashboard settings screen.
