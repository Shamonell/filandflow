export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout spécifique pour /admin : pas de Header ni Footer
  // Le ConditionalLayout dans le layout racine gère déjà l'exclusion
  return <>{children}</>;
}


