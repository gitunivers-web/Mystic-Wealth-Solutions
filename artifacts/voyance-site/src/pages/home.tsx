import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGetSettings } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

const services = [
  { title: "Retour affectif", desc: "Retrouver un amour perdu, réconciliation de couples séparés." },
  { title: "Rituel de richesse", desc: "Sa spécialité absolue : rendre une personne riche par les forces mystiques. Résultats garantis." },
  { title: "Protection spirituelle", desc: "Bouclier mystique permanent contre les ennemis et les mauvaises énergies." },
  { title: "Problèmes de travail", desc: "Promotion professionnelle, protection contre les jaloux, succès au travail." },
];

const testimonials = [
  { name: "Marc D.", text: "Mon entreprise était au bord de la faillite. Après le rituel de Maître Séraphin, de nouveaux contrats sont arrivés de nulle part. Un vrai miracle." },
  { name: "Sophie L.", text: "Mon mari m'avait quittée. En seulement 7 jours après le travail de retour affectif, il est revenu en s'excusant. Notre couple est plus fort que jamais." },
  { name: "Jean-Paul T.", text: "Les blocages financiers s'accumulaient. Grâce au rituel de richesse, j'ai gagné au loto et mes dettes ont été effacées en un mois." },
  { name: "Aline M.", text: "Les médecins disaient que je ne pourrais pas avoir d'enfants. Maître Séraphin a vu le blocage spirituel. Aujourd'hui, je suis mère de jumeaux." }
];

export default function Home() {
  const { data: settings } = useGetSettings();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={settings?.heroImage || "/hero.png"} 
            alt="Ceremony" 
            className="w-full h-full object-cover opacity-30 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-primary tracking-[0.3em] uppercase text-sm font-semibold mb-6">Le Guide des Forces Invisibles</h2>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight">
              Transformez Votre Destin par la Puissance Mystique
            </h1>
            <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Maître Séraphin invoque les forces ancestrales pour attirer la richesse, 
              le retour de l'être aimé et la protection absolue.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-primary text-background font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors">
                Demander une Consultation
              </Link>
              <Link href="/services" className="px-8 py-4 border border-primary/50 text-primary font-bold tracking-widest uppercase hover:bg-primary/10 transition-colors">
                Découvrir ses Pouvoirs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 w-full bg-background border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[3/4] w-full max-w-md mx-auto"
            >
              <div className="absolute inset-0 border border-primary/30 translate-x-4 translate-y-4" />
              <img 
                src={settings?.aboutImage || "/about.png"} 
                alt="Maître Séraphin" 
                className="w-full h-full object-cover relative z-10"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-primary tracking-widest uppercase text-sm font-semibold mb-4">L'Héritier</h2>
              <h3 className="text-4xl font-serif font-bold mb-6 text-white">Maître Séraphin</h3>
              <div className="space-y-6 text-muted-foreground leading-relaxed font-light">
                <p>
                  Guide spirituel de renommée mondiale, Maître Séraphin est l'héritier direct d'une lignée de grands maîtres africains. Avec plus de 30 ans d'expérience dans les sciences occultes et les rituels ancestraux, il a transformé des milliers de vies à travers le monde.
                </p>
                <p>
                  Sa spécialité unique réside dans sa capacité à invoquer les forces mystiques pour attirer la richesse et l'abondance — un don transmis de génération en génération. Il travaille dans la plus grande discrétion et garantit des résultats concrets.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-6 border-t border-white/10">
                  <li className="flex items-center gap-3 text-white"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Résultats garantis</li>
                  <li className="flex items-center gap-3 text-white"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Discrétion absolue</li>
                  <li className="flex items-center gap-3 text-white"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> 30 ans d'expertise</li>
                  <li className="flex items-center gap-3 text-white"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Force ancestrale</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 w-full bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-primary tracking-widest uppercase text-sm font-semibold mb-4">Domaines d'Intervention</h2>
            <h3 className="text-4xl font-serif font-bold text-white">L'Art de Changer les Destinées</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 border border-white/5 bg-background hover:border-primary/50 transition-colors group cursor-default"
              >
                <div className="w-12 h-12 mb-6 text-primary flex items-center justify-center bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                  ✦
                </div>
                <h4 className="text-xl font-serif font-bold text-white mb-4">{service.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services" className="inline-block border-b border-primary text-primary hover:text-white hover:border-white transition-colors pb-1 tracking-widest uppercase text-sm">
              Voir tous les services
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 w-full bg-background overflow-hidden">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-primary tracking-widest uppercase text-sm font-semibold mb-4">Aperçu du Sanctuaire</h2>
          <h3 className="text-4xl font-serif font-bold text-white">Le Pouvoir en Action</h3>
        </div>
        <div className="flex gap-4 w-full max-w-[100vw] overflow-x-auto pb-8 snap-x snap-mandatory px-4 md:px-12 hide-scrollbar">
          {(settings?.ceremonyImages?.length ? settings.ceremonyImages : ["/gallery-1.png", "/gallery-2.png", "/gallery-3.png", "/gallery-4.png", "/gallery-5.png", "/gallery-6.png"]).map((img, i) => (
            <div key={i} className="min-w-[300px] md:min-w-[400px] aspect-square snap-center relative group overflow-hidden border border-white/10">
              <img src={img} alt="Ceremony detail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700" />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 w-full bg-card border-y border-white/5">
        <div className="container mx-auto px-4">
           <div className="text-center mb-16">
            <h2 className="text-primary tracking-widest uppercase text-sm font-semibold mb-4">Témoignages</h2>
            <h3 className="text-4xl font-serif font-bold text-white">Leurs Vies Ont Changé</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((test, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-background border border-white/5 relative"
              >
                <div className="text-primary text-4xl font-serif absolute top-4 right-6 opacity-20">"</div>
                <p className="text-muted-foreground italic mb-6 relative z-10 leading-relaxed">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-serif font-bold">
                    {test.name[0]}
                  </div>
                  <div className="font-bold text-white">{test.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 w-full bg-background text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">N'attendez plus que le destin décide.</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Contactez Maître Séraphin dès aujourd'hui pour une analyse confidentielle de votre situation.
          </p>
          <Link href="/contact" className="px-10 py-5 bg-primary text-background font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors text-lg">
            Prendre Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
