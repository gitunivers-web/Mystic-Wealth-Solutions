import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetSettings } from "@workspace/api-client-react";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { data: settings } = useGetSettings();
  const siteName = settings?.siteName || "Maître Zonon 666";

  const regularItems = [
    { label: "Accueil", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Rituels", path: "/rituels" },
    { label: "Avis", path: "/avis" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)} data-testid="nav-logo">
          <Logo size={32} />
          <span className="font-serif text-lg md:text-xl font-bold tracking-wider text-primary leading-tight">
            {siteName}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {regularItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative text-xs uppercase tracking-widest font-medium transition-colors group/link ${isActive ? "text-primary" : "text-muted-foreground hover:text-white"}`}
              >
                {item.label}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-primary transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover/link:w-full"}`} />
              </Link>
            );
          })}

          {/* Contact — mis en avant */}
          <Link
            href="/contact"
            className={`relative px-5 py-2 text-xs uppercase tracking-widest font-bold border transition-all duration-300 group/contact ${
              location === "/contact"
                ? "bg-primary text-background border-primary"
                : "border-primary/50 text-primary hover:bg-primary hover:text-background hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            }`}
          >
            <span className="relative z-10">Contact</span>
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-primary p-2"
          onClick={() => setOpen(!open)}
          data-testid="nav-mobile-toggle"
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background/98 backdrop-blur border-t border-white/5 py-6 px-6 flex flex-col gap-4">
          {regularItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)}
              className={`text-sm uppercase tracking-widest font-medium transition-colors hover:text-primary py-2 border-b border-white/5 ${
                location === item.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 px-6 py-3 bg-primary text-background text-center font-bold tracking-widest uppercase text-xs hover:bg-primary/90 transition-colors"
          >
            Prendre Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
