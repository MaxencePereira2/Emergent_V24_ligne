// Nouveaux contenus de projets détaillés
const newProjectsData = {
    "1-optimisation-du-temps-de-fabrication-descalier-en-acier": {
        title: "Optimisation du temps de fabrication d'escaliers en acier",
        summary: "Industrialisation d'un atelier d'escaliers acier sans perte de qualité : standardisation, outillage, procédures et flux. Fabrication artisanale d'escaliers sur-mesure ; besoin d'augmenter le débit et de fiabiliser la production.",
        client: "Atelier de métallerie (sur-mesure)",
        images: [
            "assets/projets/1-optimisation-du-temps-de-fabrication-descalier-en-acier/1a.png",
            "assets/projets/1-optimisation-du-temps-de-fabrication-descalier-en-acier/2a.png",
            "assets/projets/1-optimisation-du-temps-de-fabrication-descalier-en-acier/3a.png",
            "assets/projets/1-optimisation-du-temps-de-fabrication-descalier-en-acier/4a.png",
            "assets/projets/1-optimisation-du-temps-de-fabrication-descalier-en-acier/5a.png"
        ],
        key_points: [
            "Standardisation du dossier technique (gabarits CAO des limons, repères de perçage)",
            "Optimisation des imbrications de découpe laser pour réduire les chutes",
            "Conception orientée pliage CNC (prises de référence, tolérances, séquences)",
            "Conception d'un marbre 2 × 4 m pour mise en position en une seule prise",
            "Revue des modes opératoires et rédaction de procédures de soudage TIG/MIG"
        ],
        technologies: "Industrialisation, Conception mécanique, DFMA, Soudage TIG/MIG, Outillage d'assemblage",
        results: "Temps de fabrication réduit de 20 h à 8 h (−60 %, ×2,5 de débit)<br>Coût de production total −61 %<br>Masse −32 % (manutention et pose simplifiées)<br>Réduction des non-conformités et des reprises<br>Flux atelier fluidifiés par la standardisation",
        duration: "12 jours — 3 mois",
        phases: "Audit<br>CAO & outillage<br>Pilote atelier<br>Accompagnement premières séries"
    },
    "2-fabrication-dune-ligne-de-production": {
        title: "Conception & mise en service d'une première ligne de production low-tech",
        summary: "Presse statique 40 t + chariot d'interface et outillages dédiés ; architecture low-tech robuste, maintenance simple. Démarrage industriel sans énergie motorisée : priorité à la robustesse, la sécurité et la disponibilité.",
        client: "Startup (industrialisation initiale)",
        images: [
            "assets/projets/2-fabrication-dune-ligne-de-production/1b.jpg",
            "assets/projets/2-fabrication-dune-ligne-de-production/2b.jpg",
            "assets/projets/2-fabrication-dune-ligne-de-production/3b.jpg",
            "assets/projets/2-fabrication-dune-ligne-de-production/4b.png",
            "assets/projets/2-fabrication-dune-ligne-de-production/5b.png",
            "assets/projets/2-fabrication-dune-ligne-de-production/6b.png"
        ],
        key_points: [
            "Co-rédaction du cahier des charges fonctionnel et technique",
            "Études de variantes chiffrées (TCO, risques, délais)",
            "CAO + calculs statiques/dynamiques",
            "Découpe laser, usinage, pliage, ajustage",
            "Soudage TIG/MAG, montage à blanc, essais, formation",
            "Livraison et documentation d'exploitation"
        ],
        technologies: "Conception mécanique, DFMA, AMDEC, Ergonomie & sécurité machine",
        results: "Ligne opérationnelle depuis fin 2024<br>Pressage jusqu'à 40 t conforme aux spécifications<br>Cahier des charges et délais tenus<br>Lancement des premières productions",
        duration: "52 jours",
        phases: "Cahier des charges & variantes : 10 j<br>CAO & calculs : 21 j<br>Fabrication : 17 j<br>Mise en service & formation : 4 j"
    },
    "3-dveloppement-dun-cadre-de-vtt-de-descente": {
        title: "Développement d'un cadre de VTT de descente (DH) – acier 25CD4S",
        summary: "Cinématique optimisée, DFMA et gammes de fabrication ; gabarits, reprises après soudure et qualification procédés. Premier cadre DH conçu et fabriqué en France ; contrainte coût/industrialisation élevée.",
        client: "Startup cycles (October Bike)",
        materials: "Acier 25CD4S (Cr-Mo)",
        images: [
            "assets/projets/3-dveloppement-dun-cadre-de-vtt-de-descente/1c.png",
            "assets/projets/3-dveloppement-dun-cadre-de-vtt-de-descente/2c.png",
            "assets/projets/3-dveloppement-dun-cadre-de-vtt-de-descente/3c.JPG",
            "assets/projets/3-dveloppement-dun-cadre-de-vtt-de-descente/4c.JPG",
            "assets/projets/3-dveloppement-dun-cadre-de-vtt-de-descente/5c.png",
            "assets/projets/3-dveloppement-dun-cadre-de-vtt-de-descente/6c.png",
            "assets/projets/3-dveloppement-dun-cadre-de-vtt-de-descente/7c.JPG"
        ],
        key_points: [
            "Itérations CAO cinématique (ratios de compression, fin de course, maintien en milieu de course)",
            "Cost-to-design : choix de cinématique vs coûts d'outillage/fabrication",
            "Rédaction des gammes et choix procédés (grugeage, chambrage, TIG)",
            "Outillage one-shot low-cost pour prototypage",
            "Calculs mécaniques (statique & pseudo-dynamique), prévention ZAT, optimisation cordons",
            "Mise en production : gabarits, usinage tour/fraiseuse (conv. + CNC), reprises après soudure",
            "Boucles rapides terrain ↔ CAO ↔ fabrication"
        ],
        technologies: "Conception mécano-soudée, Prototypage rapide, Qualification soudure, DFMEA",
        results: "100% produit en France<br>Livraison en 66 jours",
        duration: "66 jours"
    },
    "4-conception-et-fabrication-dune-cintreuse-galets-manuelle": {
        title: "Conception & fabrication d'une cintreuse à galets manuelle",
        summary: "Outillage de cintrage à froid économique et robuste, jusqu'au carré 16 × 16. Besoin d'un outillage simple, fiable et peu coûteux pour cintrage à froid de profils acier.",
        client: "Atelier fabrication / outillage",
        images: [
            "assets/projets/4-conception-et-fabrication-dune-cintreuse-galets-manuelle/1d.jpeg",
            "assets/projets/4-conception-et-fabrication-dune-cintreuse-galets-manuelle/2d.jpeg",
            "assets/projets/4-conception-et-fabrication-dune-cintreuse-galets-manuelle/3d.jpeg"
        ],
        key_points: [
            "CAO orientée cost-to-design (standardisation, tolérances réalistes)",
            "Mise en fabrication : découpe laser + tournage des galets/axes",
            "Essais et ajustements (géométrie, effort opérateur)",
            "Livraison avec fiche d'utilisation/maintenance"
        ],
        technologies: "Conception mécanique, Outillage, Fabrication unitaire",
        results: "Cahier des charges respecté<br>Coût maîtrisé<br>Cintrage à froid jusqu'au carré 16 × 16",
        duration: "1 jour",
        phases: "CAO : 0,5 j<br>Fabrication : 0,5 j"
    },
    "5-preuve-de-concept-impression-3d-metal-par-conduction": {
        title: "Preuve de concept — Impression 3D métal par conduction (type FDM)",
        summary: "Extrusion métallique par conduction thermique ; validation expérimentale avec buse Ø 0,4 mm et cadrage IP. Démontrer la faisabilité d'une extrusion métal par conduction pour sécuriser un tour de financement.",
        client: "R&D / levée de fonds",
        ip: "Brevet déposé",
        images: [
            "assets/projets/5-preuve-de-concept-impression-3d-metal-par-conduction/1e.JPG",
            "assets/projets/5-preuve-de-concept-impression-3d-metal-par-conduction/2e.JPG",
            "assets/projets/5-preuve-de-concept-impression-3d-metal-par-conduction/3e.jpg",
            "assets/projets/5-preuve-de-concept-impression-3d-metal-par-conduction/4e.jpg",
            "assets/projets/5-preuve-de-concept-impression-3d-metal-par-conduction/5e.jpg",
            "assets/projets/5-preuve-de-concept-impression-3d-metal-par-conduction/coupe 2.JPG",
            "assets/projets/5-preuve-de-concept-impression-3d-metal-par-conduction/coupe 4.JPG",
            "assets/projets/5-preuve-de-concept-impression-3d-metal-par-conduction/coupe 6.JPG",
            "assets/projets/5-preuve-de-concept-impression-3d-metal-par-conduction/coupe 7.JPG",
            "assets/projets/5-preuve-de-concept-impression-3d-metal-par-conduction/coupe 8.JPG"
        ],
        key_points: [
            "Revue bibliographique, antériorités et cartographie IP",
            "Modélisation thermique transitoire (bilans énergétiques, pertes convection/rayonnement)",
            "Définition de fenêtres procédé (T° buse/fil, effort d'extrusion, vitesse/pas vs Ø 0,4 mm)",
            "Analyse tribologique et contraintes internes (adhésion couche à couche, retrait)",
            "Banc d'essai instrumenté et itérations rapides test/erreur",
            "Prototypage fonctionnel via SLS Inconel pour pièces exposées",
            "Rédaction et dépôt de brevet (principe, fenêtres procédé, géométrie d'extrusion)"
        ],
        technologies: "Industrialisation, Conception mécanique, Thermique, Procédés additifs",
        results: "POC validé avec succès<br>Brevet déposé",
        duration: "4 mois"
    },
    "6-supression-des-jeux-mcanique-dans-robot-parrallle-3-axe": {
        title: "R&D robot parallèle 3 axes — suppression intégrale des jeux",
        summary: "Architecture de contact double bille préchargée élastiquement ; zéro backlash mesuré, rigidité et accélérations accrues. Éliminer les jeux de rotulage pour améliorer rigidité, précision et productivité ; protéger l'invention.",
        client: "R&D robotique / automatisation",
        ip: "Brevet déposé",
        images: [
            "assets/projets/6-supression-des-jeux-mcanique-dans-robot-parrallle-3-axe/2f.JPG",
            "assets/projets/6-supression-des-jeux-mcanique-dans-robot-parrallle-3-axe/3f.JPG",
            "assets/projets/6-supression-des-jeux-mcanique-dans-robot-parrallle-3-axe/4f.JPG"
        ],
        key_points: [
            "Recherches d'antériorité et analyse de liberté résiduelle",
            "CAO et calculs de contact (Hertz) : contraintes locales, rigidité équivalente",
            "Analyse modale et rigidité de la chaîne cinématique",
            "Maquettes instrumentées, mesures de répétabilité/retour en position",
            "Rédaction et dépôt de brevet (architecture, précharge, interfaces)"
        ],
        technologies: "Conception mécanique, Robotique parallèle, Calculs de contact, Essais instrumentés",
        results: "Jeu mesuré : 0 (à la résolution du banc)<br>Accélérations exploitables ×5 sans vibration<br>Précision et répétabilité améliorées (impression 3D, pick-and-place, lignes de production)",
        duration: "6 mois"
    }
};

console.log("Nouveaux contenus de projets prêts");