import { motion } from "framer-motion";
import { Link } from "wouter";

const allServices = [
  { id: "amour", title: "Retour affectif", desc: "Retrouver un amour perdu, réconciliation de couples séparés. Un rituel puissant pour raviver la flamme et ramener l'être aimé, même dans les cas désespérés." },
  { id: "fertilite", title: "Infertilité", desc: "Traitement spirituel des problèmes de fertilité pour hommes et femmes. Déblocage des énergies vitales pour concevoir." },
  { id: "couple", title: "Problèmes de couple", desc: "Harmonie conjugale, arrêter les querelles, assurer la fidélité et renforcer les liens sacrés du mariage." },
  { id: "travail", title: "Problèmes de travail", desc: "Promotion professionnelle, protection contre les jaloux, succès aux entretiens et réussite globale dans votre carrière." },
  { id: "finances", title: "Problèmes financiers", desc: "Attirer la prospérité, effacer les dettes, briser les blocages financiers qui vous empêchent d'avancer." },
  { id: "richesse", title: "SPÉCIALITÉ : Rituel de richesse", desc: "La spécialité absolue du Maître : rendre une personne riche par l'invocation des forces mystiques. Résultats garantis, rapides et d'une discrétion totale.", isSpecial: true },
  { id: "desenvoutement", title: "Envoûtement & désenvoûtement", desc: "Protection absolue contre les mauvaises énergies, le maraboutage, la magie noire et le mauvais œil." },
  { id: "guerison", title: "Maladies inexpliquées", desc: "Guérison spirituelle des affections sans cause médicale connue. Nettoyage de l'aura et de l'âme." },
  { id: "chance", title: "Chance & succès", desc: "Attirer la bonne fortune quotidienne, réussir ses examens, débloquer la chance en affaires." },
  { id: "protection", title: "Protection spirituelle", desc: "Bouclier mystique permanent contre les ennemis, visible ou invisible, pour vous et votre famille." },
  { id: "voyance", title: "Voyance & divination", desc: "Révélation claire de l'avenir, consultation clairvoyante pour guider vos choix de vie importants." },
  { id: "mariage", title: "Mariage & séduction", desc: "Attirer l'être désiré, trouver l'amour vrai et consolider un engagement durable." },
];

export default function Services() {
  return (
    <div className="w-full min-h-screen bg-background pb-24">
      {/* Header */}
      <section className="pt-32 pb-16 text-center border-b border-white/5 bg-card relative">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">Les Rituels Sacrés</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Découvrez l'étendue des pouvoirs de Maître Séraphin. Chaque rituel est exécuté avec précision et respect des traditions ancestrales.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 gap-8">
            {allServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`p-8 md:p-10 border relative overflow-hidden ${
                  service.isSpecial 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-white/5 bg-card"
                }`}
              >
                {service.isSpecial && (
                  <div className="absolute top-0 right-0 bg-primary text-background text-xs font-bold px-4 py-1 tracking-widest uppercase">
                    Spécialité
                  </div>
                )}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 shrink-0 bg-background border border-white/10 flex items-center justify-center text-primary text-2xl font-serif">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">{service.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-lg mb-6">{service.desc}</p>
                    <Link href={`/contact?subject=${service.title}`} className="text-primary uppercase tracking-widest text-sm font-semibold hover:text-white transition-colors inline-flex items-center gap-2">
                      Demander ce rituel <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
