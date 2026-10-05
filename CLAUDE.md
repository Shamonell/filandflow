# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Fil & Flow is the website of a textile/craft artisan in Chabeuil (Drôme): workshops ("ateliers"), a shop of one-off handmade products ("boutique"), and gift cards ("bons cadeaux"). Next.js 14 (App Router) + TypeScript + Tailwind, content in Sanity, payments via Stripe Checkout, emails via Resend. The UI, content, code comments and commit messages are in French; keep it that way.

Production is `https://filandflow.fr`, deployed on Vercel. Every push to `main` deploys to production automatically, and there is no PR or CI step in between.

## Commands

```bash
npm run dev            # Next dev server on :3000. Sanity Studio is embedded at /admin
npm run build          # next build (the only full check: type-check + lint + prerender)
npm run lint           # next lint (next/core-web-vitals)
npm run sanity         # standalone Studio (cd sanity && npm run dev, on :3333)
npm run seed:templates # tsx scripts/seed-workshop-templates.ts
```

There is no test suite. Validate changes with `npm run build`. The build prerenders pages from live Sanity data, so it needs `.env.local` with the Sanity variables.

The one-off maintenance scripts in `scripts/*.mjs` (e.g. `fix-product-slugs.mjs`) run in dry-run mode by default and only write to Sanity with `--write`. They use `SANITY_API_WRITE_TOKEN`.

**Never run `npm run delete:test-content`** (`scripts/delete-test-content.ts`) unless the user explicitly asks. It has no dry-run mode and no confirmation. It immediately deletes **every** published `product` and `event` in the dataset, which is the live content of filandflow.fr, not only test data.

## Architecture

**Content (Sanity).** The schemas are in `sanity/schemas/`: `product`, `event`, `workshopTemplate`, `giftCard`, `homeWorkshop`, `announcement`. There are two Studio configs that share these schemas: the root `sanity.config.ts` is the one used by the embedded Studio at `/admin` (`app/admin/[[...index]]`), and `sanity/sanity.config.ts` is for the standalone Studio. All GROQ queries, TS types and fetch helpers are in `lib/queries.ts`. `lib/sanity.ts` is the read client (CDN outside dev) plus `urlFor`. `lib/sanityAdmin.ts` is the write client, used only server-side by the webhook.

**Pages use ISR.** Pages use `export const revalidate = 30|60` and do not use on-demand revalidation, so edits in Sanity show up after that delay.

**Workshops.** A `workshopTemplate` is a type of workshop (couture, broderie, tissage…) and an `event` is a dated session that references a template. Each template has a hand-written route in `app/atelier/<type>/page.tsx`, and all of these routes render the shared `components/atelier/WorkshopTypePage.tsx`. Individual sessions are served by `app/atelier/[slug]`, and the month views by `app/ateliers/[month]`. All date logic must go through `lib/eventParis.ts` (Europe/Paris via date-fns-tz), because the server runs in UTC. `GUIDE-ATELIERS-SANITY.md` explains the editor workflow.

**Checkout flow.**
1. `components/checkout/*` modals make the customer pick a payment mode and a delivery mode, then POST `{type: "product"|"gift", slug|giftId, deliveryMode}` to `app/api/checkout/route.ts`.
2. The route re-fetches the price and availability from Sanity, so it never trusts the client. It validates the delivery mode and builds a Stripe Checkout session. Prices are stored in euros and sent to Stripe as `× 100` (cents). Products offer `retrait` (pickup, requires a phone custom field) and `colissimo` (collects the shipping address). Gift cards offer `email`, `retrait` (also requires the phone field) and `courrier` (paper card by post, which also collects the address).
3. `app/api/webhooks/stripe/route.ts` handles `checkout.session.completed`. It sets the product to `vendu` with `setProductStatusBySlug`, which patches both the published doc and any draft. It then emails the seller (`ORDER_EMAIL`, falling back to `CONTACT_EMAIL`) and the customer through Resend.

`lib/deliveryOptions.ts` is the single source of truth for delivery modes and their prices. It is used by the modal, the checkout route and the webhook's email wording. `STRIPE-CONFIG.md` documents the env vars and webhook setup.

**Gift cards** load from Sanity and fall back to the hardcoded offers in `lib/gift-cards.ts` when Sanity is empty or errors.

**Contact.** `app/api/contact/route.ts` sends the email through Resend and has anti-bot checks (a honeypot, a minimum fill time, and a limit on the number of links). Contact details, the workshop address and the WhatsApp/mailto helpers are in `lib/contact.ts`.

**SEO.** `app/sitemap.ts`, `app/robots.ts` and `components/seo/LocalBusinessSchema.tsx` (JSON-LD).

## Gotchas

- **Slugs.** Sanity only slugifies when an editor clicks "Generate"; a slug typed or pasted by hand is stored as-is. Hand-typed product slugs containing spaces and quotes once made every product page return 404 in production. `sanity/schemas/slugify.ts` provides the shared `slugify` and a Studio warning for such slugs. Use it in every new schema that has a slug field.
- Product statuses are `disponible | réservé | vendu | en demande`. Only `disponible` can be bought.
- Environment variables used: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_WRITE_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `ORDER_EMAIL`, `CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, and `NEXT_PUBLIC_SITE_URL` (Stripe redirect URLs; falls back to `VERCEL_URL`). The Stripe and Sanity write clients are created lazily, so a missing key only fails at call time, not at build time.
- Path alias: `@/*` points to the repo root.
- `out.zip` and `dist/` at the root are old build leftovers committed by mistake. They are not part of the app.
