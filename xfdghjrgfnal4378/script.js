document.addEventListener('DOMContentLoaded', () => {
    const nodes = document.querySelectorAll('.node');
    const hero = document.querySelector('.hero');

    // 1. Mouse Parallax Effect
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            nodes.forEach((node, index) => {
                const speed = (index + 1) * 0.05;
                const x = (clientX - centerX) * speed;
                const y = (clientY - centerY) * speed;
                // Using transform for mouse parallax
                node.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            });
        });
    }

    // 2. Scroll Reveal Animation
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section.container, .video-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    // 3. Member Cards staggered reveal
    document.querySelectorAll('.member-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;

        const cardObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        }, { threshold: 0.2 });

        cardObserver.observe(card);
    });

    // 4. Organic Floating Motion (JS driven)
    let tick = 0;
    function animateNodes() {
        tick += 0.003;
        nodes.forEach((node, index) => {
            const offset = index * 1.5;
            const x = Math.sin(tick + offset) * 100 + Math.cos(tick * 0.5 + offset) * 20;
            const y = Math.cos(tick * 0.7 + offset) * 80 + Math.sin(tick * 0.3 + offset) * 30;
            // Using 'translate' separate from 'transform' to avoid conflict with mouse parallax
            node.style.translate = `${x}px ${y}px`;
        });
        requestAnimationFrame(animateNodes);
    }

    if (nodes.length > 0) {
        animateNodes();
    }
});
