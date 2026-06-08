import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { setProductStatusBySlug } from "@/lib/sanityAdmin";
import { getDeliveryShortLabel, type DeliveryMode } from "@/lib/deliveryOptions";

/** Corps brut requis pour la vérification de signature Stripe */
export const runtime = "nodejs";

const SENDER_FROM = "Fil & Flow <onboarding@resend.dev>";

function formatAddress(session: Stripe.Checkout.Session): string {
  const details = (
    session as {
      shipping_details?: {
        address?: {
          line1?: string;
          line2?: string;
          postal_code?: string;
          city?: string;
          state?: string;
          country?: string;
        };
      };
    }
  ).shipping_details;
  if (!details?.address) return "Non fournie";
  const a = details.address;
  const parts = [a.line1, a.line2, a.postal_code, a.city, a.state, a.country]
    .filter(Boolean);
  return parts.join(", ") || "Non fournie";
}

function getCustomFieldValue(
  session: Stripe.Checkout.Session,
  key: string
): string | null {
  const fields = (
    session as {
      custom_fields?: Array<{ key: string; text?: { value?: string | null } }>;
    }
  ).custom_fields;
  if (!Array.isArray(fields)) return null;
  const field = fields.find((f) => f.key === key);
  return field?.text?.value ?? null;
}

// ─────────────────────────────────────────────────────────────
// EMAILS PRODUITS
// ─────────────────────────────────────────────────────────────

async function sendProductOrderEmailToSeller(params: {
  productName: string;
  amount: number;
  shippingAmount: number;
  customerEmail: string;
  customerName: string | null;
  deliveryMode: DeliveryMode | string;
  address: string;
  phone: string | null;
}) {
  const {
    productName,
    amount,
    shippingAmount,
    customerEmail,
    customerName,
    deliveryMode,
    address,
    phone,
  } = params;
  const resendKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.ORDER_EMAIL || process.env.CONTACT_EMAIL;

  if (!resendKey || !recipientEmail) {
    console.warn(
      "ORDER_EMAIL/CONTACT_EMAIL ou RESEND_API_KEY manquant - email vendeur non envoyé"
    );
    return;
  }

  // Bloc instructions à faire selon le mode
  let actionBlock = "";
  if (deliveryMode === "retrait") {
    actionBlock = `
      <div style="background:#EEF4EE;border-left:4px solid #6F8F72;padding:12px 16px;margin-top:16px">
        <p style="margin:0 0 6px"><strong>À faire :</strong> appeler le client pour fixer un créneau de retrait à l'atelier.</p>
        <p style="margin:0"><strong>Téléphone :</strong> ${phone ?? "Non fourni"}</p>
      </div>`;
  } else if (deliveryMode === "colissimo") {
    actionBlock = `
      <div style="background:#EEF4EE;border-left:4px solid #6F8F72;padding:12px 16px;margin-top:16px">
        <p style="margin:0 0 6px"><strong>À faire :</strong> expédier la commande par Colissimo (suivi inclus).</p>
        <p style="margin:0 0 4px"><strong>Adresse de livraison :</strong></p>
        <p style="margin:0">${address}</p>
      </div>`;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: SENDER_FROM,
      to: recipientEmail,
      subject: `Nouvelle vente - ${productName}`,
      html: `
        <h2>Nouvelle vente enregistrée</h2>
        <p><strong>Produit :</strong> ${productName}</p>
        <p><strong>Mode de livraison :</strong> ${getDeliveryShortLabel(deliveryMode)}</p>
        <p><strong>Sous-total :</strong> ${((amount - shippingAmount) / 100).toFixed(2)} €</p>
        <p><strong>Frais de port :</strong> ${(shippingAmount / 100).toFixed(2)} €</p>
        <p><strong>Total encaissé :</strong> ${(amount / 100).toFixed(2)} €</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0" />
        <p><strong>Client :</strong> ${customerName || customerEmail}</p>
        <p><strong>Email :</strong> ${customerEmail}</p>
        ${actionBlock}
      `,
    });
  } catch (err) {
    console.error("Erreur envoi email commande:", err);
  }
}

async function sendProductConfirmationEmailToCustomer(params: {
  customerEmail: string;
  productName: string;
  amount: number;
  deliveryMode: DeliveryMode | string;
}) {
  const { customerEmail, productName, amount, deliveryMode } = params;
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || !customerEmail || customerEmail === "Non fourni") return;

  let nextSteps = "<p>Votre commande sera traitée dans les meilleurs délais.</p>";
  if (deliveryMode === "retrait") {
    nextSteps = `
      <p>Vous avez choisi le <strong>retrait à l'atelier de Chabeuil</strong>.</p>
      <p>Elisabeth vous contactera par téléphone pour convenir d'un créneau de retrait.</p>`;
  } else if (deliveryMode === "colissimo") {
    nextSteps = `
      <p>Votre commande sera expédiée par <strong>Colissimo</strong> avec suivi sous quelques jours.</p>
      <p>Vous recevrez votre numéro de suivi par email dès l'envoi.</p>`;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: SENDER_FROM,
      to: customerEmail,
      subject: `Confirmation de votre achat - ${productName}`,
      html: `
        <h2>Merci pour votre achat !</h2>
        <p>Bonjour,</p>
        <p>Nous avons bien reçu votre paiement pour <strong>${productName}</strong>.</p>
        <p><strong>Montant total :</strong> ${(amount / 100).toFixed(2)} €</p>
        ${nextSteps}
        <p>Pour toute question, n'hésitez pas à nous contacter.</p>
        <p>À bientôt,<br>Elisabeth — Fil & Flow</p>
      `,
    });
  } catch (err) {
    console.error("Erreur envoi email confirmation client:", err);
  }
}

// ─────────────────────────────────────────────────────────────
// EMAILS BONS CADEAUX
// ─────────────────────────────────────────────────────────────

async function sendGiftOrderEmailToSeller(params: {
  giftTitle: string;
  amount: number;
  shippingAmount: number;
  customerEmail: string;
  customerName: string | null;
  deliveryMode: DeliveryMode | string;
  address: string;
  phone: string | null;
}) {
  const {
    giftTitle,
    amount,
    shippingAmount,
    customerEmail,
    customerName,
    deliveryMode,
    address,
    phone,
  } = params;
  const resendKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.ORDER_EMAIL || process.env.CONTACT_EMAIL;

  if (!resendKey || !recipientEmail) {
    console.warn(
      "ORDER_EMAIL/CONTACT_EMAIL ou RESEND_API_KEY manquant - email bon cadeau (vendeur) non envoyé"
    );
    return;
  }

  let actionBlock = "";
  if (deliveryMode === "email") {
    actionBlock = `
      <div style="background:#EEF4EE;border-left:4px solid #6F8F72;padding:12px 16px;margin-top:16px">
        <p style="margin:0 0 6px"><strong>À faire :</strong> envoyer le PDF du bon cadeau au client par email.</p>
        <p style="margin:0"><strong>Email destinataire :</strong> ${customerEmail}</p>
      </div>`;
  } else if (deliveryMode === "retrait") {
    actionBlock = `
      <div style="background:#EEF4EE;border-left:4px solid #6F8F72;padding:12px 16px;margin-top:16px">
        <p style="margin:0 0 6px"><strong>À faire :</strong> préparer le bon cadeau et appeler le client pour le retrait à l'atelier.</p>
        <p style="margin:0"><strong>Téléphone :</strong> ${phone ?? "Non fourni"}</p>
      </div>`;
  } else if (deliveryMode === "courrier") {
    actionBlock = `
      <div style="background:#EEF4EE;border-left:4px solid #6F8F72;padding:12px 16px;margin-top:16px">
        <p style="margin:0 0 6px"><strong>À faire :</strong> envoyer la carte cadeau papier par courrier.</p>
        <p style="margin:0 0 4px"><strong>Adresse postale :</strong></p>
        <p style="margin:0">${address}</p>
      </div>`;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: SENDER_FROM,
      to: recipientEmail,
      subject: `Nouveau bon cadeau vendu - ${giftTitle}`,
      html: `
        <h2>Nouveau bon cadeau vendu</h2>
        <p><strong>Offre :</strong> ${giftTitle}</p>
        <p><strong>Mode de réception :</strong> ${getDeliveryShortLabel(deliveryMode)}</p>
        <p><strong>Sous-total :</strong> ${((amount - shippingAmount) / 100).toFixed(2)} €</p>
        <p><strong>Frais d'envoi :</strong> ${(shippingAmount / 100).toFixed(2)} €</p>
        <p><strong>Total encaissé :</strong> ${(amount / 100).toFixed(2)} €</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0" />
        <p><strong>Client :</strong> ${customerName || customerEmail}</p>
        <p><strong>Email :</strong> ${customerEmail}</p>
        ${actionBlock}
      `,
    });
  } catch (err) {
    console.error("Erreur envoi email bon cadeau (vendeur):", err);
  }
}

async function sendGiftConfirmationEmailToCustomer(params: {
  customerEmail: string;
  giftTitle: string;
  amount: number;
  deliveryMode: DeliveryMode | string;
}) {
  const { customerEmail, giftTitle, amount, deliveryMode } = params;
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || !customerEmail || customerEmail === "Non fourni") return;

  let nextSteps = "<p>Votre bon cadeau vous sera envoyé dans les meilleurs délais.</p>";
  if (deliveryMode === "email") {
    nextSteps = `
      <p>Vous avez choisi de recevoir votre bon cadeau <strong>par email</strong>.</p>
      <p>Le PDF vous sera envoyé sous 24 à 48 heures à cette adresse.</p>`;
  } else if (deliveryMode === "retrait") {
    nextSteps = `
      <p>Vous avez choisi le <strong>retrait à l'atelier de Chabeuil</strong>.</p>
      <p>Elisabeth vous contactera par téléphone pour convenir d'un créneau.</p>`;
  } else if (deliveryMode === "courrier") {
    nextSteps = `
      <p>Vous avez choisi de recevoir votre bon cadeau <strong>par courrier postal</strong>.</p>
      <p>La carte papier vous sera envoyée à l'adresse indiquée sous quelques jours.</p>`;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: SENDER_FROM,
      to: customerEmail,
      subject: `Confirmation de votre bon cadeau - ${giftTitle}`,
      html: `
        <h2>Merci pour votre achat !</h2>
        <p>Bonjour,</p>
        <p>Nous avons bien reçu votre paiement pour <strong>${giftTitle}</strong>.</p>
        <p><strong>Montant total :</strong> ${(amount / 100).toFixed(2)} €</p>
        ${nextSteps}
        <p>Pour toute question, n'hésitez pas à nous contacter.</p>
        <p>À bientôt,<br>Elisabeth — Fil & Flow</p>
      `,
    });
  } catch (err) {
    console.error("Erreur envoi email confirmation bon cadeau (client):", err);
  }
}

// ─────────────────────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;
  if (!metadata) return;

  const amount = session.amount_total ?? 0;
  const shippingAmount = session.shipping_cost?.amount_total ?? 0;
  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? "Non fourni";
  const customerName = session.customer_details?.name ?? null;
  const deliveryMode = (metadata.deliveryMode ?? "") as DeliveryMode | string;

  if (metadata.type === "product" && metadata.productSlug) {
    try {
      const result = await setProductStatusBySlug(
        metadata.productSlug,
        "vendu"
      );
      console.log(
        `Statut "vendu" appliqué à ${result.patched} version(s) du produit "${metadata.productSlug}" (ids: ${result.ids.join(", ")})`
      );
    } catch (err) {
      console.error("Erreur mise à jour Sanity:", err);
    }

    const address = formatAddress(session);
    const phone = getCustomFieldValue(session, "phone");
    const productName =
      metadata.productTitle || metadata.productSlug || "Produit";

    await sendProductOrderEmailToSeller({
      productName,
      amount,
      shippingAmount,
      customerEmail,
      customerName,
      deliveryMode,
      address,
      phone,
    });

    await sendProductConfirmationEmailToCustomer({
      customerEmail,
      productName,
      amount,
      deliveryMode,
    });
    return;
  }

  if (metadata.type === "gift" && metadata.giftId) {
    const giftTitle = metadata.giftTitle || metadata.giftId;
    const address = formatAddress(session);
    const phone = getCustomFieldValue(session, "phone");

    await sendGiftOrderEmailToSeller({
      giftTitle,
      amount,
      shippingAmount,
      customerEmail,
      customerName,
      deliveryMode,
      address,
      phone,
    });

    await sendGiftConfirmationEmailToCustomer({
      customerEmail,
      giftTitle,
      amount,
      deliveryMode,
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
