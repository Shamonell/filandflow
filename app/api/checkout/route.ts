import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getProductBySlug, getGiftCardByShopId } from "@/lib/queries";
import {
  PRODUCT_DELIVERY_OPTIONS,
  GIFT_DELIVERY_OPTIONS,
  getDeliveryOption,
  type DeliveryMode,
} from "@/lib/deliveryOptions";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/** Convertit un montant en euros en options de livraison Stripe (centimes). */
function buildShippingRate(
  label: string,
  priceEuros: number
): Stripe.Checkout.SessionCreateParams.ShippingOption {
  return {
    shipping_rate_data: {
      type: "fixed_amount",
      display_name: label,
      fixed_amount: {
        amount: Math.round(priceEuros * 100),
        currency: "eur",
      },
    },
  };
}

/** Custom field téléphone obligatoire pour les retraits à l'atelier. */
function buildPhoneField(): Stripe.Checkout.SessionCreateParams.CustomField {
  return {
    key: "phone",
    label: {
      type: "custom",
      custom: "Numéro de téléphone (pour vous prévenir quand c'est prêt)",
    },
    type: "text",
    text: {
      minimum_length: 8,
      maximum_length: 20,
    },
    optional: false,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, slug, giftId, deliveryMode } = body as {
      type?: "product" | "gift";
      slug?: string;
      giftId?: string;
      deliveryMode?: DeliveryMode;
    };

    const baseUrl = getBaseUrl();
    const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = baseUrl + (type === "gift" ? "/bons-cadeaux" : "/boutique");

    // ─────────────────────────────────────────────
    // PRODUITS BOUTIQUE
    // ─────────────────────────────────────────────
    if (type === "product" && slug) {
      const product = await getProductBySlug(slug);
      if (!product) {
        return NextResponse.json(
          { error: "Produit introuvable" },
          { status: 404 }
        );
      }
      if (product.status !== "disponible") {
        return NextResponse.json(
          { error: "Ce produit n'est plus disponible à la vente" },
          { status: 400 }
        );
      }

      // Validation du mode de livraison côté serveur (jamais faire confiance au front).
      const deliveryOption = deliveryMode
        ? getDeliveryOption(PRODUCT_DELIVERY_OPTIONS, deliveryMode)
        : null;
      if (
        !deliveryOption ||
        deliveryOption.disabled ||
        !["retrait", "colissimo"].includes(deliveryMode!)
      ) {
        return NextResponse.json(
          { error: "Mode de livraison invalide" },
          { status: 400 }
        );
      }

      const stripe = getStripe();
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "eur",
              product_data: {
                name: product.title,
                description:
                  typeof product.description === "string"
                    ? product.description.slice(0, 500)
                    : undefined,
              },
              unit_amount: Math.round(product.price * 100),
            },
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          type: "product",
          productSlug: product.slug.current,
          productId: product._id,
          productTitle: product.title,
          deliveryMode: String(deliveryMode),
        },
      };

      if (deliveryMode === "colissimo") {
        // Envoi domicile : adresse collectée + shipping rate Colissimo
        sessionParams.shipping_address_collection = {
          allowed_countries: ["FR"],
        };
        sessionParams.shipping_options = [
          buildShippingRate("Colissimo domicile", deliveryOption.price),
        ];
      } else {
        // Retrait Chabeuil : pas d'adresse, mais téléphone obligatoire
        sessionParams.custom_fields = [buildPhoneField()];
      }

      const session = await stripe.checkout.sessions.create(sessionParams);
      if (!session.url) {
        return NextResponse.json(
          { error: "Impossible de créer la session de paiement" },
          { status: 500 }
        );
      }
      return NextResponse.json({ url: session.url });
    }

    // ─────────────────────────────────────────────
    // BONS CADEAUX
    // ─────────────────────────────────────────────
    if (type === "gift" && giftId) {
      const gift = await getGiftCardByShopId(giftId);
      if (!gift) {
        return NextResponse.json(
          { error: "Bon cadeau introuvable" },
          { status: 404 }
        );
      }

      const deliveryOption = deliveryMode
        ? getDeliveryOption(GIFT_DELIVERY_OPTIONS, deliveryMode)
        : null;
      if (
        !deliveryOption ||
        deliveryOption.disabled ||
        !["email", "retrait", "courrier"].includes(deliveryMode!)
      ) {
        return NextResponse.json(
          { error: "Mode de réception invalide" },
          { status: 400 }
        );
      }

      const stripe = getStripe();
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "eur",
              product_data: {
                name: gift.title,
                description: "Bon cadeau Fil & Flow - Valable 1 an",
              },
              unit_amount: Math.round(gift.price * 100),
            },
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          type: "gift",
          giftId: gift.id,
          giftTitle: gift.title,
          deliveryMode: String(deliveryMode),
        },
      };

      if (deliveryMode === "courrier") {
        sessionParams.shipping_address_collection = {
          allowed_countries: ["FR"],
        };
        sessionParams.shipping_options = [
          buildShippingRate(
            "Envoi par courrier (carte papier)",
            deliveryOption.price
          ),
        ];
      } else if (deliveryMode === "retrait") {
        sessionParams.custom_fields = [buildPhoneField()];
      }
      // email : rien de spécial, juste l'email obligatoire collecté par défaut

      const session = await stripe.checkout.sessions.create(sessionParams);
      if (!session.url) {
        return NextResponse.json(
          { error: "Impossible de créer la session de paiement" },
          { status: 500 }
        );
      }
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json(
      {
        error:
          "Paramètres invalides (type + slug/giftId + deliveryMode requis)",
      },
      { status: 400 }
    );
  } catch (err) {
    if (err instanceof Error && err.message.includes("STRIPE_SECRET_KEY")) {
      return NextResponse.json(
        { error: "Paiement non configuré. Contactez le responsable du site." },
        { status: 503 }
      );
    }
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
