import { useEffect, useRef, useState } from "react";
import { Shield, Award, AlertTriangle, Star } from "lucide-react";

function MysticEye() {
  const eyeRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current || !pupilRef.current) return;
      const rect = eyeRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.hypot(dx, dy), 22);
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      pupilRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col items-center mb-6">
      <div ref={eyeRef} className="relative w-28 h-16 flex items-center justify-center select-none">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full opacity-30"
          style={{ boxShadow: "0 0 40px 10px #d4a017" }} />
        {/* Eye white */}
        <div className="absolute inset-0 rounded-[50%] overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, #f5e8c0 0%, #c8a44a 60%, #3a1a00 100%)",
            boxShadow: "inset 0 0 20px #00000080, 0 0 20px #d4a01760",
          }}>
          {/* Iris */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-10 h-10 rounded-full relative flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 40% 35%, #7a4a00 0%, #3d1f00 50%, #1a0a00 100%)",
                boxShadow: "0 0 10px #d4a01740",
              }}
            >
              {/* Pupil */}
              <div
                ref={pupilRef}
                className="w-4 h-4 rounded-full absolute transition-transform"
                style={{
                  background: "radial-gradient(circle at 35% 30%, #555 0%, #000 70%)",
                  transitionDuration: "60ms",
                  transitionTimingFunction: "linear",
                }}
              />
              {/* Iris gleam */}
              <div className="absolute top-1.5 left-2 w-2 h-1 rounded-full opacity-60"
                style={{ background: "white" }} />
            </div>
          </div>
          {/* Eyelid lines */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, #00000030 0%, transparent 30%, transparent 70%, #00000030 100%)"
          }} />
        </div>

        {/* Decorative lashes */}
        {[...Array(5)].map((_, i) => (
          <div key={i}
            className="absolute bottom-0 w-px bg-amber-700/60"
            style={{
              height: `${8 + i % 3 * 3}px`,
              left: `${20 + i * 14}%`,
              transformOrigin: "top",
              transform: `rotate(${(i - 2) * 12}deg)`,
            }}
          />
        ))}
      </div>

      {/* Glow text below eye */}
      <p className="text-xs tracking-[0.4em] text-amber-600/70 uppercase mt-2 font-serif">
        L'Œil du Maître vous voit
      </p>
    </div>
  );
}

interface WelcomeBannerProps {
  phone?: string;
}

export function WelcomeBanner({ phone = "+22968075372" }: WelcomeBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("zonon-banner-seen");
    if (!seen) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("zonon-banner-seen", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(5,2,12,0.92)", backdropFilter: "blur(6px)" }}
    >
      {/* Ambient golden glow top-center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #d4a017 0%, transparent 70%)" }} />

      <div
        className="relative max-w-lg w-full rounded-sm border border-amber-700/30 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0d0608 0%, #110b04 100%)" }}
      >
        {/* Top gold line */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #d4a017, transparent)" }} />

        <div className="px-7 py-8">
          <MysticEye />

          {/* Title */}
          <div className="text-center mb-7">
            <p className="text-xs tracking-[0.35em] text-amber-600/60 uppercase mb-2">Avis Officiel</p>
            <h2 className="font-serif text-white text-xl font-bold leading-snug">
              Mise en Garde & Engagement<br />du Maître Zonon 666
            </h2>
          </div>

          {/* Blocks */}
          <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
            {/* Légitimité */}
            <div className="flex gap-3">
              <Award size={18} className="shrink-0 mt-0.5 text-amber-500" />
              <p>
                Maître Zonon 666 est un voyant certifié, <strong className="text-amber-400/90">titulaire de diplômes et certificats de qualification</strong> reconnus, habilité à exercer son art partout dans le monde.
              </p>
            </div>

            {/* Mise en garde */}
            <div className="flex gap-3">
              <AlertTriangle size={18} className="shrink-0 mt-0.5 text-red-400" />
              <p>
                <strong className="text-red-400/90">Mise en garde contre les imposteurs :</strong> des individus mal intentionnés utilisent les photos et vidéos du Maître sur les réseaux sociaux pour escroquer. Le Maître n'est joignable <em>que</em> via les contacts officiels de ce site — le <strong className="text-white">{phone}</strong>, le WhatsApp et le formulaire de contact.
              </p>
            </div>

            {/* Contacts officiels */}
            <div className="flex gap-3">
              <Shield size={18} className="shrink-0 mt-0.5 text-amber-500" />
              <p>
                Tout autre profil, numéro ou compte prétendant être le Maître Zonon 666 est une <strong className="text-amber-400/90">usurpation d'identité</strong>. Ne transmettez jamais d'argent à ces imposteurs.
              </p>
            </div>

            {/* Engagement */}
            <div className="flex gap-3">
              <Star size={18} className="shrink-0 mt-0.5 text-amber-500" />
              <p>
                Quel que soit votre problème — amour, argent, protection, santé, travail — <strong className="text-amber-400/90">le Maître Zonon 666 vous trouvera la solution appropriée</strong>. Vous repartirez avec le sourire et la sérénité dans le cœur.
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={dismiss}
            className="mt-8 w-full py-3.5 font-serif font-bold text-sm uppercase tracking-widest text-black rounded-sm transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: "linear-gradient(90deg, #b8860b, #d4a017, #b8860b)" }}
          >
            ✦ J'ai compris — Entrer dans le Sanctuaire
          </button>
        </div>

        {/* Bottom gold line */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #d4a017, transparent)" }} />
      </div>
    </div>
  );
}
