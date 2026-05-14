import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useGetSettings } from "@workspace/api-client-react";
import { Phone, MessageCircle, Star, Shield, Zap, Heart } from "lucide-react";

const services = [
  { icon: Zap, title: "Rituel de Richesse", desc: "Sa spécialité absolue. Par les forces mystiques ancestrales, il brise les blocages financiers et fait affluer l'abondance en 15 à 30 jours.", urgent: true },
  { icon: Heart, title: "Retour Affectif", desc: "Même les séparations les plus désespérées ont été résolues. Le rituel ravive le lien invisible qui unit deux âmes en 7 à 21 jours." },
  { icon: Shield, title: "Protection Totale", desc: "Un bouclier mystique permanent érigé autour de vous. Aucune force négative, aucun sort, aucun ennemi ne peut vous atteindre." },
  { icon: Star, title: "Infertilité Spirituelle", desc: "Les blocages invisibles sont souvent la vraie cause. Après le rituel, des milliers de naissances ont eu lieu dans les mois suivants." },
];

const urgenceStats = [
  { chiffre: "30 000+", label: "Rituels accomplis" },
  { chiffre: "98%", label: "Taux de réussite" },
  { chiffre: "30 ans", label: "D'expertise mystique" },
  { chiffre: "24h/24", label: "Disponibilité" },
];

// 18 témoignages → doublés = 36 items, scroll parfaitement fluide sans étirement
const temoignages = [
  { name: "Aminata C.", pays: "Côte d'Ivoire", service: "Richesse", texte: "J'avais des dettes depuis 4 ans. Après le rituel de richesse sur 7 nuits, un investisseur m'a contactée spontanément. Toutes mes dettes sont aujourd'hui remboursées." },
  { name: "Fatoumata D.", pays: "Guinée", service: "Retour affectif", texte: "Mon mari était parti depuis 11 mois. Le 9ème jour après le rituel, il a appelé en pleurant et est revenu. Je n'y croyais plus." },
  { name: "Ibrahima S.", pays: "Sénégal", service: "Protection", texte: "Un sort avait été jeté sur mon entreprise. Après le rituel de désenvoûtement, mes affaires ont redémarré en deux semaines. Les ennemis ont disparu." },
  { name: "Awa K.", pays: "Mali", service: "Infertilité", texte: "6 ans de mariage sans enfant. Le rituel de purification a levé le blocage spirituel. 4 mois après, j'attendais des jumeaux. Miracle absolu." },
  { name: "Moussa T.", pays: "Burkina Faso", service: "Richesse", texte: "Ma boutique était morte depuis 8 mois. Après le rituel d'attraction de clientèle, le 10ème jour les clients affluaient. Un contrat géant a suivi." },
  { name: "Seydou O.", pays: "Burkina Faso", service: "Travail", texte: "7 ans bloqué au même poste à cause d'un envoûtement. Après le rituel de déblocage professionnel, j'ai eu ma promotion le mois suivant." },
  { name: "Rokia C.", pays: "Burkina Faso", service: "Mariage", texte: "À 38 ans sans mari à cause d'un sort de solitude. 6 semaines après le rituel d'attraction, j'ai rencontré mon futur mari. Nous sommes mariés." },
  { name: "Boubacar D.", pays: "Mali", service: "Richesse", texte: "Tout perdu dans une mauvaise affaire. Le rituel de reconstruction financière m'a redonné confiance et chance. En 3 mois, j'avais ma propre maison." },
  { name: "Lamine T.", pays: "Sénégal", service: "Couple", texte: "Mon épouse et moi nous disputions chaque jour depuis deux ans. Après le rituel de purification du foyer, l'atmosphère a changé en une semaine. Nos enfants sont heureux." },
  { name: "Hawa T.", pays: "Côte d'Ivoire", service: "Infertilité", texte: "8 ans de mariage sans enfant malgré des bilans médicaux normaux. Le rituel de levée de blocage a tout changé. Six mois plus tard, j'étais enceinte de jumeaux." },
  { name: "Cheikh D.", pays: "Sénégal", service: "Chance", texte: "14 demandes de visa refusées sans raison. Après le rituel d'ouverture de portes, ma demande suivante a été acceptée en 5 jours. Je suis maintenant établi à l'étranger." },
  { name: "Djénéba C.", pays: "Guinée", service: "Désenvoûtement", texte: "Des cauchemars chaque nuit, des maladies sans diagnostic. Après le rituel de désenvoûtement en 3 nuits, dès la première nuit j'ai dormi comme jamais. En une semaine, tout avait disparu." },
  { name: "Ndeye F.", pays: "Sénégal", service: "Guérison", texte: "Mon fils perdait du poids chaque semaine, les médecins étaient perplexes. Après le rituel de purification, il a retrouvé l'appétit et la vitalité en 10 jours." },
  { name: "Abdoulaye B.", pays: "Guinée", service: "Richesse", texte: "L'argent ne restait jamais entre mes mains à cause d'une malédiction familiale. Depuis le rituel de rupture de malédiction, je réussis tout ce que j'entreprends." },
  { name: "Oumar N.", pays: "Sénégal", service: "Finances", texte: "Des dettes m'étouffaient et mes créanciers me menaçaient. Après le rituel de levée de malédiction financière, j'ai trouvé un emploi bien rémunéré et tout remboursé en 4 mois." },
  { name: "Mariam S.", pays: "Mali", service: "Chance", texte: "J'avais raté le concours de la fonction publique 3 fois. Après le rituel de protection et d'ouverture de chance, j'ai eu le meilleur score de ma promotion. Je suis inspecteur." },
  { name: "Souleymane C.", pays: "Mali", service: "Richesse", texte: "Chauffeur de taxi 15 ans sans pouvoir acheter mon propre véhicule. Après le rituel de prospérité, j'ai remboursé en 8 mois et acquis un deuxième taxi." },
  { name: "Kadiatou B.", pays: "Guinée", service: "Travail", texte: "Mon supérieur sabotait mes dossiers depuis deux ans. Après le rituel de neutralisation, il a été muté le mois suivant. Mon nouveau chef m'a immédiatement valorisé." },
];

function HeroCarousel({ images, fallback }: { images: string[]; fallback: string }) {
  const [idx, setIdx] = useState(0);
  const all = images.length > 0 ? images : [fallback];

  useEffect(() => {
    if (all.length <= 1) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % all.length), 5000);
    return () => clearInterval(timer);
  }, [all.length]);

  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={all[idx]}
          alt="Cérémonie mystique"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.48 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.48 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
    </div>
  );
}

function AutoScrollTestimonials() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame: number;
    let pos = 0;
    const speed = 0.45;
    const step = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    const pause = () => cancelAnimationFrame(frame);
    const resume = () => { frame = requestAnimationFrame(step); };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, []);

  const doubled = [...temoignages, ...temoignages];

  return (
    <div
      ref={ref}
      className="flex gap-4 overflow-x-hidden cursor-default select-none"
      style={{ scrollBehavior: "auto" }}
    >
      {doubled.map((t, i) => (
        <div
          key={i}
          className="w-[300px] shrink-0 p-6 bg-background border border-white/5 relative hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-0.5 mb-3">
            {[...Array(5)].map((_, j) => <span key={j} className="text-primary text-xs">★</span>)}
          </div>
          <p className="text-muted-foreground italic mb-5 text-sm leading-relaxed line-clamp-5">"{t.texte}"</p>
          <div className="flex items-center justify-between border-t border-white/5 pt-4 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary font-serif font-bold text-xs shrink-0">
                {t.name[0]}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-xs truncate">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.pays}</div>
              </div>
            </div>
            <span className="text-xs text-primary/50 uppercase tracking-wider shrink-0 hidden sm:block">{t.service}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AutoScrollGallery({ images }: { images: string[] }) {
  const doubled = [...images, ...images];
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-3 animate-marquee" style={{ width: "max-content" }}>
        {doubled.map((img, i) => (
          <div
            key={i}
            className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] relative group overflow-hidden border border-white/10 shrink-0"
          >
            <img
              src={img}
              alt={`Cérémonie ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoSection({ videoUrl, videoTitle }: { videoUrl: string; videoTitle: string }) {
  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
    const vmMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}`;
    return url;
  };

  return (
    <section className="py-24 bg-card border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary tracking-[0.3em] uppercase text-xs font-semibold mb-4">Voyez par vous-même</p>
          <h3 className="text-4xl font-serif font-bold text-white mb-4">{videoTitle || "Le Maître en Action"}</h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">Les mots ne suffisent pas. Observez la puissance des rituels ancestraux à l'œuvre.</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video border border-white/10 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 border border-primary/20 pointer-events-none z-10" />
            <iframe
              src={getEmbedUrl(videoUrl)}
              title={videoTitle || "Rituel Maître Zonon 666"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="text-center mt-10">
          <Link href="/contact" className="inline-block px-8 py-4 bg-primary text-background font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors">
            Je veux ce résultat
          </Link>
        </div>
      </div>
    </section>
  );
}

const FALLBACK_IMAGES = [
  "/gallery-1.png", "/gallery-2.png", "/gallery-3.png",
  "/gallery-4.png", "/gallery-5.png", "/gallery-6.png",
];

export default function Home() {
  const { data: settings } = useGetSettings();
  const siteName = settings?.siteName || "Maître Zonon 666";
  const phone = settings?.phone || "+22968075372";
  const whatsapp = settings?.whatsapp || "+22968075372";
  const galleryImages = settings?.ceremonyImages?.length ? settings.ceremonyImages : FALLBACK_IMAGES;
  const heroImages = settings?.ceremonyImages?.length ? settings.ceremonyImages : FALLBACK_IMAGES;

  return (
    <div className="w-full flex flex-col items-center">

      {/* ═══ HERO ═══ */}
      <section className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden">
        <HeroCarousel images={heroImages} fallback="/hero.png" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="max-w-5xl mx-auto">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-primary tracking-[0.4em] uppercase text-xs font-semibold mb-8">
              Maître des Forces Invisibles depuis 30 ans
            </motion.p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold text-white mb-8 leading-[1.05]">
              Votre Vie<br />
              <span className="text-primary">Mérite Mieux.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-6 max-w-2xl mx-auto font-light leading-relaxed">
              {siteName} possède le don rare d'invoquer les forces mystiques ancestrales pour attirer la richesse, ramener l'être aimé et écraser les obstacles qui bloquent votre destinée.
            </p>
            <p className="text-primary/80 text-sm mb-12 font-medium tracking-wide">
              Résultats en 7 à 30 jours — Discrétion absolue — Consultation à distance disponible
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/contact" data-testid="hero-cta-contact"
                className="px-10 py-5 bg-primary text-background font-bold tracking-widest uppercase hover:bg-primary/90 transition-all text-sm shadow-lg shadow-primary/20">
                Demander un Rituel Maintenant
              </Link>
              <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="px-10 py-5 border border-white/25 text-white font-bold tracking-widest uppercase hover:border-primary hover:text-primary transition-all text-sm flex items-center justify-center gap-2">
                <MessageCircle size={16} />
                Écrire sur WhatsApp
              </a>
            </div>
            <a href={`tel:${phone}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
              <Phone size={14} />
              {phone}
            </a>
          </motion.div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-primary animate-pulse" />
          <span className="text-primary text-xs uppercase tracking-widest">Défiler</span>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="w-full bg-card border-y border-white/5 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {urgenceStats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center py-4">
                <div className="text-3xl md:text-4xl font-serif font-bold text-primary mb-1">{s.chiffre}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="py-24 w-full bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative aspect-[3/4] w-full max-w-md mx-auto">
              <div className="absolute inset-0 border border-primary/30 translate-x-4 translate-y-4" />
              {settings?.aboutImage ? (
                <img
                  src={settings.aboutImage}
                  alt={siteName}
                  className="absolute inset-0 w-full h-full object-cover object-center z-10"
                />
              ) : (
                <div className="absolute inset-0 bg-card z-10 flex items-center justify-center flex-col gap-4">
                  <div className="text-primary text-7xl font-serif opacity-20">✦</div>
                  <p className="text-muted-foreground text-xs uppercase tracking-widest text-center px-8">
                    Portrait du Maître<br />(configurable depuis l'admin)
                  </p>
                </div>
              )}
              <div className="absolute -bottom-4 -right-4 z-20 bg-primary text-background px-4 py-3 text-center">
                <div className="text-2xl font-serif font-bold">30</div>
                <div className="text-xs uppercase tracking-wider">ans de maîtrise</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-primary tracking-widest uppercase text-xs font-semibold mb-4">L'Héritier des Mystères</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white leading-tight">{siteName}</h3>
              <div className="space-y-5 text-muted-foreground leading-relaxed font-light">
                <p className="text-base">
                  Né dans une lignée de grands maîtres spirituels d'Afrique de l'Ouest, {siteName} a reçu son don dès l'enfance. À 16 ans, il accomplissait déjà ses premiers rituels. Aujourd'hui, avec plus de 30 années de pratique intense, il est reconnu comme l'un des plus puissants maîtres du continent.
                </p>
                <p className="text-base">
                  Sa spécialité absolue est le <strong className="text-white">rituel de richesse</strong> — une pratique ancestrale secrète qui brise les blocages financiers, neutralise les malédictions de pauvreté et ouvre les portes de la prospérité en 15 à 30 jours. Des milliers de personnes en Afrique et en Europe lui doivent leur fortune actuelle.
                </p>
                <blockquote className="text-white/90 border-l-2 border-primary pl-4 italic">
                  "Je ne fais pas de promesses en l'air. Je fais des rituels. Et les rituels, eux, ne mentent jamais."
                  <span className="block text-primary text-xs mt-2 not-italic uppercase tracking-widest">— {siteName}</span>
                </blockquote>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                {["Résultats en 7–30 jours", "Discrétion absolue", "Travail à distance", "Rituels personnalisés"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-white text-sm">
                    <span className="text-primary text-xs shrink-0">✦</span>{item}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/contact"
                  className="px-8 py-4 bg-primary text-background font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors text-xs">
                  Consulter le Maître
                </Link>
                <Link href="/rituels"
                  className="px-8 py-4 border border-primary/40 text-primary font-bold tracking-widest uppercase hover:bg-primary/10 transition-colors text-xs">
                  Voir les Rituels
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="py-24 w-full bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary tracking-[0.3em] uppercase text-xs font-semibold mb-4">Ce que le Maître peut faire pour vous</p>
            <h3 className="text-4xl font-serif font-bold text-white mb-4">Les Rituels Qui Changent les Destinées</h3>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Chaque situation est unique. Chaque rituel est conçu sur mesure. Les résultats sont réels et vérifiables.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                  className={`p-8 border hover:border-primary/50 transition-colors group cursor-default relative ${
                    service.urgent ? "border-primary/30 bg-primary/5" : "border-white/5 bg-background"
                  }`}>
                  {service.urgent && (
                    <div className="absolute top-3 right-3 text-xs text-primary border border-primary/30 px-2 py-0.5 uppercase tracking-widest">
                      Spécialité
                    </div>
                  )}
                  <div className="w-12 h-12 mb-6 flex items-center justify-center bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-white mb-3">{service.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
                  <Link href={`/contact?subject=${encodeURIComponent(service.title)}`}
                    className="mt-6 inline-block text-xs text-primary uppercase tracking-widest border-b border-primary/40 pb-0.5 hover:text-white hover:border-white transition-colors">
                    Demander ce rituel →
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/services"
              className="inline-block border-b border-primary text-primary hover:text-white hover:border-white transition-colors pb-1 tracking-widest uppercase text-xs">
              Voir tous les services →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ GALLERY AUTO-SCROLL (images réduites et élégantes) ═══ */}
      <section className="py-24 w-full bg-background overflow-hidden">
        <div className="container mx-auto px-4 mb-12 text-center">
          <p className="text-primary tracking-widest uppercase text-xs font-semibold mb-4">Aperçu du Sanctuaire</p>
          <h3 className="text-4xl font-serif font-bold text-white mb-4">Le Pouvoir en Action</h3>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Chaque image porte la trace d'une destinée transformée à jamais.
          </p>
        </div>
        <AutoScrollGallery images={galleryImages} />
        <div className="text-center mt-10">
          <Link href="/rituels"
            className="inline-block border-b border-primary text-primary hover:text-white hover:border-white transition-colors pb-1 tracking-widest uppercase text-xs">
            Voir tous les rituels annotés →
          </Link>
        </div>
      </section>

      {/* ═══ VIDEO SECTION (si URL configurée) ═══ */}
      {settings?.videoUrl && (
        <VideoSection videoUrl={settings.videoUrl} videoTitle={settings.videoTitle || "Le Maître en Action"} />
      )}

      {/* ═══ URGENCE STRIP ═══ */}
      <section className="w-full bg-primary/10 border-y border-primary/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-serif text-xl font-bold mb-1">Votre situation vous pèse ? Ne supportez plus.</p>
              <p className="text-muted-foreground text-sm">Des milliers ont attendu — et regretté de ne pas avoir agi plus tôt. Prenez contact maintenant.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href={`tel:${phone}`}
                className="px-6 py-3 border border-primary/50 text-primary font-bold tracking-widest uppercase text-xs hover:bg-primary/10 transition-colors flex items-center gap-2">
                <Phone size={13} />Appeler
              </a>
              <Link href="/contact"
                className="px-6 py-3 bg-primary text-background font-bold tracking-widest uppercase text-xs hover:bg-primary/90 transition-colors">
                Demander un Rituel
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS AUTO-SCROLL (cartes fixes 300px) ═══ */}
      <section className="py-24 w-full bg-card overflow-hidden">
        <div className="container mx-auto px-4 mb-12 text-center">
          <p className="text-primary tracking-widest uppercase text-xs font-semibold mb-4">Ce que disent ceux dont la vie a changé</p>
          <h3 className="text-4xl font-serif font-bold text-white mb-4">Leurs Rituels. Leurs Résultats.</h3>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Chaque témoignage décrit un rituel accompli — pas une simple consultation. La puissance du Maître s'est manifestée.
          </p>
        </div>
        <AutoScrollTestimonials />
        <div className="text-center mt-10">
          <Link href="/avis"
            className="inline-block border-b border-primary text-primary hover:text-white hover:border-white transition-colors pb-1 tracking-widest uppercase text-xs">
            Lire les 30 témoignages complets →
          </Link>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-32 w-full bg-background text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <div className="text-primary text-4xl mb-8">✦</div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Votre vie peut changer<br />
            <span className="text-primary">dès aujourd'hui.</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            Chaque jour sans agir est un jour de plus à subir ce qui peut être changé. {siteName} est prêt à commencer votre rituel. La question est : êtes-vous prêt à reprendre le contrôle de votre destin ?
          </p>
          <p className="text-muted-foreground/60 text-sm mb-12">
            Consultation confidentielle · Résultats garantis · Travail possible à distance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" data-testid="final-cta"
              className="px-10 py-5 bg-primary text-background font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors text-sm shadow-lg shadow-primary/25">
              Prendre Contact Maintenant
            </Link>
            <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
              className="px-10 py-5 border border-white/20 text-white font-bold tracking-widest uppercase hover:border-primary hover:text-primary transition-all text-sm flex items-center justify-center gap-2">
              <MessageCircle size={16} />
              WhatsApp Direct
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
