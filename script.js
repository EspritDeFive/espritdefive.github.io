document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect for the sensibility nodes
    const nodes = document.querySelectorAll('.node');
    const hero = document.querySelector('.hero');

    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        nodes.forEach((node, index) => {
            const speed = (index + 1) * 0.05;
            const x = (clientX - centerX) * speed;
            const y = (clientY - centerY) * speed;
            node.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    });

    // Intersection Observer for scroll reveal
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply reveal effect to containers and sections
    document.querySelectorAll('section.container').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(section);
    });

    // Individual member cards staggered reveal
    const cards = document.querySelectorAll('.member-card');
    cards.forEach((card, index) => {
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
});
