import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-primary mb-4 opacity-80">404</h1>
        <h2 className="text-2xl font-serif font-bold text-white mb-6">Un Chemin Perdu</h2>
        <p className="text-muted-foreground mb-8">
          La page que vous cherchez n'existe pas dans ce monde. Les esprits ne trouvent pas cette trace.
        </p>
        <Link href="/" className="px-8 py-3 bg-primary text-background font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors inline-block">
          Retour au Sanctuaire
        </Link>
      </div>
    </div>
  );
}
