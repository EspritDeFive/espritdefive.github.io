document.addEventListener('DOMContentLoaded', () => {
    // === 1. Data Loading (JSON) ===
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderMembers(data.members);
            renderLive(data.live);
            renderSounds(data.sounds);
            renderVideos(data.videos);
            renderWorks(data.works);
            renderGallery(data.gallery);
            renderConnect(data.connect);
            renderReferences(data.references);
        })
        .catch(err => console.error('Error loading data:', err));

    const COMING_SOON = '<p class="coming-soon">Coming Soon</p>';

    function renderSounds(sounds) {
        const container = document.getElementById('sounds-list');
        if (!container) return;
        if (!sounds || sounds.length === 0) {
            container.innerHTML = COMING_SOON;
            return;
        }
        container.innerHTML = sounds.map(s => `
            <div class="sound-item">
                <div class="item-meta">
                    <div class="meta-header">
                        ${s.tag ? `<span class="tag">${s.tag}</span>` : ''}
                        <span class="label">${s.date}</span>
                    </div>
                    <h4 class="item-title">${s.title}</h4>
                    ${s.desc ? `<p class="item-desc">${s.desc}</p>` : ''}
                </div>
                <div class="sc-cropper">
                    <iframe class="sc-player" height="120" scrolling="no" frameborder="no" allow="autoplay" 
                        src="https://w.soundcloud.com/player/?url=${encodeURIComponent(s.url)}&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false">
                    </iframe>
                </div>
            </div>
        `).join('');
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

        // クリックイベントの登録
        container.querySelectorAll('.member-vertical-card').forEach(card => {
            card.addEventListener('click', () => {
                // 他を閉じる場合は以下を有効化（今回はアコーディオン形式）
                container.querySelectorAll('.member-vertical-card').forEach(c => {
                    if (c !== card) c.classList.remove('active');
                });
                card.classList.toggle('active');
            });
        });
    }

    function renderVideos(videos) {
        const container = document.getElementById('videos-grid');
        if (!container) return;
        if (!videos || videos.length === 0) {
            container.innerHTML = COMING_SOON;
            return;
        }
        container.innerHTML = videos.map(v => `
            <div class="work-card">
                <div class="item-meta">
                    <div class="meta-header">
                        ${v.tag ? `<span class="tag">${v.tag}</span>` : ''}
                        <span class="label">${v.date}</span>
                    </div>
                    <h4 class="item-title">${v.title}</h4>
                    ${v.desc ? `<p class="item-desc">${v.desc}</p>` : ''}
                </div>
                <div class="video-preview">
                    <iframe src="https://www.youtube.com/embed/${v.youtubeId}?controls=0" frameborder="0"
                        allowfullscreen title="${v.title}"></iframe>
                </div>
            </div>
        `).join('');
    }

    // --- Generic Template for Live, Works ---
    function renderGenericList(id, items) {
        const container = document.getElementById(id);
        if (!container) return;
        if (!items || items.length === 0) {
            container.innerHTML = COMING_SOON;
            return;
        }
        container.innerHTML = items.map(item => `
            <div class="generic-item">
                <div class="item-meta">
                    <div class="meta-header">
                        ${item.tag ? `<span class="tag">${item.tag}</span>` : ''}
                        ${item.date ? `<span class="label">${item.date}</span>` : ''}
                    </div>
                    <h4 class="item-title">${item.title}</h4>
                    ${item.desc ? `<p class="item-desc">${item.desc}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    function renderLive(live) { renderGenericList('live-list', live); }
    function renderWorks(works) { renderGenericList('works-list', works); }

    function renderGallery(gallery) {
        const container = document.getElementById('gallery-grid');
        if (!container) return;
        if (!gallery || gallery.length === 0) {
            container.innerHTML = COMING_SOON;
            return;
        }
        container.innerHTML = gallery.map(g => `
            <div class="gallery-item">
                <img src="${g.url}" alt="${g.title}" loading="lazy">
                <div class="gallery-caption">${g.title}</div>
            </div>
        `).join('');
    }

    function renderConnect(connect) {
        const container = document.getElementById('connect-list');
        if (!container) return;
        if (!connect || connect.length === 0) {
            container.innerHTML = COMING_SOON;
            return;
        }
        container.innerHTML = connect.map(c => `
            <a href="${c.url}" class="connect-link" target="_blank">
                <span class="platform">${c.platform}</span>
                <span class="arrow">→</span>
            </a>
        `).join('');
    }

    function renderReferences(refs) {
        const container = document.getElementById('references-list');
        if (!container) return;
        if (!refs || refs.length === 0) {
            container.innerHTML = COMING_SOON;
            return;
        }
        container.innerHTML = refs.map(r => `
            <a href="https://www.youtube.com/watch?v=${r.youtubeId}" class="work-card ref-card-link" target="_blank">
                <div class="item-meta">
                    <div class="meta-header">
                        ${r.tag ? `<span class="tag">${r.tag}</span>` : ''}
                        <span class="label">External Link</span>
                    </div>
                    <h4 class="item-title">${r.title}</h4>
                    ${r.desc ? `<p class="item-desc">${r.desc}</p>` : ''}
                </div>
                <div class="video-preview thumbnail-mode">
                    <img src="https://img.youtube.com/vi/${r.youtubeId}/maxresdefault.jpg" alt="${r.title}" class="ref-thumb">
                    <div class="play-overlay">
                        <span class="play-icon">▶</span>
                        <span class="play-text">WATCH ON YOUTUBE</span>
                    </div>
                </div>
            </a>
        `).join('');
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

    // === 5. Smooth Scroll ===
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
