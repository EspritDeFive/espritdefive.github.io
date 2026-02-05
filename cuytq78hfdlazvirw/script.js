document.addEventListener('DOMContentLoaded', () => {
    // === 1. Data Loading (JSON) ===
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderMembers(data.members);
            renderSection('live-list', data.live);
            renderSection('sounds-list', data.sounds, 'sound');
            renderSection('videos-grid', data.videos, 'youtube');
            renderSection('works-list', data.works);
            renderSection('gallery-grid', data.gallery, 'gallery');
            renderSection('connect-list', data.connect, 'connect');
            renderSection('references-list', data.references, 'youtube');
            renderSection('activities-list', data.activities, 'youtube');
        })
        .catch(err => console.error('Error loading data:', err));

    const COMING_SOON = '<p class="coming-soon">Coming Soon</p>';

    // --- Core UI Components ---
    const UI = {
        meta: (item) => `
            <div class="item-meta">
                <div class="meta-header">
                    ${item.tag ? `<span class="tag">${item.tag}</span>` : ''}
                    ${item.date ? `<span class="label">${item.date}</span>` : ''}
                </div>
                <h4 class="item-title">${item.title}</h4>
                ${item.desc ? `<p class="item-desc">${item.desc}</p>` : ''}
            </div>
        `,
        templates: {
            sound: (item) => `
                <div class="sc-cropper">
                    <iframe class="sc-player" height="120" scrolling="no" frameborder="no" allow="autoplay" 
                        src="https://w.soundcloud.com/player/?url=${encodeURIComponent(item.url)}&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false">
                    </iframe>
                </div>
            `,
            youtube: (item) => {
                if (item.canEmbed) {
                    return `
                        <div class="video-preview">
                            <iframe src="https://www.youtube.com/embed/${item.youtubeId}?controls=1" frameborder="0"
                                allowfullscreen title="${item.title}"></iframe>
                        </div>
                    `;
                } else {
                    return `
                        <a href="https://www.youtube.com/watch?v=${item.youtubeId}" class="ref-card-link" target="_blank">
                            <div class="video-preview thumbnail-mode">
                                <img src="https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg" alt="${item.title}" class="ref-thumb">
                                <div class="play-overlay">
                                    <span class="play-icon">▶</span>
                                    <span class="play-text">PLAY ON YOUTUBE (EXTERNAL)</span>
                                </div>
                            </div>
                        </a>
                    `;
                }
            },
            gallery: (item) => `
                <div class="gallery-item">
                    <img src="${item.url}" alt="${item.title}" loading="lazy">
                    <div class="gallery-caption">${item.title}</div>
                </div>
            `,
            connect: (item) => `
                <a href="${item.url}" class="connect-link" target="_blank">
                    <span class="platform">${item.platform}</span>
                    <span class="arrow">→</span>
                </a>
            `
        }
    };

    function renderSection(containerId, items, type = 'generic') {
        const container = document.getElementById(containerId);
        if (!container) return;
        if (!items || items.length === 0) {
            container.innerHTML = COMING_SOON;
            return;
        }

        container.innerHTML = items.map(item => {
            const media = UI.templates[type] ? UI.templates[type](item) : '';
            if (type === 'connect' || type === 'gallery') return media;
            const className = type === 'sound' ? 'sound-item' : (type === 'youtube') ? 'work-card' : 'generic-item';
            return `<div class="${className}">${UI.meta(item)}${media}</div>`;
        }).join('');
    }

    function renderMembers(members) {
        const container = document.getElementById('member-list');
        if (!container) return;
        if (!members || members.length === 0) {
            container.innerHTML = COMING_SOON;
            return;
        }
        container.innerHTML = members.map(m => `
            <div class="member-vertical-card" data-id="${m.id}">
                <div class="member-card-header">
                    <span class="num">${m.id}</span>
                    <div class="m-info">
                        <h3>${m.name}</h3>
                        <p>${m.role}</p>
                    </div>
                    <div class="member-toggle">
                        <span class="plus">+</span>
                    </div>
                </div>
                <div class="member-detail"><div class="member-detail-inner">${m.detail}</div></div>
            </div>
        `).join('');

        container.querySelectorAll('.member-vertical-card').forEach(card => {
            card.addEventListener('click', () => {
                container.querySelectorAll('.member-vertical-card').forEach(c => {
                    if (c !== card) c.classList.remove('active');
                });
                card.classList.toggle('active');
            });
        });
    }

    // === 2. Optimized Scroll Effects (Parallax & Reveal) ===
    const heroLogo = document.querySelector('.hero-logo-large');
    const conceptPoster = document.querySelector('.concept-poster');
    const conceptVisual = document.querySelector('.concept-visual');
    const reveals = document.querySelectorAll('.reveal-text');

    // Performance optimization: Using requestAnimationFrame & ticking
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateParallax() {
        const scroll = lastScrollY;

        // Hero Logo Parallax
        if (heroLogo) {
            heroLogo.style.transform = `translateY(${scroll * 0.4}px)`;
            heroLogo.style.opacity = Math.max(0, 1 - scroll / 600);
        }

        // Concept Poster Parallax
        if (conceptPoster && conceptVisual) {
            const rect = conceptVisual.getBoundingClientRect();
            // Only calculate if in viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (window.innerHeight - rect.top) * 0.05;
                conceptPoster.style.transform = `translateY(${offset - 20}px)`;
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true }); // Better performance on mobile

    // === 3. Scroll Reveal (Intersection Observer) ===
    const observerOptions = { threshold: 0.2, rootMargin: "0px" };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target); // Performance: stop observing once revealed
            }
        });
    }, observerOptions);
    reveals.forEach(el => revealObserver.observe(el));

    // === 4. Navigation & Mobile Menu ===
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }

    // === 5. Advanced Scroll & Auto-Expand ===
    const HEADER_OFFSET = 80;

    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);

            if (navToggle && mainNav) {
                navToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }

            if (target) {
                if (target.classList.contains('collapsible')) {
                    target.classList.remove('collapsed');
                }

                setTimeout(() => {
                    const scrollTarget = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
                    window.scrollTo({
                        top: scrollTarget,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    });

    // === 6. Collapsible Section Toggle ===
    document.querySelectorAll('.collapsible').forEach(section => {
        section.querySelectorAll('.toggle-trigger').forEach(trigger => {
            trigger.addEventListener('click', () => {
                section.classList.toggle('collapsed');
            });
        });
    });
});
