import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { setProductStatus } from "@/lib/sanityAdmin";

/** Corps brut requis pour la vérification de signature Stripe */
export const runtime = "nodejs";

function formatAddress(session: Stripe.Checkout.Session): string {
  const details = (session as { shipping_details?: { address?: { line1?: string; line2?: string; postal_code?: string; city?: string; state?: string; country?: string } } }).shipping_details;
  if (!details?.address) return "Non fournie";
  const a = details.address;
  const parts = [a.line1, a.line2, a.postal_code, a.city, a.state, a.country].filter(Boolean);
  return parts.join(", ") || "Non fournie";
}

async function sendOrderEmailToSeller(params: {
  productName: string;
  amount: number;
  customerEmail: string;
  customerName: string | null;
  address: string;
}) {
  const { productName, amount, customerEmail, customerName, address } = params;
  const resendKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.ORDER_EMAIL || process.env.CONTACT_EMAIL;

  if (!resendKey || !recipientEmail) {
    console.warn("ORDER_EMAIL/CONTACT_EMAIL ou RESEND_API_KEY manquant - email non envoyé");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: "Fil & Flow <onboarding@resend.dev>",
      to: recipientEmail,
      subject: `Nouvelle vente Stripe - ${productName}`,
      html: `
        <h2>Nouvelle vente enregistrée</h2>
        <p><strong>Produit :</strong> ${productName}</p>
        <p><strong>Montant :</strong> ${(amount / 100).toFixed(2)} €</p>
        <p><strong>Client :</strong> ${customerName || customerEmail}</p>
        <p><strong>Email :</strong> ${customerEmail}</p>
        <p><strong>Adresse de livraison :</strong></p>
        <p>${address}</p>
      `,
    });
  } catch (err) {
    console.error("Erreur envoi email commande:", err);
  }
}

async function sendConfirmationEmailToCustomer(params: {
  customerEmail: string;
  productName: string;
  amount: number;
}) {
  const { customerEmail, productName, amount } = params;
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey || !customerEmail || customerEmail === "Non fourni") {
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: "Fil & Flow <onboarding@resend.dev>",
      to: customerEmail,
      subject: `Confirmation de votre achat - ${productName}`,
      html: `
        <h2>Merci pour votre achat !</h2>
        <p>Bonjour,</p>
        <p>Nous avons bien reçu votre paiement pour <strong>${productName}</strong>.</p>
        <p><strong>Montant :</strong> ${(amount / 100).toFixed(2)} €</p>
        <p>Votre commande sera expédiée dans les meilleurs délais.</p>
        <p>Pour toute question, n'hésitez pas à nous contacter.</p>
        <p>À bientôt,<br>L'équipe Fil & Flow</p>
      `,
    });
  } catch (err) {
    console.error("Erreur envoi email confirmation client:", err);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;
  if (!metadata) return;

  if (metadata.type === "product" && metadata.productId) {
    try {
      await setProductStatus(metadata.productId, "vendu");
    } catch (err) {
      console.error("Erreur mise à jour Sanity:", err);
    }

    const amount = session.amount_total ?? 0;
    const customerEmail = session.customer_details?.email ?? session.customer_email ?? "Non fourni";
    const customerName = session.customer_details?.name ?? null;
    const address = formatAddress(session);

    const productName = metadata.productTitle || metadata.productSlug || "Produit";

    await sendOrderEmailToSeller({
      productName,
      amount,
      customerEmail,
      customerName,
      address,
    });

    await sendConfirmationEmailToCustomer({
      customerEmail,
      productName,
      amount,
    });
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET manquant");
    return NextResponse.json(
      { error: "Webhook non configuré" },
      { status: 500 }
    );
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ error: "Body invalide" }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Erreur vérification Stripe:", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      await handleCheckoutCompleted(session);
    }
  }

  return NextResponse.json({ received: true });
}
