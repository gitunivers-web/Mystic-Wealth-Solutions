import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetSettings } from "@workspace/api-client-react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { data: settings } = useGetSettings();
  const siteName = settings?.siteName || "Maître Séraphin";

  const navItems = [
    { label: "Accueil", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Rituels", path: "/rituels" },
    { label: "Avis", path: "/avis" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="font-serif text-xl md:text-2xl font-bold tracking-wider text-primary">
            {siteName.toUpperCase()}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-primary ${
                location === item.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {settings?.phone && (
            <a
              href={`tel:${settings.phone}`}
              data-testid="nav-phone"
              className="px-5 py-2 border border-primary/30 text-primary hover:bg-primary/10 transition-colors uppercase tracking-widest text-xs font-semibold"
            >
              {settings.phone}
            </a>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-primary p-2"
          onClick={() => setOpen(!open)}
          data-testid="nav-mobile-toggle"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-white/5 py-6 px-4 flex flex-col gap-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)}
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
              className="inline-block mt-2 px-5 py-3 border border-primary/30 text-primary text-center uppercase tracking-widest text-xs font-semibold"
            >
              {settings.phone}
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
