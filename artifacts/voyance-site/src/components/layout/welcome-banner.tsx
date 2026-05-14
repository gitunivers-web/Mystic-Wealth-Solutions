import { useEffect, useState } from "react";
import { Shield, Award, AlertTriangle, Star } from "lucide-react";
import { DeepEyes } from "@/components/layout/deep-eyes";

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
        <div className="h-px sticky top-0" style={{ background: "linear-gradient(90deg, transparent, #c88800, transparent)" }} />

        <div className="px-5 sm:px-7 py-5 sm:py-6">
          {/* Eyes */}
          <div className="flex flex-col items-center mb-4">
            <DeepEyes size="md" />
            <p className="text-xs tracking-[0.35em] text-amber-700/60 uppercase mt-3 font-serif">
              L'Œil du Maître vous voit
            </p>
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <p className="text-xs tracking-[0.3em] text-amber-700/60 uppercase mb-1.5 font-serif">Avis Officiel</p>
            <h2 className="font-serif text-white text-lg sm:text-xl font-bold leading-snug">
              Mise en Garde & Engagement<br />du Maître Zonon 666
            </h2>
          </div>

          {/* Content */}
          <div className="space-y-3.5 text-sm text-stone-300 leading-relaxed">
            <div className="flex gap-2.5">
              <Award size={16} className="shrink-0 mt-0.5 text-amber-500" />
              <p>Maître Zonon 666 est un voyant certifié, <strong className="text-amber-400/90">titulaire de diplômes et certificats de qualification</strong> reconnus, habilité à exercer partout dans le monde.</p>
            </div>
            <div className="flex gap-2.5">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-400" />
              <p><strong className="text-red-400/90">Mise en garde :</strong> des imposteurs utilisent ses photos et vidéos sur les réseaux sociaux pour escroquer. Le Maître n'est joignable <em>que</em> via le <strong className="text-white">{phone}</strong>, le WhatsApp ou le formulaire de contact de ce site.</p>
            </div>
            <div className="flex gap-2.5">
              <Shield size={16} className="shrink-0 mt-0.5 text-amber-500" />
              <p>Tout autre profil, numéro ou compte se réclamant du Maître Zonon 666 est une <strong className="text-amber-400/90">usurpation d'identité</strong>. Ne transmettez jamais d'argent à ces imposteurs.</p>
            </div>
            <div className="flex gap-2.5">
              <Star size={16} className="shrink-0 mt-0.5 text-amber-500" />
              <p>Quel que soit votre problème — amour, argent, protection, santé, travail — <strong className="text-amber-400/90">le Maître vous trouvera la solution appropriée</strong>. Vous repartirez avec le sourire et la sérénité.</p>
            </div>
          </div>

          <button
            onClick={dismiss}
            className="mt-6 w-full py-3 font-serif font-bold text-sm uppercase tracking-widest text-black transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: "linear-gradient(90deg, #8b6000, #c88800, #8b6000)", borderRadius: 1 }}
          >
            ✦ J'ai compris — Entrer dans le Sanctuaire
          </button>
        </div>

        <div className="h-px sticky bottom-0" style={{ background: "linear-gradient(90deg, transparent, #c88800, transparent)" }} />
      </div>
    </div>
  );
}
