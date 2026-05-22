# Velocity Enterprise - Business NBN Portal

A production-ready Business NBN sign-up portal with Node.js/Express, Stripe Checkout integration, and NBN serviceability checks.

## Deployment

This application is an Express/Node.js app. It is recommended to deploy it to a Node-capable hosting provider.

### Recommended Hosting
- **Render / Railway / Fly.io**: Connect your GitHub repo and use the following settings.
- **VPS (DigitalOcean / Linode)**: Use PM2 to manage the process.
- **Heroku**: Supported via `Procfile`.

### Deployment Settings
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 20+

### Cloudflare Note
The previous Cloudflare Workers deployment failed because this is not a Workers-native app. To use Cloudflare:
- **Static Preview**: You can deploy `src/public` as a Cloudflare Pages static site.
  - **Build Command**: `exit 0`
  - **Output Directory**: `src/public`
  - **Note**: This will ONLY deploy the frontend. APIs, Stripe, and persistence will NOT work.
- **Full Backend**: Requires migrating the app to Cloudflare Pages Functions or Workers.

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Required in Prod |
|----------|-------------|------------------|
| `NODE_ENV` | `production` or `development` | Yes |
| `PUBLIC_BASE_URL` | Full URL of your app (e.g., `https://nbn.example.com`) | Yes |
| `STRIPE_SECRET_KEY` | Your Stripe Secret Key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe Webhook Signing Secret | Yes |
| `DATABASE_URL` | PostgreSQL connection string (fallback to SQLite) | Optional |
| `RAPIDAPI_KEY` | RapidAPI key for NBN serviceability | Yes* |
| `ALLOW_MOCK_SERVICEABILITY` | Set to `true` to allow mock checks in prod | No |

\* Optional in development; required in production unless mock is allowed.

## Pre-launch Checklist

- [ ] Set all production environment variables.
- [ ] Configure Stripe Live keys and Webhook endpoint.
- [ ] Ensure `DATABASE_URL` is set for PostgreSQL if not using persistent SQLite.
- [ ] Verify `plans.json` pricing and features.
- [ ] Add real content to legal pages:
  - `privacy.html`
  - `terms.html`
  - `critical-information-summary.html`
  - `sla.html`
- [ ] Update `sitemap.xml` with the final production domain.
- [ ] Test the full signup flow on mobile and desktop.
- [ ] Verify Webhook handling for successful and failed payments.
- [ ] Disable `ALLOW_MOCK_SERVICEABILITY` in production.

## Local Development

1. `npm install`
2. `cp .env.example .env`
3. `npm run dev`

Visit `http://localhost:3000`.

## Testing
`npm test` - Runs ABN validation and route smoke tests.
