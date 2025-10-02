(function() {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set year in footer
    const YEAR = document.getElementById('year');
    if (YEAR) YEAR.textContent = new Date().getFullYear();

    const EMAIL = 'contact@alesium.fr';
    
    // Header mobile: cacher au scroll, visible seulement tout en haut
    let lastScrollTop = 0;
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        // Seulement sur mobile
        if (window.innerWidth <= 768) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                // On a scrollé : cacher le header
                nav.classList.add('hidden-on-scroll');
            } else {
                // Tout en haut : afficher le header
                nav.classList.remove('hidden-on-scroll');
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }
    });

    // Recall form handler
    document.querySelector('.recall-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const num = e.target.tel.value.trim();
        if (!num) {
            alert('Merci d\'indiquer votre numéro.');
            return;
        }
        const subject = `Rappeler ce numéro ASAP: "${num}"`;
        const body = `Numéro à rappeler : ${num}\n\n(Envoyé depuis alesium.fr)`;
        location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    // Contact form handler
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.querySelector('.form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || null,
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.contact-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            try {
                // Get backend URL from React environment or fallback
                const backendUrl = process.env.REACT_APP_BACKEND_URL || 
                                 window.location.origin.replace(':3000', ':8001');
                
                const response = await fetch(`${backendUrl}/api/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    // Success
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#2d6e3e';
                    formStatus.textContent = 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.';
                    contactForm.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi du message');
                }
            } catch (error) {
                // Error
                formStatus.style.display = 'block';
                formStatus.style.color = '#d32f2f';
                formStatus.textContent = 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.';
                console.error('Contact form error:', error);
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Lightbox functionality for project images
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox?.querySelector('img');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const lightboxPrev = lightbox?.querySelector('.prev');
    const lightboxNext = lightbox?.querySelector('.next');
    const lightboxCounter = lightbox?.querySelector('.lightbox-counter');
    
    let currentImages = [];
    let currentImageIndex = 0;
    let startX = 0;
    let startY = 0;
    
    function openLightbox(images, startIndex = 0) {
        if (!lightbox || !images || images.length === 0) return;
        
        currentImages = images;
        currentImageIndex = startIndex;
        
        showCurrentImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    
    function closeLightbox() {
        if (!lightbox) return;
        
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
        currentImages = [];
        currentImageIndex = 0;
    }
    
    function showCurrentImage() {
        if (!lightboxImg || !currentImages[currentImageIndex]) return;
        
        lightboxImg.src = currentImages[currentImageIndex];
        lightboxImg.alt = `Image ${currentImageIndex + 1}`;
        
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
        }
        
        // Update navigation buttons visibility
        if (lightboxPrev) {
            lightboxPrev.style.opacity = currentImageIndex > 0 ? '1' : '0.5';
        }
        if (lightboxNext) {
            lightboxNext.style.opacity = currentImageIndex < currentImages.length - 1 ? '1' : '0.5';
        }
    }
    
    function showPrevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            showCurrentImage();
        }
    }
    
    function showNextImage() {
        if (currentImageIndex < currentImages.length - 1) {
            currentImageIndex++;
            showCurrentImage();
        }
    }
    
    // Event listeners for lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }
    
    // Click outside to close
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                showPrevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                showNextImage();
                break;
        }
    });
    
    // Touch/swipe navigation for mobile
    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            
            // Ignore vertical swipes
            if (Math.abs(deltaY) > Math.abs(deltaX)) return;
            
            // Minimum swipe distance
            if (Math.abs(deltaX) < 50) return;
            
            if (deltaX > 0) {
                // Swipe left - next image
                showNextImage();
            } else {
                // Swipe right - previous image
                showPrevImage();
            }
            
            startX = 0;
            startY = 0;
        }, { passive: true });
    }
    
    // Add click listeners to gallery images
    function addGalleryListeners() {
        document.querySelectorAll('.gallery img').forEach((img, index, allImages) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Collect all image sources
                const imageSources = Array.from(allImages).map(image => image.src);
                
                // Open lightbox with current image
                openLightbox(imageSources, index);
            });
        });
    }

    // Pricing cards accordion functionality
    function initPricingAccordion() {
        const pricingCards = document.querySelectorAll('.pricing-card');
        
        pricingCards.forEach(card => {
            const toggle = card.querySelector('.card-toggle');
            const detail = card.querySelector('.card-detail');
            
            if (!toggle || !detail) return;
            
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isOpen = toggle.getAttribute('aria-expanded') === 'true';
                
                // Close all other cards
                pricingCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        const otherToggle = otherCard.querySelector('.card-toggle');
                        const otherDetail = otherCard.querySelector('.card-detail');
                        
                        if (otherToggle && otherDetail) {
                            otherToggle.setAttribute('aria-expanded', 'false');
                            otherDetail.setAttribute('aria-hidden', 'true');
                            otherDetail.classList.remove('open');
                        }
                    }
                });
                
                // Toggle current card
                if (isOpen) {
                    toggle.setAttribute('aria-expanded', 'false');
                    detail.setAttribute('aria-hidden', 'true');
                    detail.classList.remove('open');
                } else {
                    toggle.setAttribute('aria-expanded', 'true');
                    detail.setAttribute('aria-hidden', 'false');
                    detail.classList.add('open');
                    
                    // Smooth scroll to the opened card
                    setTimeout(() => {
                        card.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }, 100);
                }
            });
            
            // Also handle clicks on the entire card (except detail area)
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking inside the detail area
                if (!detail.contains(e.target) && e.target !== toggle) {
                    toggle.click();
                }
            });
        });
    }

    // Initialize pricing accordion when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPricingAccordion);
    } else {
        initPricingAccordion();
    }

    // Legal modal functionality
    function initLegalModal() {
        const modal = document.getElementById('legal-modal');
        const modalBody = document.getElementById('modal-body');
        const modalClose = modal?.querySelector('.modal-close');
        const overlay = modal?.querySelector('.modal-overlay');
        const mentionsLink = document.getElementById('mentions-link');
        const rgpdLink = document.getElementById('rgpd-link');

        const mentionsContent = `
            <h2>Mentions Légales</h2>
            <h3>Identité</h3>
            <p><strong>Nom/Dénomination sociale :</strong> Maxence Pereira Métallerie / Atelier Gracz</p>
            <p><strong>Adresse :</strong> 17 Chemin des meuniers, 63320 Neschers</p>
            <p><strong>Téléphone :</strong> 06 74 24 43 14</p>
            <p><strong>Email :</strong> contact@alesium.fr</p>
            
            <h3>Directeur de publication</h3>
            <p>Maxence Pereira</p>
            
            <h3>Hébergement</h3>
            <p>Ce site est hébergé par GitHub Pages</p>
            <p>GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis</p>
            
            <h3>Propriété intellectuelle</h3>
            <p>Le contenu de ce site (textes, images, éléments graphiques, logo, icônes, sons, logiciels) est la propriété exclusive d'Alesium, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.</p>
            
            <h3>Responsabilité</h3>
            <p>Les informations contenues sur ce site sont aussi précises que possible. Toutefois, des erreurs ou omissions peuvent survenir. Alesium ne pourra en aucun cas être tenu responsable de quelque dommage direct ou indirect que ce soit pouvant résulter de la consultation et/ou de l'utilisation de ce site.</p>
        `;

        const rgpdContent = `
            <h2>Politique RGPD</h2>
            <h3>Collecte des données personnelles</h3>
            <p>Dans le cadre de nos services, nous sommes amenés à collecter et traiter des données personnelles vous concernant.</p>
            
            <h3>Types de données collectées</h3>
            <ul>
                <li>Données d'identification (nom, prénom)</li>
                <li>Données de contact (email, téléphone)</li>
                <li>Données relatives à votre projet (messages, besoins exprimés)</li>
            </ul>
            
            <h3>Finalités du traitement</h3>
            <p>Vos données sont collectées et traitées pour :</p>
            <ul>
                <li>Répondre à vos demandes de contact</li>
                <li>Vous fournir nos services d'expertise industrielle</li>
                <li>Vous tenir informé de nos actualités (avec votre consentement)</li>
            </ul>
            
            <h3>Base légale</h3>
            <p>Le traitement de vos données est fondé sur :</p>
            <ul>
                <li>Votre consentement libre, éclairé et spécifique</li>
                <li>L'exécution d'un contrat ou de mesures précontractuelles</li>
                <li>L'intérêt légitime d'Alesium</li>
            </ul>
            
            <h3>Conservation des données</h3>
            <p>Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles sont traitées, conformément aux obligations légales applicables.</p>
            
            <h3>Vos droits</h3>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité</li>
                <li>Droit d'opposition</li>
            </ul>
            
            <h3>Contact</h3>
            <p>Pour exercer vos droits ou pour toute question relative au traitement de vos données personnelles, vous pouvez nous contacter à l'adresse : <strong>contact@alesium.fr</strong></p>
        `;

        function openModal(content) {
            if (!modal || !modalBody) return;
            modalBody.innerHTML = content;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            if (!modal) return;
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Event listeners
        if (mentionsLink) {
            mentionsLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(mentionsContent);
            });
        }

        if (rgpdLink) {
            rgpdLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(rgpdContent);
            });
        }

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Initialize legal modal
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLegalModal);
    } else {
        initLegalModal();
    }

    // Projects functionality
    const detail = document.getElementById('projet-detail');

    function slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[-\s]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function initProjectCards() {
        // Attacher les event listeners à toute la carte
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const projectSlug = card.getAttribute('data-project-slug');
            
            if (projectSlug) {
                // Rendre toute la carte cliquable
                card.style.cursor = 'pointer';
                
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Ouvrir le détail en modal
                    renderDetail(projectSlug);
                });
            }
        });
    }

    function renderDetail(projectSlug) {
        if (!detail) return;
        
        // Mapping des projets statiques avec contenus détaillés
        const projectsData = {
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
                phases: "Audit • CAO & outillage • Pilote atelier • Accompagnement premières séries"
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
                phases: "Cahier des charges & variantes : 10 j • CAO & calculs : 21 j • Fabrication : 17 j • Mise en service & formation : 4 j"
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
                phases: "CAO : 0,5 j • Fabrication : 0,5 j"
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
                results: "Jeu mesuré : 0 (à la résolution du banc)<br>Accélérations exploitables ×5 sans vibration<br>Précision et répétabilité améliorées",
                duration: "6 mois"
            }
        };
        
        const p = projectsData[projectSlug];
        if (!p) {
            hideDetail();
            return;
        }
        
        // Créer la galerie de miniatures cliquables
        const imageGallery = p.images && p.images.length > 0 
            ? `<div class="horizontal-gallery">
                ${p.images.map((src, index) => `
                    <div class="gallery-item" data-index="${index}" data-lightbox-trigger>
                        <img src="${src}" alt="${p.title} - Photo ${index + 1}" onerror="this.parentElement.style.display='none'">
                    </div>
                `).join('')}
            </div>`
            : '';

        // Générer le HTML AVANT d'appliquer les classes
        detail.innerHTML = `
            <div class="project-detail-content">
                <button class="btn-back"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Revenir à tous les projets</button>
                
                <div class="project-detail-layout">
                    <div class="project-left-column">
                        <div class="project-header">
                            <h2 class="project-title">${p.title}</h2>
                            <p class="project-subtitle">${p.summary || ''}</p>
                            ${p.client ? `<p class="project-client"><strong>Client :</strong> ${p.client}</p>` : ''}
                            ${p.materials ? `<p class="project-materials"><strong>Matériaux :</strong> ${p.materials}</p>` : ''}
                            ${p.ip ? `<p class="project-ip"><strong>PI :</strong> ${p.ip}</p>` : ''}
                        </div>
                        
                        ${imageGallery}
                    </div>
                    
                    <div class="project-right-column">
                        ${p.key_points && p.key_points.length > 0 ? `
                            <div class="project-section">
                                <h3>Points clés</h3>
                                <ul class="project-list">
                                    ${p.key_points.map(point => `<li>${point}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${p.technologies ? `
                            <div class="project-section">
                                <h3>Technologies</h3>
                                <p>${p.technologies}</p>
                            </div>
                        ` : ''}
                        
                        <div class="project-info-grid">
                            <div class="info-box">
                                <h3>Résultats</h3>
                                <p>${p.results || 'N/A'}</p>
                            </div>
                            <div class="info-box">
                                <h3>Durée</h3>
                                <p>${p.duration || 'N/A'}</p>
                                ${p.phases ? `<div class="phases">${p.phases}</div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Affichage du détail (même comportement desktop et mobile)
        const projectsGrid = document.querySelector('.projects-grid');
        
        // Masquer la grille
        if (projectsGrid) {
            projectsGrid.style.display = 'none';
        }
        
        // Afficher le détail
        detail.classList.remove('hidden');
        detail.classList.remove('mobile-modal-active');
        detail.setAttribute('aria-hidden', 'false');
        
        // Scroll vers le détail
        setTimeout(() => {
            detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // Attacher l'event listener au bouton retour
        const btnBack = detail.querySelector('.btn-back');
        if (btnBack) {
            btnBack.addEventListener('click', (e) => {
                e.preventDefault();
                hideDetail();
            });
        }
        
        // Attacher les event listeners pour ouvrir la lightbox sur clic des miniatures
        const galleryItems = detail.querySelectorAll('[data-lightbox-trigger]');
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.getAttribute('data-index'));
                openLightbox(p.images, index, p.title);
            });
        });
    }
    
    // Lightbox pour afficher les images en grand
    function openLightbox(images, startIndex, title) {
        let currentIndex = startIndex;
        
        // Créer le HTML de la lightbox
        const lightboxHTML = `
            <div class="lightbox-overlay">
                <div class="lightbox-container">
                    <button class="lightbox-close" aria-label="Fermer">×</button>
                    <button class="lightbox-prev" aria-label="Image précédente">‹</button>
                    <button class="lightbox-next" aria-label="Image suivante">›</button>
                    <div class="lightbox-content">
                        <img class="lightbox-image" src="${images[currentIndex]}" alt="${title}">
                        <div class="lightbox-counter">${currentIndex + 1} / ${images.length}</div>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter au DOM
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        document.body.style.overflow = 'hidden';
        
        const overlay = document.querySelector('.lightbox-overlay');
        const lightboxImage = overlay.querySelector('.lightbox-image');
        const counter = overlay.querySelector('.lightbox-counter');
        const closeBtn = overlay.querySelector('.lightbox-close');
        const prevBtn = overlay.querySelector('.lightbox-prev');
        const nextBtn = overlay.querySelector('.lightbox-next');
        
        // Fonction pour mettre à jour l'image
        function updateImage() {
            lightboxImage.src = images[currentIndex];
            counter.textContent = `${currentIndex + 1} / ${images.length}`;
            
            // Désactiver les boutons si nécessaire
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
            nextBtn.style.opacity = currentIndex === images.length - 1 ? '0.3' : '1';
            nextBtn.style.cursor = currentIndex === images.length - 1 ? 'not-allowed' : 'pointer';
        }
        
        // Navigation
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex > 0) {
                currentIndex--;
                updateImage();
            }
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex < images.length - 1) {
                currentIndex++;
                updateImage();
            }
        });
        
        // Fermer
        function closeLightbox() {
            overlay.remove();
            document.body.style.overflow = '';
        }
        
        closeBtn.addEventListener('click', closeLightbox);
        
        // Fermer en cliquant n'importe où en dehors de l'image
        overlay.addEventListener('click', (e) => {
            // Fermer si on clique sur l'overlay ou le container (pas sur l'image)
            if (e.target === overlay || e.target.classList.contains('lightbox-container') || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
        
        // Clavier
        function handleKeyboard(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handleKeyboard);
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--;
                updateImage();
            } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
                currentIndex++;
                updateImage();
            }
        }
        document.addEventListener('keydown', handleKeyboard);
        
        updateImage();
    }

    function hideDetail() {
        if (!detail) return;
        
        // Cacher le détail
        detail.classList.add('hidden');
        detail.classList.remove('mobile-modal-active');
        detail.setAttribute('aria-hidden', 'true');
        detail.style.display = 'none';
        detail.style.position = '';
        detail.style.top = '';
        detail.style.left = '';
        detail.style.width = '';
        detail.style.height = '';
        detail.style.zIndex = '';
        detail.style.overflow = '';
        detail.style.background = '';
        detail.innerHTML = '';
        
        // Restaurer le scroll du body
        document.body.style.overflow = '';
        
        // Réafficher la grille
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.style.display = 'grid';
        }
    }

    function route() {
        const hash = location.hash || '';
        const projectMatch = hash.match(/^#\/projets\/(.+)$/);
        
        if (projectMatch) {
            const slug = projectMatch[1];
            renderDetail(slug);
        } else {
            hideDetail();
        }
    }

    // Initialize project cards on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initProjectCards();
            route();
        });
    } else {
        initProjectCards();
        route();
    }
    
    // Handle hash changes for SPA routing
    window.addEventListener('hashchange', route);

    // Legal sections handling
    const ml = document.getElementById('mentions-legales');
    const rg = document.getElementById('rgpd');

    function showSection(sectionId) {
        [ml, rg].forEach(s => {
            if (!s) return;
            s.classList.add('hidden');
            s.setAttribute('aria-hidden', 'true');
        });

        const sec = document.querySelector(sectionId);
        if (sec) {
            sec.classList.remove('hidden');
            sec.setAttribute('aria-hidden', 'false');
            setTimeout(() => {
                window.scrollTo({
                    top: sec.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // Handle legal page routing
    window.addEventListener('hashchange', () => {
        if (location.hash === '#/mentions-legales') showSection('#mentions-legales');
        if (location.hash === '#/rgpd') showSection('#rgpd');
    });

    // Initial legal page check
    if (location.hash === '#/mentions-legales') showSection('#mentions-legales');
    if (location.hash === '#/rgpd') showSection('#rgpd');

    // Smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]:not([href="#/"])');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (href.startsWith('#/')) return; // Skip SPA routes
        if (href === '#' || href.length <= 1) return; // Skip invalid selectors
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerHeight = 80; // Hauteur du header fixe + marge
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });

    // FAQ functionality - style Gracz
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isOpen = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            
            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    const otherAnswer = otherQuestion.nextElementSibling;
                    otherAnswer.classList.remove('open');
                }
            });
            
            // Toggle current FAQ item
            if (isOpen) {
                question.setAttribute('aria-expanded', 'false');
                answer.classList.remove('open');
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('open');
            }
        });
    });

    // CV Interactive functionality
    const cvQuestions = document.querySelectorAll('.cv-question');
    cvQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isOpen = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            
            // Toggle current CV item
            if (isOpen) {
                question.setAttribute('aria-expanded', 'false');
                answer.classList.remove('open');
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('open');
            }
        });
    });

    // Parallaxe entre sections (-10% à 0%) - EXCLUANT la section "qui je suis"
    function initSectionParallax() {
        const sections = document.querySelectorAll('.section:not(#presentation)'); // Exclure la section "qui je suis"
        
        // Initialiser toutes les sections en mode "enter"
        sections.forEach(section => {
            section.classList.add('section-enter');
        });
        
        function updateSectionParallax() {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionCenter = sectionTop + sectionHeight / 2;
                
                // Calculer la distance par rapport au centre de l'écran
                const screenCenter = scrollY + windowHeight / 2;
                const distanceFromCenter = Math.abs(screenCenter - sectionCenter);
                
                // Si la section est proche du centre de l'écran
                if (distanceFromCenter < windowHeight * 0.8) {
                    // Calculer le pourcentage de visibilité (0 = loin, 1 = au centre)
                    const visibility = Math.max(0, 1 - (distanceFromCenter / (windowHeight * 0.8)));
                    
                    // Appliquer la transformation réduite de moitié : de -5% à 0% (au lieu de -10% à 0%)
                    const translateY = (1 - visibility) * 5; // Divisé par 2
                    const opacity = 0.65 + (visibility * 0.35); // Opacité de 0.65 à 1 au lieu de 0.3 à 1
                    
                    section.style.transform = `translateY(${translateY}%)`;
                    section.style.opacity = opacity;
                    
                    if (visibility > 0.7) {
                        section.classList.remove('section-enter');
                        section.classList.add('section-visible');
                    }
                } else {
                    // Section trop loin, la garder en mode "enter"
                    section.classList.remove('section-visible');
                    section.classList.add('section-enter');
                }
            });
        }
        
        // Écouter le scroll avec throttling
        let ticking = false;
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateSectionParallax();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScroll);
        
        // Appel initial
        updateSectionParallax();
    }
    
    // Initialiser la parallaxe des sections
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initSectionParallax, 100);
    });

    // Add loading animation for images
    document.addEventListener('DOMContentLoaded', () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        });
    });
})();