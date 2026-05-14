import { useEffect, useRef, useState, useCallback } from "react";
import { Shield, Award, AlertTriangle, Star } from "lucide-react";

function MysticEyes() {
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  const [blink, setBlink] = useState(false);
  const [halfBlink, setHalfBlink] = useState(false);

  // Pupil tracking
  useEffect(() => {
    const movePupil = (e: MouseEvent) => {
      [
        { eye: leftEyeRef.current, pupil: leftPupilRef.current },
        { eye: rightEyeRef.current, pupil: rightPupilRef.current },
      ].forEach(({ eye, pupil }) => {
        if (!eye || !pupil) return;
        const rect = eye.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(Math.hypot(dx, dy), 18);
        pupil.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
      });
    };
    window.addEventListener("mousemove", movePupil);
    return () => window.removeEventListener("mousemove", movePupil);
  }, []);

  // Blink scheduler — random interval, sometimes double-blink
  const scheduleBlink = useCallback(() => {
    const delay = 2000 + Math.random() * 3500;
    const t = setTimeout(async () => {
      // First blink
      setBlink(true);
      await new Promise(r => setTimeout(r, 130));
      setBlink(false);

      // Occasionally do a half-drowsy look
      if (Math.random() < 0.3) {
        await new Promise(r => setTimeout(r, 180));
        setHalfBlink(true);
        await new Promise(r => setTimeout(r, 250));
        setHalfBlink(false);
      }

      // Occasionally double-blink
      if (Math.random() < 0.25) {
        await new Promise(r => setTimeout(r, 120));
        setBlink(true);
        await new Promise(r => setTimeout(r, 110));
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

  const lidTop = blink ? "50%" : halfBlink ? "25%" : "0%";
  const lidBottom = blink ? "50%" : halfBlink ? "25%" : "0%";

  return (
    <div className="flex flex-col items-center mb-6 select-none">
      {/* Eyes row */}
      <div className="flex items-center gap-10">
        {(["left", "right"] as const).map((side) => (
          <div key={side} className="relative" style={{ width: 90, height: 52 }}>
            {/* Outer aura */}
            <div className="absolute inset-0 rounded-[50%] pointer-events-none"
              style={{ boxShadow: "0 0 28px 8px #c8880040, 0 0 60px 20px #a0600020" }} />

            {/* Eyeball */}
            <div
              ref={side === "left" ? leftEyeRef : rightEyeRef}
              className="absolute inset-0 rounded-[50%] overflow-hidden"
              style={{
                background: "radial-gradient(ellipse at 50% 60%, #eedcaa 0%, #b8922a 45%, #6b3c00 80%, #1a0800 100%)",
                boxShadow: "inset 0 2px 12px #00000070, inset 0 -2px 8px #00000050",
              }}
            >
              {/* Iris ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center"
                  style={{ width: 36, height: 36 }}>
                  {/* Iris */}
                  <div className="absolute inset-0 rounded-full"
                    style={{
                      background: "conic-gradient(from 0deg, #5c2e00, #8b4a00, #3d1a00, #7a3d00, #5c2e00)",
                      boxShadow: "0 0 8px #c88800aa",
                    }} />
                  {/* Iris inner */}
                  <div className="absolute rounded-full"
                    style={{
                      inset: 4,
                      background: "radial-gradient(circle at 40% 35%, #4a2000, #1a0800)",
                    }} />
                  {/* Pupil */}
                  <div
                    ref={side === "left" ? leftPupilRef : rightPupilRef}
                    className="absolute rounded-full"
                    style={{
                      width: 14, height: 14,
                      background: "radial-gradient(circle at 35% 30%, #222 0%, #000 70%)",
                      transitionProperty: "transform",
                      transitionDuration: "55ms",
                      transitionTimingFunction: "linear",
                    }}
                  />
                  {/* Gleam */}
                  <div className="absolute rounded-full pointer-events-none"
                    style={{ width: 7, height: 5, top: 6, left: 8, background: "rgba(255,255,220,0.65)", filter: "blur(1px)" }} />
                  <div className="absolute rounded-full pointer-events-none"
                    style={{ width: 3, height: 3, bottom: 8, right: 6, background: "rgba(255,255,200,0.25)" }} />
                </div>
              </div>
            </div>

            {/* ── EYELIDS (SVG clip approach via absolute divs) ── */}
            {/* Top eyelid */}
            <div
              className="absolute inset-x-0 top-0 rounded-t-[50%] pointer-events-none"
              style={{
                height: lidTop,
                background: "linear-gradient(to bottom, #0d0608 70%, #1a0d10)",
                transition: "height 90ms cubic-bezier(0.4,0,0.2,1)",
                zIndex: 10,
              }}
            />
            {/* Bottom eyelid */}
            <div
              className="absolute inset-x-0 bottom-0 rounded-b-[50%] pointer-events-none"
              style={{
                height: lidBottom,
                background: "linear-gradient(to top, #0d0608 70%, #1a0d10)",
                transition: "height 90ms cubic-bezier(0.4,0,0.2,1)",
                zIndex: 10,
              }}
            />

            {/* Eyelash fringe — top */}
            <div className="absolute top-0 inset-x-0 flex justify-around pointer-events-none" style={{ zIndex: 11 }}>
              {[...Array(7)].map((_, i) => (
                <div key={i}
                  style={{
                    width: 1.5,
                    height: 7 + (i % 3) * 2,
                    background: "#6b3300",
                    borderRadius: 2,
                    transform: `rotate(${(i - 3) * 8}deg)`,
                    transformOrigin: "bottom",
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
            {/* Eyelash fringe — bottom */}
            <div className="absolute bottom-0 inset-x-0 flex justify-around pointer-events-none" style={{ zIndex: 11 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i}
                  style={{
                    width: 1,
                    height: 4 + (i % 2) * 2,
                    background: "#6b3300",
                    borderRadius: 2,
                    transform: `rotate(${(i - 2) * 7}deg)`,
                    transformOrigin: "top",
                    opacity: 0.5,
                  }}
                />
              ))}
            </div>

            {/* Eyebrow */}
            <div className="absolute pointer-events-none"
              style={{
                top: -12,
                left: side === "left" ? 8 : 6,
                width: 70,
                height: 5,
                background: "linear-gradient(90deg, transparent, #7a4000 20%, #5c2e00 80%, transparent)",
                borderRadius: 4,
                transform: side === "left" ? "rotate(-6deg)" : "rotate(6deg)",
                opacity: 0.9,
              }}
            />
          </div>
        ))}
      </div>

      {/* Label */}
      <p className="text-xs tracking-[0.4em] text-amber-700/70 uppercase mt-5 font-serif">
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
      style={{ background: "rgba(5,2,12,0.93)", backdropFilter: "blur(6px)" }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-52 opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #c88800 0%, transparent 70%)" }} />

      <div
        className="relative max-w-lg w-full overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0c0508 0%, #110b02 100%)",
          border: "1px solid #6b380030",
          borderRadius: 2,
        }}
      >
        {/* Top gold line */}
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #c88800, transparent)" }} />

        <div className="px-7 py-7">
          <MysticEyes />

          {/* Title */}
          <div className="text-center mb-6">
            <p className="text-xs tracking-[0.35em] text-amber-700/60 uppercase mb-2 font-serif">Avis Officiel</p>
            <h2 className="font-serif text-white text-xl font-bold leading-snug">
              Mise en Garde & Engagement<br />du Maître Zonon 666
            </h2>
          </div>

          {/* Content blocks */}
          <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
            <div className="flex gap-3">
              <Award size={17} className="shrink-0 mt-0.5 text-amber-500" />
              <p>
                Maître Zonon 666 est un voyant certifié, <strong className="text-amber-400/90">titulaire de diplômes et certificats de qualification</strong> reconnus, habilité à exercer son art partout dans le monde.
              </p>
            </div>
            <div className="flex gap-3">
              <AlertTriangle size={17} className="shrink-0 mt-0.5 text-red-400" />
              <p>
                <strong className="text-red-400/90">Mise en garde contre les imposteurs :</strong> des individus mal intentionnés utilisent les photos et vidéos du Maître sur les réseaux sociaux pour escroquer. Le Maître n'est joignable <em>que</em> via les contacts officiels — le <strong className="text-white">{phone}</strong>, le WhatsApp et le formulaire de contact de ce site.
              </p>
            </div>
            <div className="flex gap-3">
              <Shield size={17} className="shrink-0 mt-0.5 text-amber-500" />
              <p>
                Tout autre profil, numéro ou compte prétendant être le Maître Zonon 666 est une <strong className="text-amber-400/90">usurpation d'identité</strong>. Ne transmettez jamais d'argent à ces imposteurs.
              </p>
            </div>
            <div className="flex gap-3">
              <Star size={17} className="shrink-0 mt-0.5 text-amber-500" />
              <p>
                Quel que soit votre problème — amour, argent, protection, santé, travail — <strong className="text-amber-400/90">le Maître Zonon 666 vous trouvera la solution appropriée</strong>. Vous repartirez avec le sourire et la sérénité dans le cœur.
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={dismiss}
            className="mt-7 w-full py-3.5 font-serif font-bold text-sm uppercase tracking-widest text-black transition-all hover:opacity-90 active:scale-[0.99]"
            style={{
              background: "linear-gradient(90deg, #8b6000, #c88800, #8b6000)",
              borderRadius: 1,
            }}
          >
            ✦ J'ai compris — Entrer dans le Sanctuaire
          </button>
        </div>

        {/* Bottom gold line */}
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #c88800, transparent)" }} />
      </div>
    </div>
  );
}
