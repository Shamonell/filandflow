import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProductBySlug } from "@/lib/queries";
import { getGiftCardById } from "@/lib/gift-cards";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, slug, giftId } = body;

    const baseUrl = getBaseUrl();
    const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = baseUrl + (type === "gift" ? "/bons-cadeaux" : "/boutique");

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

      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
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
                images: [], // optionnel : ajouter image URL si besoin
              },
              unit_amount: Math.round(product.price * 100),
            },
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        shipping_address_collection: {
          allowed_countries: ["FR"],
        },
        metadata: {
          type: "product",
          productSlug: product.slug.current,
          productId: product._id,
          productTitle: product.title,
        },
      });

      if (!session.url) {
        return NextResponse.json(
          { error: "Impossible de créer la session de paiement" },
          { status: 500 }
        );
      }
      return NextResponse.json({ url: session.url });
    }

    if (type === "gift" && giftId) {
      const gift = getGiftCardById(giftId);
      if (!gift) {
        return NextResponse.json(
          { error: "Bon cadeau introuvable" },
          { status: 404 }
        );
      }

      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "eur",
              product_data: {
                name: gift.name,
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
        },
      });

      if (!session.url) {
        return NextResponse.json(
          { error: "Impossible de créer la session de paiement" },
          { status: 500 }
        );
      }
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json(
      { error: "Paramètres invalides (type + slug ou type + giftId requis)" },
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
