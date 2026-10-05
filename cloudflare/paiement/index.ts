/**
 * Worker Cloudflare « filandflow-paiement » : la partie Stripe du site,
 * hébergée hors de Vercel.
 *
 *   POST /checkout         création de la session Stripe (appelé par le navigateur)
 *   POST /webhooks/stripe  confirmation de paiement envoyée par Stripe
 *   GET  /                 simple vérification que le worker répond
 *
 * La logique métier est celle de lib/payments, partagée avec les routes Next.
 * Les variables d'environnement sont lues via process.env (option
 * nodejs_compat dans wrangler.jsonc), exactement comme sur Vercel.
 */

import { handleCheckout } from "../../lib/payments/checkout";
import { handleStripeWebhook } from "../../lib/payments/webhook";

const DEFAULT_ORIGINS = "https://filandflow.fr,https://www.filandflow.fr";

function allowedOrigin(request: Request): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  const allowed = (process.env.ALLOWED_ORIGINS || DEFAULT_ORIGINS)
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);
  return allowed.includes(origin) ? origin : null;
}

function withCors(response: Response, origin: string | null): Response {
  if (!origin) return response;
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Vary", "Origin");
  return new Response(response.body, { status: response.status, headers });
}

export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);
    const path = pathname.replace(/\/$/, "") || "/";

    if (path === "/checkout") {
      const origin = allowedOrigin(request);
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: origin
            ? {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
                Vary: "Origin",
              }
            : {},
        });
      }
      if (request.method === "POST") {
        return withCors(await handleCheckout(request), origin);
      }
    }

    if (path === "/webhooks/stripe" && request.method === "POST") {
      return handleStripeWebhook(request);
    }

    if (path === "/" && request.method === "GET") {
      return Response.json({ service: "filandflow-paiement", ok: true });
    }

    return Response.json({ error: "Introuvable" }, { status: 404 });
  },
};
