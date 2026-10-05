import { handleCheckout } from "@/lib/payments/checkout";

// La logique est partagée avec le worker Cloudflare (cloudflare/paiement).
export const POST = handleCheckout;
