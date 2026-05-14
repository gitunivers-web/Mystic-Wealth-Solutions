import { useEffect, useRef, useState, useCallback } from "react";

/**
 * DeepEyes — deux yeux mystiques avec clignotement et dérive lente autonome
 * des pupilles (aucun suivi du curseur). Effet hypnotique profond.
 */
export function DeepEyes({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const leftPupilRef  = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);
  const frameRef      = useRef<number>(0);
  const startRef      = useRef<number>(Date.now());

  const [blink, setBlink]         = useState(false);
  const [halfBlink, setHalfBlink] = useState(false);

  /* Dimensions selon taille */
  const dim = {
    sm: { eyeW: 56, eyeH: 33, irisW: 22, irisH: 22, pupilW: 9,  maxDist: 8  },
    md: { eyeW: 76, eyeH: 44, irisW: 30, irisH: 30, pupilW: 12, maxDist: 12 },
    lg: { eyeW: 100,eyeH: 58, irisW: 40, irisH: 40, pupilW: 16, maxDist: 16 },
  }[size];

  /* Dérive lente autonome — figure-8 lissée */
  useEffect(() => {
    const animate = () => {
      const t = (Date.now() - startRef.current) / 1000;
      /* figure-8 lente: axe x = sin(t), axe y = sin(2t)/2 */
      const x = Math.sin(t * 0.38) * dim.maxDist;
      const y = Math.sin(t * 0.76) * (dim.maxDist * 0.45);
      [leftPupilRef.current, rightPupilRef.current].forEach(el => {
        if (el) el.style.transform = `translate(${x}px, ${y}px)`;
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [dim.maxDist]);

  /* Clignotement aléatoire */
  const scheduleBlink = useCallback(() => {
    const delay = 2400 + Math.random() * 3200;
    const t = setTimeout(async () => {
      setBlink(true);
      await new Promise(r => setTimeout(r, 125));
      setBlink(false);
      if (Math.random() < 0.28) {
        await new Promise(r => setTimeout(r, 170));
        setHalfBlink(true);
        await new Promise(r => setTimeout(r, 230));
        setHalfBlink(false);
      }
      if (Math.random() < 0.18) {
        await new Promise(r => setTimeout(r, 115));
        setBlink(true);
        await new Promise(r => setTimeout(r, 105));
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

  const lidH = blink ? "50%" : halfBlink ? "22%" : "0%";
  const gap  = size === "lg" ? 48 : size === "md" ? 32 : 22;

  return (
    <>
      {/* keyframes injectées une seule fois */}
      <style>{`
        @keyframes iris-spin   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes eye-pulse   { 0%,100% { opacity:.45; } 50% { opacity:.85; } }
        @keyframes eye-pulse2  { 0%,100% { opacity:.25; } 50% { opacity:.55; } }
      `}</style>

      <div className="flex items-center select-none" style={{ gap }}>
        {(["l","r"] as const).map((side) => (
          <div key={side} className="relative" style={{ width: dim.eyeW, height: dim.eyeH }}>

            {/* Aura pulsante externe */}
            <div className="absolute inset-0 rounded-[50%] pointer-events-none"
              style={{ boxShadow: "0 0 26px 8px #c8880044, 0 0 60px 20px #a0600020",
                       animation: "eye-pulse 3s ease-in-out infinite" }} />

            {/* Halo secondaire */}
            <div className="absolute rounded-[50%] pointer-events-none"
              style={{ inset: -6,
                       boxShadow: "0 0 40px 12px #8b600018",
                       animation: "eye-pulse2 4s ease-in-out infinite 1.5s" }} />

            {/* Globe oculaire */}
            <div className="absolute inset-0 rounded-[50%] overflow-hidden"
              style={{ background: "radial-gradient(ellipse at 50% 60%, #ebd9a0 0%, #b08828 42%, #6a3a00 78%, #180800 100%)",
                       boxShadow: "inset 0 2px 10px #00000068, inset 0 -2px 6px #00000048" }}>

              {/* Iris animé — rotation lente */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center"
                  style={{ width: dim.irisW, height: dim.irisH }}>

                  {/* Anneau iris tournant */}
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: "conic-gradient(from 0deg, #4e2800 0%, #a06010 20%, #3e1600 40%, #804200 60%, #5c3000 80%, #4e2800 100%)",
                             boxShadow: "0 0 8px #c08000aa",
                             animation: "iris-spin 12s linear infinite" }} />

                  {/* Iris intérieur fixe sombre */}
                  <div className="absolute rounded-full"
                    style={{ inset: 3, background: "radial-gradient(circle at 40% 35%, #401c00, #120600)" }} />

                  {/* Pupille qui dérive */}
                  <div ref={side === "l" ? leftPupilRef : rightPupilRef}
                    className="absolute rounded-full"
                    style={{ width: dim.pupilW, height: dim.pupilW,
                             background: "radial-gradient(circle at 35% 30%, #111 0%, #000 70%)" }} />

                  {/* Reflet */}
                  <div className="absolute rounded-full pointer-events-none"
                    style={{ width: dim.pupilW * 0.55, height: dim.pupilW * 0.4,
                             top: "22%", left: "38%",
                             background: "rgba(255,255,220,0.6)", filter: "blur(1px)" }} />
                </div>
              </div>
            </div>

            {/* Paupière supérieure */}
            <div className="absolute inset-x-0 top-0 rounded-t-[50%] pointer-events-none"
              style={{ height: lidH,
                       background: "linear-gradient(to bottom, #0c0407 65%, #1a0b10)",
                       transition: "height 90ms cubic-bezier(0.4,0,0.2,1)",
                       zIndex: 10 }} />
            {/* Paupière inférieure */}
            <div className="absolute inset-x-0 bottom-0 rounded-b-[50%] pointer-events-none"
              style={{ height: lidH,
                       background: "linear-gradient(to top, #0c0407 65%, #1a0b10)",
                       transition: "height 90ms cubic-bezier(0.4,0,0.2,1)",
                       zIndex: 10 }} />

            {/* Cils supérieurs */}
            <div className="absolute top-0 inset-x-0 flex justify-around pointer-events-none" style={{ zIndex: 11 }}>
              {[...Array(6)].map((_,i) => (
                <div key={i} style={{ width: 1.5, height: 6 + (i % 3)*2, background: "#5a2e00",
                  borderRadius: 2, transform: `rotate(${(i-2.5)*9}deg)`,
                  transformOrigin: "bottom", opacity: 0.75 }} />
              ))}
            </div>
            {/* Cils inférieurs */}
            <div className="absolute bottom-0 inset-x-0 flex justify-around pointer-events-none" style={{ zIndex: 11 }}>
              {[...Array(4)].map((_,i) => (
                <div key={i} style={{ width: 1, height: 4+(i%2), background: "#5a2e00",
                  borderRadius: 2, transform: `rotate(${(i-1.5)*8}deg)`,
                  transformOrigin: "top", opacity: 0.4 }} />
              ))}
            </div>

            {/* Sourcil */}
            <div className="absolute pointer-events-none"
              style={{ top: size === "lg" ? -14 : -10,
                       left: side === "l" ? "8%" : "5%",
                       width: "82%", height: size === "lg" ? 5 : 4,
                       background: "linear-gradient(90deg, transparent, #6a3800 20%, #4e2400 80%, transparent)",
                       borderRadius: 3,
                       transform: side === "l" ? "rotate(-7deg)" : "rotate(7deg)",
                       opacity: 0.85 }} />
          </div>
        ))}
      </div>
    </>
  );
}
