import { useEffect, useRef, useState, useCallback } from "react";
import { Shield, Award, AlertTriangle, Star } from "lucide-react";

function MysticEyes() {
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  const [blink, setBlink] = useState(false);
  const [halfBlink, setHalfBlink] = useState(false);

  useEffect(() => {
    const movePupil = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      [
        { eye: leftEyeRef.current, pupil: leftPupilRef.current },
        { eye: rightEyeRef.current, pupil: rightPupilRef.current },
      ].forEach(({ eye, pupil }) => {
        if (!eye || !pupil) return;
        const rect = eye.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(Math.hypot(dx, dy), 14);
        pupil.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
      });
    };
    window.addEventListener("mousemove", movePupil);
    window.addEventListener("touchmove", movePupil as EventListener, { passive: true });
    return () => {
      window.removeEventListener("mousemove", movePupil);
      window.removeEventListener("touchmove", movePupil as EventListener);
    };
  }, []);

  const scheduleBlink = useCallback(() => {
    const delay = 2200 + Math.random() * 3200;
    const t = setTimeout(async () => {
      setBlink(true);
      await new Promise(r => setTimeout(r, 120));
      setBlink(false);
      if (Math.random() < 0.3) {
        await new Promise(r => setTimeout(r, 160));
        setHalfBlink(true);
        await new Promise(r => setTimeout(r, 220));
        setHalfBlink(false);
      }
      if (Math.random() < 0.2) {
        await new Promise(r => setTimeout(r, 110));
        setBlink(true);
        await new Promise(r => setTimeout(r, 100));
        setBlink(false);
      }
      scheduleBlink();
    }, delay);
    return t;
  }, []);

  useEffect(() => {
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, [scheduleBlink]);

  const lidSize = blink ? "50%" : halfBlink ? "22%" : "0%";

  /* Eye dimensions */
  const EYE_W = 72;
  const EYE_H = 42;

  return (
    <div className="flex flex-col items-center mb-4 select-none">
      <div className="flex items-center gap-8">
        {(["left", "right"] as const).map((side) => (
          <div key={side} className="relative" style={{ width: EYE_W, height: EYE_H }}>
            {/* Aura */}
            <div className="absolute inset-0 rounded-[50%] pointer-events-none"
              style={{ boxShadow: "0 0 22px 6px #c8880038, 0 0 48px 14px #a0600018" }} />

            {/* Eyeball */}
            <div
              ref={side === "left" ? leftEyeRef : rightEyeRef}
              className="absolute inset-0 rounded-[50%] overflow-hidden"
              style={{
                background: "radial-gradient(ellipse at 50% 60%, #ebd9a0 0%, #b08828 45%, #6a3a00 80%, #180800 100%)",
                boxShadow: "inset 0 2px 10px #00000068, inset 0 -2px 6px #00000048",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center" style={{ width: 28, height: 28 }}>
                  {/* Iris */}
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: "conic-gradient(from 0deg, #4e2800, #804200, #361600, #6e3600, #4e2800)", boxShadow: "0 0 6px #c0800090" }} />
                  <div className="absolute rounded-full" style={{ inset: 3, background: "radial-gradient(circle at 40% 35%, #401c00, #160800)" }} />
                  {/* Pupil */}
                  <div
                    ref={side === "left" ? leftPupilRef : rightPupilRef}
                    className="absolute rounded-full"
                    style={{ width: 11, height: 11, background: "radial-gradient(circle at 35% 30%, #1a1a1a 0%, #000 70%)", transitionProperty: "transform", transitionDuration: "55ms", transitionTimingFunction: "linear" }}
                  />
                  {/* Gleam */}
                  <div className="absolute rounded-full pointer-events-none"
                    style={{ width: 6, height: 4, top: 5, left: 6, background: "rgba(255,255,220,0.6)", filter: "blur(1px)" }} />
                </div>
              </div>
            </div>

            {/* Top eyelid */}
            <div className="absolute inset-x-0 top-0 rounded-t-[50%] pointer-events-none"
              style={{ height: lidSize, background: "linear-gradient(to bottom, #0c0407 70%, #180b0e)", transition: "height 85ms cubic-bezier(0.4,0,0.2,1)", zIndex: 10 }} />
            {/* Bottom eyelid */}
            <div className="absolute inset-x-0 bottom-0 rounded-b-[50%] pointer-events-none"
              style={{ height: lidSize, background: "linear-gradient(to top, #0c0407 70%, #180b0e)", transition: "height 85ms cubic-bezier(0.4,0,0.2,1)", zIndex: 10 }} />

            {/* Top lashes */}
            <div className="absolute top-0 inset-x-0 flex justify-around pointer-events-none" style={{ zIndex: 11 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ width: 1.5, height: 6 + (i % 3) * 2, background: "#5a2e00", borderRadius: 2, transform: `rotate(${(i - 2.5) * 9}deg)`, transformOrigin: "bottom", opacity: 0.8 }} />
              ))}
            </div>
            {/* Bottom lashes */}
            <div className="absolute bottom-0 inset-x-0 flex justify-around pointer-events-none" style={{ zIndex: 11 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ width: 1, height: 4 + (i % 2), background: "#5a2e00", borderRadius: 2, transform: `rotate(${(i - 1.5) * 8}deg)`, transformOrigin: "top", opacity: 0.45 }} />
              ))}
            </div>

            {/* Eyebrow */}
            <div className="absolute pointer-events-none"
              style={{ top: -10, left: side === "left" ? 6 : 4, width: 58, height: 4, background: "linear-gradient(90deg, transparent, #6a3800 20%, #4e2400 80%, transparent)", borderRadius: 3, transform: side === "left" ? "rotate(-7deg)" : "rotate(7deg)", opacity: 0.85 }} />
          </div>
        ))}
      </div>

      <p className="text-xs tracking-[0.35em] text-amber-700/65 uppercase mt-4 font-serif">
        L'Œil du Maître vous voit
      </p>
    </div>
  );
}

export function WelcomeBanner({ phone = "+22968075372" }: { phone?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("zonon-banner-seen")) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("zonon-banner-seen", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
      style={{ background: "rgba(5,2,12,0.93)", backdropFilter: "blur(5px)" }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #c88800 0%, transparent 70%)" }} />

      {/* Modal — max-height + scroll for small screens */}
      <div
        className="relative w-full overflow-y-auto"
        style={{
          maxWidth: 480,
          maxHeight: "calc(100dvh - 24px)",
          background: "linear-gradient(160deg, #0c0508 0%, #110b02 100%)",
          border: "1px solid rgba(107,56,0,0.28)",
          borderRadius: 2,
          scrollbarWidth: "none",
        }}
      >
        {/* Top line */}
        <div className="h-px sticky top-0" style={{ background: "linear-gradient(90deg, transparent, #c88800, transparent)" }} />

        <div className="px-5 sm:px-7 py-5 sm:py-6">
          <MysticEyes />

          {/* Title */}
          <div className="text-center mb-5">
            <p className="text-xs tracking-[0.3em] text-amber-700/60 uppercase mb-1.5 font-serif">Avis Officiel</p>
            <h2 className="font-serif text-white text-lg sm:text-xl font-bold leading-snug">
              Mise en Garde & Engagement<br />du Maître Zonon 666
            </h2>
          </div>

          {/* Content blocks */}
          <div className="space-y-3.5 text-sm text-stone-300 leading-relaxed">
            <div className="flex gap-2.5">
              <Award size={16} className="shrink-0 mt-0.5 text-amber-500" />
              <p>
                Maître Zonon 666 est un voyant certifié, <strong className="text-amber-400/90">titulaire de diplômes et certificats de qualification</strong> reconnus, habilité à exercer partout dans le monde.
              </p>
            </div>
            <div className="flex gap-2.5">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-400" />
              <p>
                <strong className="text-red-400/90">Mise en garde :</strong> des imposteurs utilisent ses photos et vidéos sur les réseaux sociaux pour escroquer. Le Maître n'est joignable <em>que</em> via le <strong className="text-white">{phone}</strong>, le WhatsApp ou le formulaire de contact de ce site.
              </p>
            </div>
            <div className="flex gap-2.5">
              <Shield size={16} className="shrink-0 mt-0.5 text-amber-500" />
              <p>
                Tout autre profil, numéro ou compte se réclamant du Maître Zonon 666 est une <strong className="text-amber-400/90">usurpation d'identité</strong>. Ne transmettez jamais d'argent à ces imposteurs.
              </p>
            </div>
            <div className="flex gap-2.5">
              <Star size={16} className="shrink-0 mt-0.5 text-amber-500" />
              <p>
                Quel que soit votre problème — amour, argent, protection, santé, travail — <strong className="text-amber-400/90">le Maître vous trouvera la solution appropriée</strong>. Vous repartirez avec le sourire et la sérénité.
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={dismiss}
            className="mt-6 w-full py-3 font-serif font-bold text-sm uppercase tracking-widest text-black transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: "linear-gradient(90deg, #8b6000, #c88800, #8b6000)", borderRadius: 1 }}
          >
            ✦ J'ai compris — Entrer dans le Sanctuaire
          </button>
        </div>

        {/* Bottom line */}
        <div className="h-px sticky bottom-0" style={{ background: "linear-gradient(90deg, transparent, #c88800, transparent)" }} />
      </div>
    </div>
  );
}
