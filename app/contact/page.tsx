"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });

  // Pré-remplir le message si un paramètre est présent dans l'URL
  useEffect(() => {
    const messageParam = searchParams.get("message");
    if (messageParam) {
      setFormData((prev) => ({
        ...prev,
        message: decodeURIComponent(messageParam),
      }));
    }
  }, [searchParams]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setSubmitStatus("success");
      setFormData({ email: "", message: "" }); // Réinitialiser le formulaire
    } catch (error) {
      console.error("Erreur:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FBF8F3]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl">
              Prenons contact
        </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-[#5F6C72] md:text-2xl">
              Une question ? Une envie de créer ensemble ? 
              <br />
              Je serais ravie d&apos;échanger avec vous.
            </p>
          </div>
        </div>
      </section>

      {/* Section Formulaire avec photo */}
      <section className="bg-[#EEF4EE] py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
              {/* Photo d'Elisabeth */}
              <div className="flex-shrink-0 lg:w-1/3">
                <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-lg md:h-80 lg:h-96">
                  <img
                    src="/photo elizabethe.PNG"
                    alt="Elisabeth - Fil & Flow"
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6F8F72]/10 to-transparent" />
                </div>
                <div className="mt-6 text-center lg:text-left">
                  <h3 className="mb-2 text-2xl font-light text-[#5C3A21]">
                    Elisabeth
                  </h3>
                  <p className="text-[#5F6C72]">
                    Créatrice et animatrice d&apos;ateliers
                  </p>
                </div>
              </div>

              {/* Formulaire */}
              <div className="flex-1 lg:w-2/3">
                <div className="rounded-2xl bg-white p-8 shadow-lg md:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
                        className="mb-2 block text-base font-medium text-[#5C3A21]"
            >
                        Votre e-mail *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
                        className="w-full rounded-lg border-2 border-[#EEF4EE] bg-[#FBF8F3] px-4 py-3 text-[#1F2933] transition-colors focus:border-[#6F8F72] focus:outline-none focus:ring-2 focus:ring-[#6F8F72]/20"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
                        className="mb-2 block text-base font-medium text-[#5C3A21]"
            >
                        Votre message *
            </label>
            <textarea
              id="message"
              required
                        rows={8}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
                        className="w-full rounded-lg border-2 border-[#EEF4EE] bg-[#FBF8F3] px-4 py-3 text-[#1F2933] transition-colors focus:border-[#6F8F72] focus:outline-none focus:ring-2 focus:ring-[#6F8F72]/20"
                        placeholder="Parlez-moi de votre projet, de vos envies créatives..."
            />
          </div>

          {submitStatus === "success" && (
                      <div className="rounded-lg bg-[#EEF4EE] border-2 border-[#6F8F72] p-4 text-[#5C3A21]">
                        <p className="font-medium">Message envoyé avec succès</p>
                        <p className="mt-1 text-sm text-[#5F6C72]">
                          Je vous répondrai dans les plus brefs délais.
                        </p>
            </div>
          )}

          {submitStatus === "error" && (
                      <div className="rounded-lg bg-amber-50 border-2 border-amber-200 p-4 text-amber-800">
                        <p className="font-medium">Une erreur est survenue</p>
                        <p className="mt-1 text-sm">
                          Impossible d&apos;envoyer votre message. Veuillez réessayer ou utiliser les autres moyens de contact indiqués ci-dessous.
                        </p>
            </div>
          )}

                    <Button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full bg-[#6F8F72] hover:bg-[#5A726D] text-white py-4 text-lg font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Envoi en cours...
                        </span>
                      ) : (
                        "Envoyer mon message"
                      )}
          </Button>
        </form>
      </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Informations supplémentaires */}
      <section className="bg-[#FBF8F3] py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-light text-[#5C3A21] md:text-4xl">
              Autres façons de me joindre
            </h2>
            <p className="text-lg leading-relaxed text-[#5F6C72]">
              Vous préférez échanger autrement ? N&apos;hésitez pas à me suivre 
              sur les réseaux sociaux ou à me laisser un message vocal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Composant de chargement pour Suspense
function ContactFormLoading() {
  return (
    <div className="bg-[#FBF8F3] min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-[#5F6C72]">Chargement...</div>
    </div>
  );
}

// Export principal avec Suspense pour useSearchParams
export default function ContactPage() {
  return (
    <Suspense fallback={<ContactFormLoading />}>
      <ContactForm />
    </Suspense>
  );
}