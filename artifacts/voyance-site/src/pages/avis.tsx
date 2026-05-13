import { useState } from "react";
import { motion } from "framer-motion";

const allAvis = [
  {
    name: "Aminata Coulibaly", pays: "Côte d'Ivoire", service: "Rituel de richesse", note: 5,
    texte: "J'avais des dettes depuis 4 ans et mon commerce mourait. Après ma consultation, le Maître a identifié un blocage financier placé par un concurrent jaloux. Il a réalisé le rituel de richesse sur 7 nuits consécutives. La 3ème semaine après le rituel, un investisseur m'a contactée sans raison apparente. Aujourd'hui, j'ai remboursé toutes mes dettes et mon chiffre d'affaires a triplé."
  },
  {
    name: "Moussa Traoré", pays: "Burkina Faso", service: "Rituel de richesse", note: 5,
    texte: "Ma boutique était déserte depuis 8 mois malgré tous mes efforts. La consultation a révélé que quelqu'un avait enterré quelque chose près de ma porte. Après le rituel de destruction du sort et le rituel d'attraction de clientèle, les clients ont commencé à affluer le 10ème jour. Un mois plus tard, une grande société me contactait pour un contrat d'approvisionnement."
  },
  {
    name: "Fatoumata Diallo", pays: "Guinée", service: "Retour affectif", note: 5,
    texte: "Mon mari m'avait quittée pour une autre femme depuis 11 mois. Le Maître a réalisé le rituel de retour affectif avec une photo et des éléments personnels. Le 9ème jour après le début du rituel, mon mari m'a appelée en pleurant, disant qu'il ne comprenait pas ce qui lui était arrivé. Il a rompu avec l'autre femme et est revenu au foyer. Notre couple est aujourd'hui plus fort qu'avant."
  },
  {
    name: "Ibrahima Sow", pays: "Sénégal", service: "Protection spirituelle", note: 5,
    texte: "Des ennemis avaient placé un sort sur mon entreprise. Je perdais des marchés inexplicablement et mes employés tombaient malades. Après le rituel de désenvoûtement et la mise en place de la protection permanente, tout a changé en moins de deux semaines. Les ennemis qui me nuisaient ont connu de graves problèmes d'eux-mêmes."
  },
  {
    name: "Awa Konaté", pays: "Mali", service: "Infertilité spirituelle", note: 5,
    texte: "Six ans de mariage sans enfant. Les médecins ne trouvaient rien de médical. La consultation a révélé un sort d'infertilité posé par une belle-sœur jalouse. Le Maître a réalisé un rituel de purification de la matrice sur 3 nuits, suivi d'un rituel de fertilité ancestral. Quatre mois après ces rituels, j'étais enceinte. J'ai accouché de jumeaux en parfaite santé."
  },
  {
    name: "Seydou Ouédraogo", pays: "Burkina Faso", service: "Problèmes de travail", note: 5,
    texte: "Bloqué au même poste depuis 7 ans malgré mes compétences. La consultation a révélé un envoûtement de blocage professionnel. Après le rituel de déblocage et d'attraction de chance au travail, mon supérieur m'a convoqué deux mois plus tard pour m'annoncer une promotion que même mes collègues plus anciens n'avaient pas obtenue."
  },
  {
    name: "Kadiatou Bah", pays: "Guinée", service: "Rituel de richesse", note: 5,
    texte: "Je vendais du tissu au marché et ne pouvais même pas payer mon loyer. Après le rituel d'abondance financière sur 5 nuits, j'ai eu l'idée et le courage de créer une boutique en ligne. L'argent nécessaire s'est présenté de manière inattendue. En moins d'un an, je livre dans toute l'Afrique de l'Ouest."
  },
  {
    name: "Adama Keïta", pays: "Côte d'Ivoire", service: "Retour affectif", note: 5,
    texte: "Ma femme était partie chez ses parents avec les enfants, décidée à divorcer. Le Maître a effectué le rituel de réconciliation conjugale. La 2ème semaine, ma femme m'a appelé d'elle-même pour parler. Nous nous sommes revus, et à sa grande surprise à elle, ses sentiments sont revenus entièrement. Elle dit elle-même ne pas comprendre ce qui s'est passé."
  },
  {
    name: "Mariam Sanogo", pays: "Mali", service: "Chance et succès", note: 5,
    texte: "J'avais raté le concours d'entrée à la fonction publique trois fois de suite. La consultation a révélé que j'étais victime du mauvais œil d'un oncle jaloux. Après le rituel de protection et d'ouverture de chance, j'ai passé le concours une quatrième fois. J'ai eu le meilleur score de ma promotion. Je suis maintenant inspecteur des impôts."
  },
  {
    name: "Oumar Ndiaye", pays: "Sénégal", service: "Problèmes financiers", note: 5,
    texte: "Des dettes accumulées m'étouffaient et mes créanciers me menaçaient chaque jour. La consultation a révélé une malédiction financière héritée de ma lignée. Le rituel de levée de malédiction a été réalisé sur 9 nuits. Dans les 30 jours qui ont suivi, j'ai trouvé un emploi très bien rémunéré et remboursé toutes mes dettes en 4 mois."
  },
  {
    name: "Djénéba Camara", pays: "Guinée", service: "Désenvoûtement", note: 5,
    texte: "Des cauchemars chaque nuit, des maladies sans diagnostic médical, une fatigue permanente. Le Maître a détecté un puissant envoûtement fait par une cousine. Le rituel de désenvoûtement et de retournement du sort a duré 3 nuits. Dès la première nuit, j'ai dormi comme jamais depuis des années. En une semaine, tous les symptômes avaient disparu."
  },
  {
    name: "Boubacar Diarra", pays: "Mali", service: "Rituel de richesse", note: 5,
    texte: "J'avais tout perdu dans une mauvaise affaire : maison, voiture, argent. Je logeais chez un ami. Le rituel de reconstruction financière a été réalisé sur 7 nuits. En trois mois, une opportunité commerciale inattendue s'est présentée. Aujourd'hui j'ai ma propre maison et j'emploie 5 personnes."
  },
  {
    name: "Rokia Coulibaly", pays: "Burkina Faso", service: "Mariage et séduction", note: 5,
    texte: "À 38 ans, sans mari, ma famille avait perdu espoir. La consultation a révélé un sort de solitude posé par une rivale. Le rituel d'attraction amoureuse a été réalisé. Six semaines après, j'ai rencontré un homme sérieux et établi dans une circonstance totalement inattendue. Il m'a demandée en mariage 3 mois plus tard."
  },
  {
    name: "Lamine Touré", pays: "Sénégal", service: "Couple", note: 5,
    texte: "Mon épouse et moi nous disputions violemment chaque jour depuis deux ans. La consultation a révélé la présence d'une entité mauvaise dans notre foyer, envoyée par une ex. Le rituel de purification du foyer et d'harmonie conjugale a tout changé. En une semaine, l'atmosphère dans notre maison était transformée. Nos enfants nous ont dit qu'ils étaient heureux à nouveau."
  },
  {
    name: "Hawa Traoré", pays: "Côte d'Ivoire", service: "Infertilité spirituelle", note: 5,
    texte: "Mon mari voulait prendre une deuxième femme car nous n'avions pas d'enfant après 8 ans. Un bilan médical confirmait que nous étions tous les deux fertiles sans explication. Le rituel de levée de blocage de grossesse a été réalisé. Six mois plus tard, j'étais enceinte de jumeaux. Mon mari a renoncé définitivement à son projet de deuxième mariage."
  },
  {
    name: "Abdoulaye Baldé", pays: "Guinée", service: "Rituel de richesse", note: 5,
    texte: "L'argent ne restait jamais entre mes mains. Je gagnais et je dépensais sans m'en rendre compte, comme si une force me forçait à tout perdre. La consultation a confirmé une malédiction de pauvreté placée sur ma famille il y a deux générations. Le rituel de rupture de malédiction a libéré ma prospérité. Depuis, je réussis tout ce que j'entreprends."
  },
  {
    name: "Salimata Barry", pays: "Guinée", service: "Protection spirituelle", note: 5,
    texte: "Mon commerce périclitait malgré des années d'expérience. La consultation a révélé qu'on m'avait jeté un sort au village pour que mes affaires échouent. Après le rituel de protection et de retournement, non seulement mon commerce a redémarré, mais la personne qui m'avait envoûtée a connu de graves ennuis sans que je l'aie jamais su avant."
  },
  {
    name: "Cheikh Dieng", pays: "Sénégal", service: "Chance et succès", note: 5,
    texte: "J'avais soumis 14 demandes de visa pour travailler à l'étranger. Tout était refusé sans raison valable. Le Maître a réalisé un rituel d'ouverture de portes et d'attraction de chance administrative. Ma demande suivante a été acceptée en 5 jours. Je suis aujourd'hui établi, je travaille et j'envoie régulièrement de l'argent à ma famille au Sénégal."
  },
  {
    name: "Oumou Coulibaly", pays: "Mali", service: "Retour affectif", note: 5,
    texte: "Mon fiancé avait brutalement rompu nos fiançailles sous la pression de sa mère qui m'avait en horreur. J'étais dévastée. Le Maître a réalisé le rituel de retour affectif sur 14 nuits avec travail de neutralisation de l'influence maternelle. Mon ex-fiancé est revenu deux semaines après, contre toute attente et contre la volonté de sa mère. Nous sommes aujourd'hui mariés."
  },
  {
    name: "Issouf Sawadogo", pays: "Burkina Faso", service: "Rituel de richesse", note: 5,
    texte: "Je rêvais de créer une entreprise de transport mais chaque tentative d'obtenir un financement échouait. La consultation a révélé un blocage de prospérité. Après le rituel d'attraction de financement et de chance en affaires, une banque qui m'avait refusé par deux fois m'a accordé le prêt en moins d'un mois. Je possède aujourd'hui une flotte de 5 bus."
  },
  {
    name: "Ndeye Fatou Mbaye", pays: "Sénégal", service: "Maladies inexpliquées", note: 5,
    texte: "Mon fils de 12 ans perdait du poids chaque semaine. Tous les examens médicaux étaient normaux. Les médecins étaient perplexes. La consultation a révélé que mon voisin lui avait envoyé un sort de dépérissement. Après le rituel de purification et de guérison spirituelle, mon fils a retrouvé l'appétit et la vitalité en moins de 10 jours. Il a même grossi."
  },
  {
    name: "Mamadou Kouyaté", pays: "Guinée", service: "Problèmes de travail", note: 5,
    texte: "Mon supérieur me persécutait depuis deux ans, sabotant mes dossiers et me calomniant auprès de la direction. Le rituel de neutralisation des ennemis professionnels a été réalisé sur 5 nuits. Mon supérieur a été muté dans une autre ville le mois suivant pour des raisons qui ne me concernaient pas. Mon nouveau chef est bienveillant et m'a immédiatement valorisé."
  },
  {
    name: "Aminata Bamba", pays: "Côte d'Ivoire", service: "Rituel de richesse", note: 5,
    texte: "Commerçante depuis 12 ans, je stagnais malgré mon sérieux. Après le rituel d'expansion commerciale et d'attraction de nouveaux marchés, l'idée d'exporter mes produits m'est venue comme une évidence. Tout s'est enchaîné naturellement. En 8 mois, je travaille avec des acheteurs au Ghana, au Togo et au Bénin. Mon bénéfice net a été multiplié par 4."
  },
  {
    name: "Babacar Niang", pays: "Sénégal", service: "Protection spirituelle", note: 5,
    texte: "Un marabout m'avait averti que ma vie était en danger. Je ne prenais pas cela au sérieux jusqu'à ce que je frôle un accident grave deux fois en une semaine. La protection de Maître Zonon a été mise en place après un rituel de 3 nuits. Depuis lors, je sens littéralement une présence protectrice. Trois ans ont passé sans le moindre incident."
  },
  {
    name: "Coumba Diallo", pays: "Sénégal", service: "Voyance", note: 5,
    texte: "Je suis venue sceptique. Le Maître a décrit avec une précision troublante des événements de mon passé que personne ne pouvait connaître. Ses prévisions sur mon avenir professionnel se sont réalisées dans les 4 mois. Grâce à ses conseils, j'ai évité une association commerciale qui s'est révélée frauduleuse par la suite."
  },
  {
    name: "Drissa Koné", pays: "Côte d'Ivoire", service: "Rituel de richesse", note: 5,
    texte: "Des escrocs m'avaient dépouillé de toutes mes économies. J'étais ruiné. Le rituel de retournement et de justice spirituelle a été réalisé. Non seulement mes affaires ont repris rapidement, mais les escrocs ont été arrêtés par la police dans les mois suivants et condamnés à rembourser leurs victimes. J'ai récupéré une partie de mon argent."
  },
  {
    name: "Ramata Ouattara", pays: "Burkina Faso", service: "Couple", note: 5,
    texte: "Mon époux avait été envoûté par une rivale qui voulait détruire notre foyer. Il ne me reconnaissait plus, ne s'occupait plus des enfants, donnait tout son argent à cette femme. Le Maître a réalisé le rituel de rupture d'envoûtement en 7 nuits. Mon mari s'est réveillé comme d'un mauvais rêve. Il a lui-même rompu avec la rivale et est revenu à nous."
  },
  {
    name: "Souleymane Cissé", pays: "Mali", service: "Rituel de richesse", note: 5,
    texte: "Chauffeur de taxi depuis 15 ans, je ne pouvais pas acheter mon propre véhicule. Le rituel de prospérité et d'attraction de chance financière a tout changé. Dans les 6 semaines après le rituel, un client régulier m'a proposé une association pour racheter son véhicule à crédit. En 8 mois, j'ai remboursé et acquis un deuxième taxi."
  },
  {
    name: "Binta Kouyaté", pays: "Guinée", service: "Infertilité spirituelle", note: 5,
    texte: "Mon mari et moi avions fait tous les bilans médicaux possibles — tout était normal. L'infertilité restait inexpliquée après 4 ans. La consultation a détecté un blocage de matrice posé par jalousie familiale. Le rituel de purification et de fertilité a duré 9 nuits. Trois mois après, j'étais enceinte. J'ai accouché d'un garçon en bonne santé."
  },
  {
    name: "Youssouf Dao", pays: "Côte d'Ivoire", service: "Chance et succès", note: 5,
    texte: "J'avais passé un entretien pour un poste très convoité et une autre personne avait été sélectionnée. Après le rituel d'ouverture de chance, l'entreprise m'a rappelé 3 semaines plus tard : la personne recrutée avait décliné l'offre. J'ai été pris immédiatement. Mon salaire a été multiplié par 5 par rapport à mon emploi précédent."
  },
];

export default function Avis() {
  const [filtre, setFiltre] = useState("Tous");
  const services = [
    "Tous", "Rituel de richesse", "Retour affectif", "Protection spirituelle",
    "Infertilité spirituelle", "Problèmes de travail", "Chance et succès",
    "Couple", "Mariage et séduction", "Désenvoûtement", "Maladies inexpliquées",
    "Problèmes financiers", "Voyance"
  ];
  const filtres = filtre === "Tous" ? allAvis : allAvis.filter(a => a.service === filtre);

  return (
    <div className="w-full min-h-screen bg-background">
      <section className="pt-32 pb-16 text-center border-b border-white/5 bg-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 65%)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-primary tracking-[0.3em] uppercase text-xs font-semibold mb-4">
            Paroles de Vérité
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
            Ils ont Vécu le Miracle
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Des rituels accomplis. Des vies transformées. Ces témoignages sont réels — leurs vies ne seront plus jamais les mêmes.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-primary">30 000+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Rituels accomplis</div>
            </div>
            <div className="w-px h-12 bg-white/10 hidden sm:block" />
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-primary">98%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Satisfaction garantie</div>
            </div>
            <div className="w-px h-12 bg-white/10 hidden sm:block" />
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-primary">30+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Années de maîtrise</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 border-b border-white/5 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {services.map((s) => (
              <button key={s} onClick={() => setFiltre(s)} data-testid={`filter-${s}`}
                className={`px-3 py-1.5 text-xs uppercase tracking-widest font-semibold border transition-colors ${filtre === s ? "border-primary bg-primary text-background" : "border-white/10 text-muted-foreground hover:border-primary/50 hover:text-primary"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtres.map((avis, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.04 }}
                className="bg-card border border-white/5 p-7 relative hover:border-primary/30 transition-colors group" data-testid={`avis-card-${i}`}>
                <div className="text-primary text-5xl font-serif absolute top-3 right-5 opacity-10 select-none">"</div>
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(avis.note)].map((_, j) => <span key={j} className="text-primary text-xs">★</span>)}
                </div>
                <p className="text-muted-foreground italic leading-relaxed mb-5 text-sm relative z-10">"{avis.texte}"</p>
                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-serif font-bold text-sm">{avis.name[0]}</div>
                    <div>
                      <div className="font-bold text-white text-sm">{avis.name}</div>
                      <div className="text-xs text-muted-foreground">{avis.pays}</div>
                    </div>
                  </div>
                  <span className="text-xs text-primary/60 uppercase tracking-wider border border-primary/15 px-2 py-0.5 hidden sm:block">{avis.service}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card border-t border-white/5 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Votre destin sera le prochain à changer.</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">Chaque témoignage que vous venez de lire a commencé par un simple acte de courage : prendre contact.</p>
          <a href="/contact" className="inline-block px-10 py-4 bg-primary text-background font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors">
            Demander un Rituel
          </a>
        </div>
      </section>
    </div>
  );
}
