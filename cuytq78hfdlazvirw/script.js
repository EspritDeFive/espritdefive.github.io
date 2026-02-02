document.addEventListener('DOMContentLoaded', () => {
    // === 1. Data Loading (JSON) ===
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderMembers(data.members);
            renderWorks(data.works);
        })
        .catch(err => console.error('Error loading data:', err));

    function renderMembers(members) {
        const container = document.getElementById('member-list');
        if (!container) return;
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

    function renderWorks(works) {
        const container = document.getElementById('works-grid');
        if (!container) return;
        container.innerHTML = works.map(w => `
            <div class="work-card">
                <div class="video-preview">
                    <iframe src="https://www.youtube.com/embed/${w.youtubeId}?controls=0" frameborder="0"
                        allowfullscreen title="${w.title}"></iframe>
                </div>
                <div class="work-meta">
                    <span class="label">${w.date}</span>
                    <h4>${w.title}</h4>
                    <p style="font-size: 0.7rem; opacity: 0.5; margin-top: 5px;">${w.desc}</p>
                </div>
            </div>
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
