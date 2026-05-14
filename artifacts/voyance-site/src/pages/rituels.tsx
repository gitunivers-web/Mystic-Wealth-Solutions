import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGetSettings } from "@workspace/api-client-react";

const rituelsAnnotes = [
  {
    titre: "Rituel de Richesse & Abondance",
    description: "Le rituel phare du Maître. À l'aide d'offrandes sacrées, d'huiles ancestrales et de l'invocation des esprits protecteurs, il ouvre les canaux de la prospérité. Ce rituel brise les blocages financiers installés par la jalousie ou par des forces obscures, et attire l'abondance de manière durable.",
    details: ["Durée : 3 à 7 nuits", "Résultats en 15 à 30 jours", "Garantie de discrétion totale", "Consultation préalable obligatoire"],
    couleur: "from-yellow-900/30",
  },
  {
    titre: "Rituel de Retour Affectif",
    description: "Par la force du lien invisible qui unit deux âmes, Maître Séraphin utilise des herbes rares et des incantations transmises de génération en génération pour raviver la flamme et forcer le retour de l'être aimé. Même les cas les plus désespérés ont été résolus.",
    details: ["Rituel personnalisé sur photo", "Action en 7 à 21 jours", "Applicable à distance", "Discrétion absolue garantie"],
    couleur: "from-red-900/20",
  },
  {
    titre: "Rituel de Protection Totale",
    description: "Un bouclier mystique puissant est érigé autour du client pour le protéger de toute influence malveillante, envoûtement, mauvais œil et jalousie. Ce rituel crée une barrière invisible que les forces négatives ne peuvent pas franchir.",
    details: ["Protection active 24h/24", "Renouvellement annuel conseillé", "Valable pour toute la famille", "Aucun sacrifice animal requis"],
    couleur: "from-blue-900/20",
  },
  {
    titre: "Rituel de Désenvoûtement",
    description: "Lorsqu'une personne est victime d'un maraboutage ou d'un sort, le Maître procède à un diagnostic spirituel précis avant d'entreprendre le rituel de purification. Les énergies négatives sont extraites, neutralisées et retournées à leur source.",
    details: ["Diagnostic spirituel inclus", "Nettoyage complet de l'aura", "Résultats en 3 à 10 jours", "Suivi post-rituel assuré"],
    couleur: "from-purple-900/20",
  },
  {
    titre: "Rituel de Fertilité",
    description: "Les blocages spirituels sont souvent la cause cachée de l'infertilité. Maître Séraphin identifie et lève ces blocages grâce à des rituels anciens impliquant des plantes médicinales sacrées et des bains purificateurs. Des milliers de naissances miraculeuses en témoignent.",
    details: ["Applicable à l'homme et la femme", "Aucun effet secondaire", "Complément aux traitements médicaux", "Résultats en 2 à 6 mois"],
    couleur: "from-green-900/20",
  },
  {
    titre: "Rituel de Chance & Succès",
    description: "Ce rituel active les énergies de réussite dormantes dans votre vie. Qu'il s'agisse d'un examen, d'une affaire, d'un entretien d'embauche ou d'un jeu de hasard, le Maître travaille à aligner les forces invisibles en votre faveur.",
    details: ["Adapté à chaque situation", "Rituel rapide en 3 nuits", "Résultats souvent immédiats", "Discret et sans danger"],
    couleur: "from-orange-900/20",
  },
];

const FALLBACK_RITUALS = [
  "/gallery-1.png", "/gallery-2.png", "/gallery-3.png",
  "/gallery-4.png", "/gallery-5.png", "/gallery-6.png",
];

export default function Rituels() {
  const { data: settings } = useGetSettings();
  const siteName = settings?.siteName || "Maître Séraphin";
  const ritualImages = settings?.ritualImages?.length
    ? settings.ritualImages
    : settings?.ceremonyImages?.length
      ? settings.ceremonyImages
      : FALLBACK_RITUALS;

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-20 text-center border-b border-white/5 bg-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-primary tracking-[0.3em] uppercase text-xs font-semibold mb-4">
            Les Arts Sacrés
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
            Les Rituels du Maître
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Des pratiques ancestrales transmises de génération en génération. Chaque rituel est unique, personnalisé, et exécuté dans la plus grande discrétion.
          </motion.p>
        </div>
      </section>

      {/* Photo Gallery with Annotations */}
      {ritualImages.length > 0 && (
        <section className="py-20 w-full overflow-hidden">
          <div className="container mx-auto px-4 mb-12 text-center">
            <h2 className="text-primary tracking-widest uppercase text-xs font-semibold mb-4">Galerie Sacrée</h2>
            <h3 className="text-3xl font-serif font-bold text-white">Le Sanctuaire en Images</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
            {ritualImages.map((img, i) => {
              const annotations = [
                "Rituel de richesse — une fois accompli, il ouvre les portes de l'abondance financière",
                "Protection contre les sorts maléfiques — sacrifice réalisé pour immuniser la personne contre toute attaque spirituelle",
                "Offrandes aux esprits gardiens de la prospérité",
                "Offrande sacrée — protège l'intégralité du foyer, attire la richesse et apaise les conflits conjugaux",
                "Invocation des forces de l'abondance et de la richesse",
                "Rituel de retour affectif — lien sacré entre deux âmes",
                "Cérémonie de désenvoûtement et purification totale",
                "Rituel de chance — alignement des forces cosmiques",
              ];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  className="relative group overflow-hidden aspect-square"
                  data-testid={`ritual-image-${i}`}
                >
                  <img
                    src={img}
                    alt={annotations[i % annotations.length]}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="text-primary text-xs uppercase tracking-widest mb-1 font-semibold">
                      Rituel {String(i + 1).padStart(2, "0")}
                    </div>
                    <p className="text-white text-sm font-medium leading-tight">
                      {annotations[i % annotations.length]}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 border border-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-primary text-xs">✦</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Ritual Details */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-primary tracking-widest uppercase text-xs font-semibold mb-4">Pratiques Ancestrales</h2>
            <h3 className="text-4xl font-serif font-bold text-white">Les Rituels Expliqués</h3>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm">
              Chaque rituel est une science exacte, pratiquée depuis des siècles par la lignée de {siteName}.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rituelsAnnotes.map((rituel, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.1 }}
                className={`bg-background border border-white/5 p-8 relative overflow-hidden hover:border-primary/30 transition-colors group`}
                data-testid={`ritual-card-${i}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${rituel.couleur} to-transparent pointer-events-none`} />
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-serif flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h4 className="text-xl font-serif font-bold text-white leading-tight">{rituel.titre}</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{rituel.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {rituel.details.map((d, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-white/70">
                        <span className="text-primary">✦</span>
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <Link
                      href={`/contact?subject=${encodeURIComponent(rituel.titre)}`}
                      className="text-xs uppercase tracking-widest text-primary hover:text-white transition-colors border-b border-primary/40 pb-0.5"
                    >
                      Demander ce rituel
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Discretion Banner */}
      <section className="py-20 bg-background border-t border-white/5 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-primary text-3xl mb-6">✦</div>
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Discrétion Absolue</h2>
          <p className="text-muted-foreground leading-relaxed mb-10">
            Tous les rituels sont réalisés dans la plus stricte confidentialité. {siteName} s'engage à ne jamais divulguer l'identité de ses clients ni la nature des rituels pratiqués. Votre secret est sacré.
          </p>
          <Link href="/contact" className="px-10 py-4 bg-primary text-background font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors">
            Consulter le Maître
          </Link>
        </div>
      </section>
    </div>
  );
}
