(function() {
    // Set year in footer
    const YEAR = document.getElementById('year');
    if (YEAR) YEAR.textContent = new Date().getFullYear();

    const EMAIL = 'contact@alesium.fr';

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

    // Projects and carousel functionality
    const DATA_URL = 'content/projets.json';
    const carouselHost = document.querySelector('#projets .track');
    const prevBtn = document.querySelector('#projets .prev');
    const nextBtn = document.querySelector('#projets .next');
    const detail = document.getElementById('projet-detail');

    function slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[-\s]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function cardHTML(p) {
        return `
            <article class="card">
                <a href="#/projets/${p.slug}">
                    <img src="${p.preview}" alt="${p.title}" onerror="this.style.display='none'"/>
                    <h3>${p.title}</h3>
                </a>
            </article>
        `;
    }

    function renderCarousel(items) {
        if (!carouselHost) return;
        
        // Trier les projets dans l'ordre 1-2-3-4-5-6 basé sur le numéro au début du titre
        const sortedItems = items.sort((a, b) => {
            const numA = parseInt(a.title.match(/^(\d+)/)?.[1] || '999');
            const numB = parseInt(b.title.match(/^(\d+)/)?.[1] || '999');
            return numA - numB;
        });
        
        // Dupliquer les items pour un défilement infini
        const duplicatedItems = [...sortedItems, ...sortedItems];
        carouselHost.innerHTML = duplicatedItems.map(cardHTML).join('');
        
        // Variables pour le glissement manuel
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;
        
        // Fonction pour activer/désactiver l'auto-scroll
        function toggleAutoScroll(enable) {
            if (enable) {
                carouselHost.classList.add('auto-scroll');
            } else {
                carouselHost.classList.remove('auto-scroll');
            }
        }
        
        // Désactiver l'auto-scroll initialement
        toggleAutoScroll(false);
        
        // Démarrer l'auto-scroll après 2 secondes
        setTimeout(() => {
            if (!isDragging) {
                toggleAutoScroll(true);
            }
        }, 2000);
        
        // Gestion des événements tactiles et souris
        carouselHost.addEventListener('mousedown', startDrag);
        carouselHost.addEventListener('touchstart', startDrag, { passive: false });
        
        carouselHost.addEventListener('mouseup', endDrag);
        carouselHost.addEventListener('touchend', endDrag);
        carouselHost.addEventListener('mouseleave', endDrag);
        
        carouselHost.addEventListener('mousemove', drag);
        carouselHost.addEventListener('touchmove', drag, { passive: false });
        
        function startDrag(e) {
            isDragging = true;
            toggleAutoScroll(false);
            carouselHost.classList.add('dragging');
            
            startX = getPositionX(e);
            prevTranslate = currentTranslate;
            
            carouselHost.style.cursor = 'grabbing';
            animationID = requestAnimationFrame(animation);
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            const currentPosition = getPositionX(e);
            currentTranslate = prevTranslate + currentPosition - startX;
        }
        
        function endDrag() {
            if (!isDragging) return;
            
            isDragging = false;
            carouselHost.classList.remove('dragging');
            carouselHost.style.cursor = 'grab';
            
            cancelAnimationFrame(animationID);
            
            // Remettre l'auto-scroll après 3 secondes d'inactivité
            setTimeout(() => {
                if (!isDragging) {
                    toggleAutoScroll(true);
                    // Reset position for smooth auto-scroll
                    currentTranslate = 0;
                    prevTranslate = 0;
                    carouselHost.style.transform = 'translateX(0)';
                }
            }, 3000);
        }
        
        function getPositionX(e) {
            return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        }
        
        function animation() {
            if (isDragging) {
                carouselHost.style.transform = `translateX(${currentTranslate}px)`;
                requestAnimationFrame(animation);
            }
        }
        
        // Pause auto-scroll au survol
        carouselHost.addEventListener('mouseenter', () => {
            if (!isDragging) {
                carouselHost.style.animationPlayState = 'paused';
            }
        });
        
        carouselHost.addEventListener('mouseleave', () => {
            if (!isDragging) {
                carouselHost.style.animationPlayState = 'running';
            }
        });
    }

    function renderDetail(p) {
        if (!detail) return;
        detail.classList.remove('hidden');
        detail.setAttribute('aria-hidden', 'false');
        
        const imageGallery = p.images && p.images.length > 0 
            ? `<div class="gallery">${p.images.map(src => `<img src="${src}" alt="${p.title}" onerror="this.style.display='none'">`).join('')}</div>`
            : '';

        const keyPoints = p.key_points && p.key_points.length > 0
            ? `<h3>Points clés</h3><ul class="bullets">${p.key_points.map(point => `<li>${point}</li>`).join('')}</ul>`
            : '';

        detail.innerHTML = `
            <h2>${p.title}</h2>
            <p class="muted">${p.summary || ''}</p>
            ${imageGallery}
            <div class="cols">
                <div>
                    ${keyPoints}
                    ${p.tech ? `<h3>Technologies</h3><p>${p.tech}</p>` : ''}
                </div>
                <div>
                    <h3>Résultats</h3>
                    <p>${p.results || 'Données non disponibles'}</p>
                    <h3>Temps passé</h3>
                    <p>${p.time_spent || 'Données non disponibles'}</p>
                </div>
            </div>
            <p><a class="btn" href="#projets">← Revenir aux projets</a></p>
        `;
        
        // Smooth scroll to detail section
        setTimeout(() => {
            window.scrollTo({
                top: detail.offsetTop - 100,
                behavior: 'smooth'
            });
        }, 100);
    }

    function hideDetail() {
        if (!detail) return;
        detail.classList.add('hidden');
        detail.setAttribute('aria-hidden', 'true');
        detail.innerHTML = '';
    }

    function route(items) {
        const hash = location.hash || '';
        const projectMatch = hash.match(/^#\/projets\/(.+)$/);
        
        if (projectMatch) {
            const slug = projectMatch[1];
            const project = items.find(x => x.slug === slug);
            if (project) {
                renderDetail(project);
            } else {
                hideDetail();
            }
        } else {
            hideDetail();
        }
    }

    // Load projects data
    fetch(DATA_URL)
        .then(r => r.json())
        .then(items => {
            renderCarousel(items);
            route(items);
            
            // Handle hash changes for SPA routing
            window.addEventListener('hashchange', () => route(items));
        })
        .catch(e => {
            console.warn('projets.json introuvable', e);
            // Fallback: create mock data from available assets
            createMockProjects();
        });

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
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
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

    // Parallaxe 10% sur le mouvement vertical
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        
        parallaxElements.forEach(element => {
            const speed = scrolled * 0.1; // 10% de parallaxe
            element.style.transform = `translateY(${speed}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Ajouter les couches de parallaxe au DOM
    function addParallaxLayers() {
        const parallaxContainer = document.createElement('div');
        parallaxContainer.className = 'parallax-container';
        
        for (let i = 0; i < 3; i++) {
            const layer = document.createElement('div');
            layer.className = 'parallax-layer';
            layer.style.zIndex = -2 - i;
            parallaxContainer.appendChild(layer);
        }
        
        document.body.appendChild(parallaxContainer);
    }
    
    // Initialiser la parallaxe au chargement
    document.addEventListener('DOMContentLoaded', addParallaxLayers);

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

    // Create mock projects if JSON fails to load
    function createMockProjects() {
        const mockProjects = [
            {
                slug: "optimisation-escalier-acier",
                title: "Optimisation du temps de fabrication d'escalier en acier",
                preview: "assets/projets/optimisation-escalier-acier/preview.jpg",
                images: ["assets/projets/optimisation-escalier-acier/image1.jpg", "assets/projets/optimisation-escalier-acier/image2.jpg"],
                summary: "Réduction du temps de fabrication d'escaliers métalliques par optimisation des procédés.",
                key_points: ["Analyse des goulots d'étranglement", "Nouvelle méthode d'assemblage", "Outillage spécialisé"],
                results: "Temps de fabrication réduit de 40%",
                time_spent: "3 semaines",
                tech: "Soudure MIG/MAG, usinage CNC"
            },
            {
                slug: "ligne-production",
                title: "Fabrication d'une ligne de production",
                preview: "assets/projets/ligne-production/preview.jpg",
                images: ["assets/projets/ligne-production/image1.jpg"],
                summary: "Conception et réalisation complète d'une ligne de production automatisée.",
                key_points: ["Automatisation des tâches répétitives", "Contrôle qualité intégré", "Interface opérateur intuitive"],
                results: "Productivité augmentée de 60%",
                time_spent: "8 semaines",
                tech: "Automatisme, pneumatique, vision industrielle"
            }
        ];
        
        renderCarousel(mockProjects);
        route(mockProjects);
        window.addEventListener('hashchange', () => route(mockProjects));
    }
})();