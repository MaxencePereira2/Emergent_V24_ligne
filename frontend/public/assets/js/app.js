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
        let startTime = 0;
        
        // Fonction pour activer/désactiver l'auto-scroll
        function toggleAutoScroll(enable) {
            if (enable) {
                carouselHost.classList.add('auto-scroll');
            } else {
                carouselHost.classList.remove('auto-scroll');
            }
        }
        
        // Démarrer l'auto-scroll après 2 secondes
        setTimeout(() => {
            if (!isDragging) {
                toggleAutoScroll(true);
            }
        }, 2000);
        
        // Gestion des événements tactiles et souris
        carouselHost.addEventListener('mousedown', startDrag);
        carouselHost.addEventListener('touchstart', startDrag, { passive: true });
        
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: true });
        
        function startDrag(e) {
            if (e.target.closest('.card a')) return; // Ne pas interférer avec les liens
            
            isDragging = true;
            startTime = Date.now();
            toggleAutoScroll(false);
            carouselHost.classList.add('dragging');
            
            startX = getPositionX(e);
            prevTranslate = currentTranslate;
            
            animationID = requestAnimationFrame(animation);
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const currentPosition = getPositionX(e);
            currentTranslate = prevTranslate + (currentPosition - startX) * 0.8; // Facteur de réduction pour un scroll plus fluide
        }
        
        function endDrag() {
            if (!isDragging) return;
            
            isDragging = false;
            carouselHost.classList.remove('dragging');
            
            cancelAnimationFrame(animationID);
            
            // Inertie de scroll
            const duration = Date.now() - startTime;
            const distance = currentTranslate - prevTranslate;
            const velocity = distance / duration;
            
            if (Math.abs(velocity) > 0.1) {
                currentTranslate += velocity * 200; // Inertie
            }
            
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

    // Parallaxe entre sections (-30% à 0%)
    function initSectionParallax() {
        const sections = document.querySelectorAll('.section');
        
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
                    
                    // Appliquer la transformation de -10% à 0%
                    const translateY = (1 - visibility) * 10; // Réduit de 30 à 10
                    const opacity = 0.3 + (visibility * 0.7);
                    
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