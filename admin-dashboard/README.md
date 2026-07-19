# RTL Master Admin Dashboard

Standalone admin dashboard prototype for the RTL Master plugin.

## What is included

- `index.html`: the dashboard shell and page sections
- `styles.css`: responsive visual system and layout
- `app.js`: mock data rendering, tab switching, and small interactions
- `WIREFRAME.md`: page structure and product wireframe

## Open locally

Open `index.html` directly in a browser.

## Why this shape

This version is static on purpose so it can be deployed easily to:

- Vercel
- Cloudflare Pages

without adding a framework build step yet.

## Next integration step

Replace the mock data in `app.js` with real requests to your Cloudflare Worker admin endpoints, then add lightweight authentication for the dashboard.
