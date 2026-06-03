import { useGetSettings } from "@workspace/api-client-react";
import { Link } from "wouter";

export function Footer() {
  const { data: settings } = useGetSettings();
  const siteName = settings?.siteName || "Maître Séraphin";

  return (
    <footer className="border-t border-white/10 bg-background/50 py-16 mt-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-primary mb-6">{siteName}</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Héritier d'une lignée ancestrale, spécialisé dans l'attraction de la richesse, le retour affectif et la protection spirituelle. Discrétion et résultats garantis.
        </p>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {settings?.phone && (
            <div className="text-sm">
              <span className="block text-primary uppercase tracking-widest mb-1 text-xs">Téléphone</span>
              {settings.phone}
            </div>
          )}
          {settings?.address && (
            <div className="text-sm">
              <span className="block text-primary uppercase tracking-widest mb-1 text-xs">Cabinet</span>
              {settings.address}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-muted-foreground uppercase tracking-widest">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
          <Link href="/rituels" className="hover:text-primary transition-colors">Rituels</Link>
          <Link href="/avis" className="hover:text-primary transition-colors">Avis</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
        <p className="text-muted-foreground/30 text-xs mt-10 uppercase tracking-widest">
          © {new Date().getFullYear()} {siteName} — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
