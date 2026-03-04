import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Client Stripe (lazy). Lance une erreur si STRIPE_SECRET_KEY est absent au moment de l'appel. */
export function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY manquant. Ajoutez-le dans .env.local (voir PAIEMENT-STRIPE.md)."
      );
    }
    _stripe = new Stripe(secretKey, { typescript: true });
  }
  return _stripe;
}
