# Site Statique Alesium

## Aperçu

Site web statique professionnel pour Alesium, spécialisé dans l'industrialisation et le conseil pour PME et artisans industriels. Le site présente les services, projets et tarifs de l'entreprise.

## ✅ Fonctionnalités Implémentées

### 📋 Structure du Site
- **Page d'accueil one-page** avec navigation par ancres
- **Section héro** avec message principal et CTA
- **Section "Qui je suis"** avec photo de profil
- **Section positionnement** avec points différenciants
- **Section tarifs** avec 4 offres de services
- **Section projets** avec carrousel interactif
- **Section contact** avec email, formulaire rappel et iframe Tally
- **Footer** avec liens légaux
- **Pages légales** (Mentions légales & RGPD)

### 🎨 Design
- **Palette de couleurs professionnelle** : #F6F7F8, #2E3A44, #3F7A6B
- **Police Inter** pour une lisibilité optimale
- **Design sobre et sérieux** adapté au secteur industriel
- **Animations légères** avec micro-interactions
- **Filigrane discret** en arrière-plan (10% opacité)
- **Responsive design** mobile-first

### 🛠️ Fonctionnalités Techniques
- **SPA avec routing hash** (#/projets/{slug})
- **Carrousel projets** avec navigation clavier/souris
- **Pages détail projets** avec images, points clés, résultats
- **Formulaire "Être rappelé"** avec mailto automatique
- **Intégration Tally** pour formulaire de contact
- **JSON-LD schema.org** pour SEO
- **Manifeste LLM** pour IA future

### 📊 Contenu
- **6 projets réels** avec images et métadonnées
- **4 offres tarifaires** détaillées
- **Contact fonctionnel** : contact@alesium.fr
- **Données structurées** pour moteurs de recherche

## 📁 Structure des Fichiers

```
docs/
├── index.html              # Page principale
├── 404.html               # Fallback SPA
├── .nojekyll              # Configuration GitHub Pages
├── CNAME                  # Domaine personnalisé
├── assets/
│   ├── css/
│   │   └── app.css        # Styles principaux
│   ├── js/
│   │   └── app.js         # JavaScript SPA
│   ├── profil/
│   │   └── profil.jpeg    # Photo de profil
│   ├── fonds/
│   │   └── watermark.jpg  # Image de filigrane
│   └── projets/           # Images des projets
│       ├── projet1/
│       ├── projet2/
│       └── ...
└── content/
    └── projets.json       # Données des projets
```

## 🚀 Déploiement GitHub Pages

### Configuration GitHub
1. Repository Settings → Pages
2. Source : Deploy from branch
3. Branch : `main`
4. Folder : `/docs`
5. Custom domain : `www.alesium.fr`
6. Enforce HTTPS : ✅

### Configuration DNS (Gandi)
```
# Enregistrements A pour apex
alesium.fr → 185.199.108.153
alesium.fr → 185.199.109.153
alesium.fr → 185.199.110.153
alesium.fr → 185.199.111.153

# Enregistrements AAAA pour apex
alesium.fr → 2606:50c0:8000::153
alesium.fr → 2606:50c0:8001::153
alesium.fr → 2606:50c0:8002::153
alesium.fr → 2606:50c0:8003::153

# CNAME pour www
www → [utilisateur].github.io
```

## 📋 Critères d'Acceptation

✅ **Site statique complet** dans /docs  
✅ **Fonctionnement sans build** (double-clic sur index.html)  
✅ **Carrousel opérationnel** avec navigation  
✅ **Pages projets** #/projets/{slug} fonctionnelles  
✅ **Filigrane appliqué** (~10% opacité)  
✅ **Section contact** complète avec email + Tally + rappel  
✅ **Pages légales** accessibles et remplies  
✅ **Manifeste LLM** intégré en JSON  
✅ **JSON-LD schema.org** présent  
✅ **Aucun workflow GitHub** Actions  
✅ **Compatible GitHub Pages** (main/docs)  

## 🔧 Utilisation Locale

Pour tester localement :
```bash
# Serveur HTTP simple
cd docs/
python3 -m http.server 8000

# Ou avec Node.js
npx serve .

# Ou directement
open index.html
```

## 📞 Contact

- **Email** : contact@alesium.fr
- **Domaine** : www.alesium.fr
- **Entreprise** : Alesium – Maxence Pereira Métallerie
- **SIREN** : 951 628 932

## 🎯 Messages Clés

- **Positionnement** : "Du concept à la production fiable et rentable"
- **Différenciation** : Ingénieur + faiseur, multi-matériaux, opérationnel immédiatement
- **Public cible** : PME industrielles (5-50 personnes), start-ups hardware, artisans
- **CTA principal** : "Démarrer un échange (15 min)"

---

*Site créé conformément aux spécifications techniques pour un déploiement GitHub Pages optimisé.*