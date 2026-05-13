import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGetSettings } from "@workspace/api-client-react";

const services = [
  { title: "Retour affectif", desc: "Retrouver un amour perdu, réconciliation de couples séparés." },
  { title: "Rituel de richesse", desc: "Sa spécialité absolue : rendre une personne riche par les forces mystiques. Résultats garantis." },
  { title: "Protection spirituelle", desc: "Bouclier mystique permanent contre les ennemis et les mauvaises énergies." },
  { title: "Problèmes de travail", desc: "Promotion professionnelle, protection contre les jaloux, succès au travail." },
];

const testimonials = [
  { name: "Aminata C.", pays: "Côte d'Ivoire", text: "Mon commerce était mort. Après le rituel de richesse, un investisseur m'a contactée. Aujourd'hui j'exporte dans toute l'Afrique. Merci infiniment, Maître." },
  { name: "Moussa T.", pays: "Burkina Faso", text: "Ma boutique ne vendait plus rien depuis 8 mois. Après la consultation, une grande entreprise m'a contacté pour un contrat. Tout a changé." },
  { name: "Fatoumata D.", pays: "Guinée", text: "Mon mari était parti avec une autre. En 9 jours, il est revenu en pleurant. Notre famille est réunie et plus forte que jamais." },
  { name: "Ibrahima S.", pays: "Sénégal", text: "Depuis la protection du Maître, mes affaires prospèrent et ceux qui voulaient ma perte ont disparu d'eux-mêmes." },
  { name: "Awa K.", pays: "Mali", text: "Six ans de mariage sans enfant. Maître Séraphin a identifié un blocage spirituel. Quatre mois après, j'étais enceinte. Je remercie le ciel chaque jour." },
  { name: "Seydou O.", pays: "Burkina Faso", text: "Bloqué au même poste depuis 7 ans. Le Maître a vu la jalousie autour de moi. Deux mois après, j'avais ma promotion et une augmentation." },
  { name: "Kadiatou B.", pays: "Guinée", text: "J'ai eu l'idée de créer ma boutique en ligne après le rituel. En moins d'un an, je vends dans toute l'Afrique de l'Ouest." },
  { name: "Adama K.", pays: "Côte d'Ivoire", text: "Ma femme était partie chez sa famille. En deux semaines, elle m'a appelé d'elle-même. Nous sommes réconciliés et notre couple est aujourd'hui béni." },
];

function AutoScrollCarousel({ images }: { images: string[] }) {
  const track = [...images, ...images];
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-4 animate-marquee" style={{ width: "max-content" }}>
        {track.map((img, i) => (
          <div
            key={i}
            className="min-w-[280px] md:min-w-[380px] aspect-square relative group overflow-hidden border border-white/10 flex-shrink-0"
          >
            <img
              src={img}
              alt={`Cérémonie ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let animFrame: number;
    let pos = 0;
    const speed = 0.4;
    const half = el.scrollWidth / 2;
    const step = () => {
      pos += speed;
      if (pos >= half) pos = 0;
      el.scrollLeft = pos;
      animFrame = requestAnimationFrame(step);
    };
    animFrame = requestAnimationFrame(step);
    const pause = () => cancelAnimationFrame(animFrame);
    const resume = () => { animFrame = requestAnimationFrame(step); };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause);
    el.addEventListener("touchend", resume);
    return () => {
      cancelAnimationFrame(animFrame);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  const doubled = [...testimonials, ...testimonials];

  return (
    <div
      ref={ref}
      className="flex gap-6 overflow-x-hidden cursor-default select-none"
      style={{ scrollBehavior: "auto" }}
    >
      {doubled.map((t, i) => (
        <div
          key={i}
          className="min-w-[300px] md:min-w-[380px] max-w-[380px] p-8 bg-background border border-white/5 relative flex-shrink-0 hover:border-primary/30 transition-colors"
        >
          <div className="text-primary text-4xl font-serif absolute top-4 right-6 opacity-15 select-none">"</div>
          <p className="text-muted-foreground italic mb-6 relative z-10 leading-relaxed text-sm">"{t.text}"</p>
          <div className="flex items-center gap-3 border-t border-white/5 pt-4">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-serif font-bold text-sm">
              {t.name[0]}
            </div>
            <div>
              <div className="font-bold text-white text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.pays}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const FALLBACK_GALLERY = [
  "/gallery-1.png", "/gallery-2.png", "/gallery-3.png",
  "/gallery-4.png", "/gallery-5.png", "/gallery-6.png",
];

export default function Home() {
  const { data: settings } = useGetSettings();
  const siteName = settings?.siteName || "Maître Séraphin";
  const galleryImages = settings?.ceremonyImages?.length ? settings.ceremonyImages : FALLBACK_GALLERY;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {settings?.heroImage && (
            <img
              src={settings.heroImage}
              alt="Ceremony"
              className="w-full h-full object-cover opacity-30 object-center"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-primary tracking-[0.3em] uppercase text-xs font-semibold mb-6">Le Guide des Forces Invisibles</h2>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight">
              Transformez Votre Destin par la Puissance Mystique
            </h1>
            <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              {siteName} invoque les forces ancestrales pour attirer la richesse,
              le retour de l'être aimé et la protection absolue.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-primary text-background font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors" data-testid="hero-cta-contact">
                Demander une Consultation
              </Link>
              <Link href="/services" className="px-8 py-4 border border-primary/50 text-primary font-bold tracking-widest uppercase hover:bg-primary/10 transition-colors" data-testid="hero-cta-services">
                Découvrir ses Pouvoirs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
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
              {settings?.aboutImage ? (
                <img
                  src={settings.aboutImage}
                  alt={siteName}
                  className="w-full h-full object-cover relative z-10"
                />
              ) : (
                <div className="w-full h-full bg-card relative z-10 flex items-center justify-center">
                  <span className="text-primary text-6xl font-serif opacity-20">✦</span>
                </div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-primary tracking-widest uppercase text-xs font-semibold mb-4">L'Héritier</h2>
              <h3 className="text-4xl font-serif font-bold mb-6 text-white">{siteName}</h3>
              <div className="space-y-6 text-muted-foreground leading-relaxed font-light">
                <p>
                  Guide spirituel de renommée mondiale, {siteName} est l'héritier direct d'une lignée de grands maîtres africains. Avec plus de 30 ans d'expérience dans les sciences occultes et les rituels ancestraux, il a transformé des milliers de vies à travers le monde.
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
            <h2 className="text-primary tracking-widest uppercase text-xs font-semibold mb-4">Domaines d'Intervention</h2>
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
                <div className="w-12 h-12 mb-6 text-primary flex items-center justify-center bg-primary/10 rounded-full group-hover:scale-110 transition-transform text-lg">
                  ✦
                </div>
                <h4 className="text-xl font-serif font-bold text-white mb-4">{service.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services" className="inline-block border-b border-primary text-primary hover:text-white hover:border-white transition-colors pb-1 tracking-widest uppercase text-xs">
              Voir tous les services
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery — auto-scroll */}
      <section className="py-24 w-full bg-background overflow-hidden">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-primary tracking-widest uppercase text-xs font-semibold mb-4">Aperçu du Sanctuaire</h2>
          <h3 className="text-4xl font-serif font-bold text-white">Le Pouvoir en Action</h3>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm">Chaque image est le témoignage silencieux d'une destinée transformée.</p>
        </div>
        <AutoScrollCarousel images={galleryImages} />
        <div className="text-center mt-8">
          <Link href="/rituels" className="inline-block border-b border-primary text-primary hover:text-white hover:border-white transition-colors pb-1 tracking-widest uppercase text-xs">
            Voir tous les rituels
          </Link>
        </div>
      </section>

      {/* Testimonials — auto-scroll */}
      <section className="py-24 w-full bg-card border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-primary tracking-widest uppercase text-xs font-semibold mb-4">Témoignages</h2>
          <h3 className="text-4xl font-serif font-bold text-white">Leurs Vies Ont Changé</h3>
        </div>
        <TestimonialsCarousel />
        <div className="text-center mt-10">
          <Link href="/avis" className="inline-block border-b border-primary text-primary hover:text-white hover:border-white transition-colors pb-1 tracking-widest uppercase text-xs">
            Lire tous les témoignages (30+)
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 w-full bg-background text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">N'attendez plus que le destin décide.</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Contactez {siteName} dès aujourd'hui pour une analyse confidentielle de votre situation.
          </p>
          <Link href="/contact" className="px-10 py-5 bg-primary text-background font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors text-lg" data-testid="cta-contact">
            Prendre Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
