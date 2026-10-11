import { handleStripeWebhook } from "@/lib/payments/webhook";

// La logique est partagée avec le worker Cloudflare (cloudflare/paiement).
export const runtime = "nodejs";
export const POST = handleStripeWebhook;
