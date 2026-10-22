# Temporary maintenance site

The public entry points are `/`, `/las-cruces/shop`, and `/alamogordo/shop`.
`src/middleware.js` rewrites those requests to the standalone files in
`public/maintenance/`. Everything else redirects to `/`, except explicitly
allowed supporting assets, robots/sitemap files, and blocked APIs/framework
assets (404). Dutchie query strings are preserved. Existing page sources are
retained for restoration but cannot be reached through this deployment.

The age gate uses the existing 30-day `ageVerified=true` cookie. Its cloud
background remains in place while the gate fades out. Ordering scripts load
only after verification. Both store IDs come from the original shop pages.
The maintenance wrapper has no old-site navigation. Store hours are read server-side from the two Google Business Profiles.
Regular and special hours refresh on demand every five minutes per server
instance. Open tabs refresh every minute; status uses America/Denver time.
Google failures show call-to-confirm instead of stale open/closed claims.

## Validate and publish

- `pnpm install --frozen-lockfile`
- `pnpm build`
- `pnpm start --port 3107`
- In another terminal: `node tests/maintenance-routes.mjs`
- Preview `/` and both ordering routes, then deploy through the existing host.
- Repeat route checks with `TEST_BASE_URL=https://www.effyexotics.com` after
  deployment (the test reads the local build ID for a legacy-data check).
- Purge any hosting/CDN HTML cache if the host retains old responses.

This change does not deploy or push automatically. Existing build warnings
about Next configuration, Sass imports, and the `_app.js` effect predate it.
The live Dutchie inventory/checkout depends on Dutchie and the store accounts.

To restore the original website, revert the maintenance integration, including
middleware and sitemap configuration. The former root middleware was not
loaded by this `src/pages` project; review routing in `src/middleware.js` when
restoring rather than assuming root-level middleware will execute.

## Google hours configuration

The existing OAuth connection has been verified against both stores. Set these
server-only environment variables on the production hosting project, using the
values in the ignored local `.env.local` (never commit it or paste secrets into
public assets):

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REFRESH_TOKEN
- GOOGLE_LAS_CRUCES_LOCATION_ID
- GOOGLE_ALAMOGORDO_LOCATION_ID

No API key or browser-side credentials are required. The refresh token renews
access automatically; revoked or expired authorization requires reconnecting
Google. Deploy after setting the variables. Visit `/api/store-hours` to confirm
both locations return actual hours, then inspect the maintenance page.
This endpoint returns only public hours and status, never tokens or Google
account configuration. The API accepts GET only and queries only the two
configured stores. All other old APIs remain blocked.

Run `node tests/store-hours.mjs` for regular, holiday, overnight, 24-hour,
closure and daylight-saving checks. Google schedule changes do not require
a deployment and appear within approximately six minutes while the page is
active, once available through Google's API.
