import { NextRequest, NextResponse } from "next/server";

// Fonction pour nettoyer les entrées utilisateur (protection XSS)
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

// Simple rate limiting en mémoire (pour production, utiliser Redis)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requêtes par minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez réessayer dans une minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const email = sanitizeInput(body.email || "");
    const message = sanitizeInput(body.message || "");

    // Validation
    if (!email || !message) {
      return NextResponse.json(
        { error: "Email et message sont requis" },
        { status: 400 }
      );
    }

    // Vérifier la longueur du message (protection contre les abus)
    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Le message est trop long (max 5000 caractères)" },
        { status: 400 }
      );
    }

    // Vérifier le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Si Resend est configuré, utiliser Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_EMAIL || "contact@example.com";

    if (resendApiKey) {
      try {
        // Utiliser Resend pour envoyer l'email
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);

        const { data, error } = await resend.emails.send({
          from: "Fil & Flow <onboarding@resend.dev>", // Remplacez par votre domaine vérifié
          to: recipientEmail,
          subject: `Nouveau message de contact - ${email}`,
          html: `
            <h2>Nouveau message de contact</h2>
            <p><strong>De :</strong> ${email}</p>
            <p><strong>Message :</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
          reply_to: email,
        });

        if (error) {
          console.error("Erreur Resend:", error);
          return NextResponse.json(
            { error: "Erreur lors de l'envoi de l'email" },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { success: true, message: "Email envoyé avec succès" },
          { status: 200 }
        );
      } catch (resendError) {
        console.error("Erreur lors de l'import de Resend:", resendError);
        // Fallback vers le mode développement
      }
    }

    // Mode développement : simuler l'envoi
    // En production, vous devriez configurer RESEND_API_KEY
    const isDevelopment = process.env.NODE_ENV === "development";
    
    console.log("=== NOUVEAU MESSAGE DE CONTACT ===");
    console.log("De:", email);
    console.log("Message:", message);
    console.log("===================================");

    return NextResponse.json(
      {
        success: true,
        message: isDevelopment
          ? "Message reçu (mode développement - email non envoyé)"
          : "Message reçu. Nous vous répondrons dans les plus brefs délais.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors du traitement de la demande" },
      { status: 500 }
    );
  }
}

