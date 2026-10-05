/**
 * URL de création du paiement, côté navigateur.
 *
 * Si NEXT_PUBLIC_PAYMENT_API_URL est défini (ex. l'adresse du worker
 * Cloudflare), le paiement passe par lui. Sinon, repli sur la route Next
 * /api/checkout du site.
 */
export function checkoutEndpoint(): string {
  const base = process.env.NEXT_PUBLIC_PAYMENT_API_URL?.replace(/\/$/, "");
  return base ? `${base}/checkout` : "/api/checkout";
}
