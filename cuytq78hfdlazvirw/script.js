document.addEventListener('DOMContentLoaded', () => {
    // === 1. Data Loading (JSON) ===
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderMembers(data.members);
            renderSection('live-list', data.live);
            renderSection('sounds-list', data.sounds, 'sound');
            renderSection('videos-grid', data.videos, 'video');
            renderSection('works-list', data.works);
            renderSection('gallery-grid', data.gallery, 'gallery');
            renderSection('connect-list', data.connect, 'connect');
            renderSection('references-list', data.references, 'reference');
            renderSection('activities-list', data.activities); // New activities section
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
            video: (item) => `
                <div class="video-preview">
                    <iframe src="https://www.youtube.com/embed/${item.youtubeId}?controls=0" frameborder="0"
                        allowfullscreen title="${item.title}"></iframe>
                </div>
            `,
            reference: (item) => `
                <a href="https://www.youtube.com/watch?v=${item.youtubeId}" class="ref-card-link" target="_blank">
                    <div class="video-preview thumbnail-mode">
                        <img src="https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg" alt="${item.title}" class="ref-thumb">
                        <div class="play-overlay">
                            <span class="play-icon">▶</span>
                            <span class="play-text">WATCH ON YOUTUBE</span>
                        </div>
                    </div>
                </a>
            `,
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
            if (type === 'connect') return media;
            if (type === 'gallery') return media;

            const className = type === 'sound' ? 'sound-item' : (type === 'video' || type === 'reference') ? 'work-card' : 'generic-item';

            if (type === 'reference') {
                return `
                    <div class="${className}">
                        ${UI.meta(item)}
                        ${media}
                    </div>
                `;
            }

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
                <div class="member-detail">
                    ${m.detail}
                </div>
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

    // === 2. Concept Poster Parallax ===
    const conceptPoster = document.querySelector('.concept-poster');
    window.addEventListener('scroll', () => {
        const visual = document.querySelector('.concept-visual');
        if (!visual || !conceptPoster) return;
        const rect = visual.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const offset = (window.innerHeight - rect.top) * 0.05;
            conceptPoster.style.transform = `translateY(${offset - 20}px)`;
        }
    });

    // === 3. Scroll Reveal ===
    const observerOptions = { threshold: 0.2, rootMargin: "0px" };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
    }, observerOptions);
    document.querySelectorAll('.reveal-text').forEach(el => revealObserver.observe(el));

    // === 4. Hero Logo Scroll Effect ===
    const logo = document.querySelector('.hero-logo-large');
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        if (logo) {
            logo.style.transform = `translateY(${scroll * 0.4}px)`;
            logo.style.opacity = 1 - scroll / 600;
        }
    });

    // === 5. Mobile Nav Toggle ===
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // === 6. Smooth Scroll & Section Auto-Expand ===
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                // 折りたたみセクション（Gallery, References, Activities）の場合は展開する
                if (target.classList.contains('collapsible')) {
                    target.classList.remove('collapsed');
                }
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // === 7. Collapsible Section Toggle ===
    document.querySelectorAll('.collapsible').forEach(section => {
        const trigger = section.querySelector('.toggle-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                section.classList.toggle('collapsed');
            });
        }
    });
});
