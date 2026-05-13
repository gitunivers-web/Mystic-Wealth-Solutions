import { useGetSettings } from "@workspace/api-client-react";
import { Link } from "wouter";

export function Footer() {
  const { data: settings } = useGetSettings();

  return (
    <footer className="border-t border-white/10 bg-background/50 py-16 mt-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-primary mb-6">Maître Séraphin</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Héritier d'une lignée ancestrale, spécialisé dans l'attraction de la richesse, le retour affectif et la protection spirituelle. Discrétion et résultats garantis.
        </p>
        <div className="flex justify-center gap-8 mb-12">
          {settings?.phone && (
            <div className="text-sm">
              <span className="block text-primary uppercase tracking-widest mb-1 text-xs">Téléphone</span>
              {settings.phone}
            </div>
          )}
          {settings?.email && (
            <div className="text-sm">
              <span className="block text-primary uppercase tracking-widest mb-1 text-xs">Email</span>
              {settings.email}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground uppercase tracking-widest">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
