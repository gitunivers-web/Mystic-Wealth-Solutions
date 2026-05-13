import { Link, useLocation } from "wouter";
import { useGetSettings } from "@workspace/api-client-react";

export function Navbar() {
  const [location] = useLocation();
  const { data: settings } = useGetSettings();

  const navItems = [
    { label: "Accueil", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-wider text-primary">
            SÉRAPHIN
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm uppercase tracking-widest font-medium transition-colors hover:text-primary ${
                location === item.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {settings?.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="px-6 py-2 border border-primary/30 text-primary hover:bg-primary/10 transition-colors uppercase tracking-widest text-xs font-semibold"
            >
              {settings.phone}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
