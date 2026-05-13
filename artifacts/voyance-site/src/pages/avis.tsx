import { useState } from "react";
import { motion } from "framer-motion";

const allAvis = [
  { name: "Aminata Coulibaly", pays: "Côte d'Ivoire", service: "Rituel de richesse", note: 5, texte: "Avant de consulter Maître Séraphin, j'avais des dettes qui s'accumulaient depuis des années. Trois semaines après le rituel, j'ai reçu un appel d'un investisseur qui voulait financer mon projet. Aujourd'hui, mon commerce tourne à merveille. Je suis éternellement reconnaissante." },
  { name: "Moussa Traoré", pays: "Burkina Faso", service: "Rituel de richesse", note: 5, texte: "Ma boutique ne vendait plus rien depuis 8 mois. Après la consultation, une grande entreprise m'a contacté pour un contrat d'approvisionnement. Je n'y croyais plus mais le Maître avait promis des résultats. Il a tenu parole." },
  { name: "Fatoumata Diallo", pays: "Guinée", service: "Retour affectif", note: 5, texte: "Mon mari était parti avec une autre femme. J'avais essayé tout ce que je pouvais. En 9 jours après le travail du Maître, il est revenu à la maison en pleurant. Il dit qu'il ne sait pas ce qui lui avait pris. Notre famille est réunie." },
  { name: "Ibrahima Sow", pays: "Sénégal", service: "Protection spirituelle", note: 5, texte: "Des ennemis me nuisaient dans mon travail. Je perdais des marchés, mes employés partaient. Depuis la protection du Maître, tout a changé. Mes affaires prospèrent et ceux qui voulaient ma perte ont disparu d'eux-mêmes." },
  { name: "Awa Konaté", pays: "Mali", service: "Infertilité", note: 5, texte: "Six ans de mariage sans enfant. Les médecins ne trouvaient rien. Maître Séraphin a identifié un blocage spirituel. Quatre mois après le rituel, j'étais enceinte. Ma petite fille a maintenant deux ans. Je remercie le ciel chaque jour." },
  { name: "Seydou Ouédraogo", pays: "Burkina Faso", service: "Problèmes de travail", note: 5, texte: "J'étais bloqué au même poste depuis 7 ans pendant que des moins compétents étaient promus. Le Maître a vu la jalousie qui m'entourait. Deux mois après, j'ai eu ma promotion et une augmentation que je n'osais même pas demander." },
  { name: "Kadiatou Bah", pays: "Guinée", service: "Rituel de richesse", note: 5, texte: "Je vendais du tissu au marché et je n'arrivais pas à m'en sortir. Après le rituel, j'ai eu l'idée de créer ma boutique en ligne. En moins d'un an, je vends maintenant dans toute l'Afrique de l'Ouest. Le Maître a réveillé ma chance." },
  { name: "Adama Keïta", pays: "Côte d'Ivoire", service: "Retour affectif", note: 5, texte: "Ma femme était partie avec les enfants chez sa famille. Elle ne voulait plus entendre parler de moi. En deux semaines, elle m'a appelé d'elle-même pour qu'on se parle. Nous nous sommes réconciliés et notre couple est aujourd'hui béni." },
  { name: "Mariam Sanogo", pays: "Mali", service: "Chance et succès", note: 5, texte: "J'avais raté mon concours trois fois. Le Maître a travaillé sur ma chance. À la quatrième tentative, j'ai eu le meilleur score de ma promotion. Je suis maintenant fonctionnaire d'État. Ma famille n'en croit pas ses yeux." },
  { name: "Oumar Ndiaye", pays: "Sénégal", service: "Problèmes financiers", note: 5, texte: "J'avais emprunté de l'argent et je ne pouvais pas rembourser. Mes créanciers me menaçaient. Après la consultation, j'ai trouvé un travail bien rémunéré et remboursé toutes mes dettes en 4 mois. Le Maître est un vrai libérateur." },
  { name: "Djénéba Camara", pays: "Guinée", service: "Envoûtement", note: 5, texte: "Je faisais des cauchemars chaque nuit, je tombais malade sans raison. Les médecins ne comprenaient rien. Le Maître a décelé un envoûtement fait par une cousine jalouse. Depuis le désenvoûtement, je dors en paix et je suis en pleine santé." },
  { name: "Boubacar Diarra", pays: "Mali", service: "Rituel de richesse", note: 5, texte: "J'avais tout perdu dans une affaire qui avait mal tourné. Je vivais chez un ami. En trois mois après le rituel du Maître, j'ai eu une opportunité incroyable qui m'a permis de repartir de zéro. Aujourd'hui j'ai ma propre maison." },
  { name: "Rokia Coulibaly", pays: "Burkina Faso", service: "Mariage et séduction", note: 5, texte: "J'avais 38 ans et je n'avais toujours pas trouvé de mari. Ma famille commençait à désespérer. Six semaines après la consultation, j'ai rencontré un homme sérieux qui m'a demandée en mariage. Notre cérémonie a eu lieu il y a trois mois." },
  { name: "Lamine Touré", pays: "Sénégal", service: "Problèmes de couple", note: 5, texte: "Ma femme et moi nous disputions tous les jours. Il y avait une force malveillante dans notre foyer. Le Maître a fait le travail de purification. Depuis, notre maison est un lieu de paix. Nos enfants nous disent qu'ils sont heureux." },
  { name: "Hawa Traoré", pays: "Côte d'Ivoire", service: "Infertilité", note: 5, texte: "Mon mari voulait prendre une deuxième femme parce que je n'avais pas d'enfant. J'étais désespérée. Maître Séraphin a trouvé la cause spirituelle de mon infertilité. Six mois plus tard, je portais des jumeaux. Mon mari a renoncé à son projet." },
  { name: "Abdoulaye Balde", pays: "Guinée", service: "Rituel de richesse", note: 5, texte: "Je travaillais dur mais l'argent ne restait jamais. Tout ce que je gagnais disparaissait. Le Maître a brisé la malédiction financière sur ma lignée. Depuis, je réussis tout ce que j'entreprends. Ma famille vit dans la prospérité." },
  { name: "Salimata Barry", pays: "Guinée", service: "Protection spirituelle", note: 5, texte: "On m'avait jeté un sort au village pour que mon commerce échoue. Je ne comprenais pas pourquoi tout allait mal malgré mes efforts. La protection du Maître a tout changé. Aujourd'hui je suis la commerçante la plus prospère du quartier." },
  { name: "Cheikh Dieng", pays: "Sénégal", service: "Chance et succès", note: 5, texte: "J'avais soumis des dizaines de dossiers pour obtenir un visa et travailler en Europe. Tout était refusé. Après le travail du Maître, mon visa a été accordé en une semaine. Je suis maintenant installé et j'envoie de l'argent à ma famille." },
  { name: "Oumou Coulibaly", pays: "Mali", service: "Retour affectif", note: 5, texte: "Mon fiancé avait rompu nos fiançailles sous l'influence de sa famille. J'étais brisée. En deux semaines de travail spirituel, il est revenu contre l'avis de sa famille et nous nous sommes mariés. Sa famille nous accepte maintenant." },
  { name: "Issouf Sawadogo", pays: "Burkina Faso", service: "Rituel de richesse", note: 5, texte: "J'avais un projet de transport mais je n'arrivais pas à obtenir le financement. Après le rituel, une banque m'a accordé un prêt que j'avais pourtant demandé en vain depuis deux ans. Je possède maintenant une flotte de cinq bus." },
  { name: "Ndeye Fatou Mbaye", pays: "Sénégal", service: "Maladies inexpliquées", note: 5, texte: "Mon fils de 12 ans perdait du poids et refusait de manger. Les examens médicaux ne montraient rien. Le Maître a vu qu'un voisin lui avait envoyé le mauvais œil. Après le rituel, mon fils a retrouvé l'appétit et la joie de vivre en quelques jours." },
  { name: "Mamadou Kouyaté", pays: "Guinée", service: "Problèmes de travail", note: 5, texte: "Mon supérieur me rendait la vie impossible. Chaque rapport que je remettais était critiqué, chaque initiative sabotée. Le Maître a neutralisé les forces négatives autour de moi. Mon supérieur a été muté et mon nouveau chef me fait confiance." },
  { name: "Aminata Bamba", pays: "Côte d'Ivoire", service: "Rituel de richesse", note: 5, texte: "Commerçante depuis 10 ans, je stagnais. Après la consultation, j'ai eu l'idée d'exporter mes produits. Maintenant je travaille avec des acheteurs au Ghana et au Togo. Mon chiffre d'affaires a triplé en moins d'un an. Merci infiniment." },
  { name: "Babacar Niang", pays: "Sénégal", service: "Protection spirituelle", note: 5, texte: "Des marabouts m'avaient dit que quelqu'un voulait ma mort. Je sentais une présence mauvaise. La protection de Maître Séraphin a agi comme un bouclier. Un accident m'a épargné de justesse. Je suis convaincu que c'est grâce à lui." },
  { name: "Coumba Diallo", pays: "Sénégal", service: "Voyance", note: 5, texte: "Le Maître a vu des choses de ma vie passée que personne ne pouvait connaître. Ses prévisions sur mon avenir se sont réalisées avec une précision troublante. Sa voyance m'a aidée à prendre les bonnes décisions à des moments cruciaux." },
  { name: "Drissa Koné", pays: "Côte d'Ivoire", service: "Rituel de richesse", note: 5, texte: "J'avais été escroqué de toutes mes économies. Je pensais que c'était fini. Maître Séraphin a non seulement retourné la chance en ma faveur, mais les escrocs ont été arrêtés et j'ai récupéré une partie de mon argent. Du jamais vu." },
  { name: "Ramata Ouattara", pays: "Burkina Faso", service: "Couple", note: 5, texte: "Mon époux était sous l'emprise d'une femme qui voulait détruire notre foyer. Il ne me voyait plus, ne s'occupait plus des enfants. Après le travail du Maître, il a rompu avec cette femme et est revenu à la maison. Notre famille est sauvée." },
  { name: "Souleymane Cissé", pays: "Mali", service: "Rituel de richesse", note: 5, texte: "Chauffeur de taxi depuis quinze ans, je rêvais de posséder ma propre voiture. Après le rituel de prospérité, un client régulier m'a proposé de m'associer dans son affaire. En six mois, j'ai remboursé ma part et je possède maintenant deux véhicules." },
  { name: "Binta Kouyaté", pays: "Guinée", service: "Infertilité", note: 5, texte: "Mon mari et moi avions fait tous les tests. Les médecins disaient que nous étions tous les deux fertiles sans comprendre pourquoi je ne tombais pas enceinte. C'était un blocage spirituel. Maître Séraphin l'a levé. J'ai accouché il y a trois mois." },
  { name: "Youssouf Dao", pays: "Côte d'Ivoire", service: "Chance et succès", note: 5, texte: "J'avais passé un entretien d'embauche dans une grande entreprise mais une autre personne avait été choisie. Le Maître a travaillé et cette personne a refusé le poste. L'entreprise m'a rappelé et j'ai été recruté. Mon salaire a quadruplé." },
];

export default function Avis() {
  const [filtre, setFiltre] = useState("Tous");
  const services = ["Tous", "Rituel de richesse", "Retour affectif", "Protection spirituelle", "Infertilité", "Problèmes de travail", "Chance et succès", "Couple", "Mariage et séduction", "Envoûtement", "Maladies inexpliquées", "Problèmes financiers", "Voyance"];

  const filtres = filtre === "Tous" ? allAvis : allAvis.filter(a => a.service === filtre);

  return (
    <div className="w-full min-h-screen bg-background">
      <section className="pt-32 pb-16 text-center border-b border-white/5 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/3 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary tracking-[0.3em] uppercase text-xs font-semibold mb-4"
          >
            Paroles de Vérité
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold text-white mb-6"
          >
            Ils ont Vécu le Miracle
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto font-light"
          >
            Des milliers de vies transformées. Voici ce que disent ceux qui ont osé franchir le pas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 mt-10"
          >
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-primary">30 000+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Cas résolus</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-primary">98%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Satisfaction</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-primary">30+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Années d'expérience</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 border-b border-white/5 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {services.map((s) => (
              <button
                key={s}
                onClick={() => setFiltre(s)}
                data-testid={`filter-${s}`}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold border transition-colors ${
                  filtre === s
                    ? "border-primary bg-primary text-background"
                    : "border-white/10 text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtres.map((avis, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.05 }}
                className="bg-card border border-white/5 p-8 relative hover:border-primary/30 transition-colors"
                data-testid={`avis-card-${i}`}
              >
                <div className="text-primary text-5xl font-serif absolute top-4 right-6 opacity-10 select-none">"</div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(avis.note)].map((_, j) => (
                    <span key={j} className="text-primary text-sm">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground italic leading-relaxed mb-6 text-sm relative z-10">
                  "{avis.texte}"
                </p>
                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-serif font-bold text-sm">
                      {avis.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{avis.name}</div>
                      <div className="text-xs text-muted-foreground">{avis.pays}</div>
                    </div>
                  </div>
                  <span className="text-xs text-primary/70 uppercase tracking-wider border border-primary/20 px-2 py-1">
                    {avis.service}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card border-t border-white/5 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Votre témoignage sera le prochain.</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Rejoignez les milliers de personnes dont la vie a été transformée par la puissance mystique de Maître Séraphin.
          </p>
          <a href="/contact" className="inline-block px-10 py-4 bg-primary text-background font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors">
            Demander une Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
