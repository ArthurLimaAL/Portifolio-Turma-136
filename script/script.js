
/* Menu mobile - hamburguer */
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('open');
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            nav.classList.remove('open');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        }
    });

    // Fecha ao clicar num link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        });
    });
});

/* Turma 136 - Carrossel de alunos - JS limpo, sem poluição */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.equipe-grid');
    if (!grid) return;

    // Cria wrapper para controles se não existir
    let wrap = document.querySelector('.turma-carousel-wrap');
    if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'turma-carousel-wrap';
        grid.parentNode.insertBefore(wrap, grid);
        wrap.appendChild(grid);
    }

    // Cria controles
    const controls = document.createElement('div');
    controls.className = 'turma-carousel-controls';
    controls.innerHTML = `
    <button class="carousel-btn prev" aria-label="Anterior"><i class="fa-solid fa-arrow-left"></i></button>
    <div class="carousel-dots" role="tablist"></div>
    <button class="carousel-btn next" aria-label="Próximo"><i class="fa-solid fa-arrow-right"></i></button>
  `;
    wrap.appendChild(controls);

    const prevBtn = controls.querySelector('.prev');
    const nextBtn = controls.querySelector('.next');
    const dotsContainer = controls.querySelector('.carousel-dots');

    const cards = [...grid.children];
    const cardWidth = () => cards[0]?.offsetWidth + 20; // gap

    // Dots = páginas visíveis
    const updateDots = () => {
        const pages = Math.ceil(grid.scrollWidth / grid.clientWidth) || 1;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('span');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                grid.scrollTo({ left: i * grid.clientWidth, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        }
    };

    const updateActiveDot = () => {
        const idx = Math.round(grid.scrollLeft / grid.clientWidth);
        [...dotsContainer.children].forEach((d, i) => d.classList.toggle('active', i === idx));
    };

    prevBtn.addEventListener('click', () => {
        grid.scrollBy({ left: -cardWidth() * 2, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
        grid.scrollBy({ left: cardWidth() * 2, behavior: 'smooth' });
    });

    grid.addEventListener('scroll', updateActiveDot, { passive: true });

    // Drag to scroll
    let isDown = false, startX, scrollLeft;
    grid.addEventListener('mousedown', (e) => {
        isDown = true; grid.classList.add('dragging');
        startX = e.pageX - grid.offsetLeft;
        scrollLeft = grid.scrollLeft;
    });
    grid.addEventListener('mouseleave', () => { isDown = false; });
    grid.addEventListener('mouseup', () => { isDown = false; });
    grid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - grid.offsetLeft;
        const walk = (x - startX) * 1.4;
        grid.scrollLeft = scrollLeft - walk;
    });

    // Autoplay suave (pausa no hover)
    let autoplay = setInterval(() => {
        if (grid.matches(':hover')) return;
        if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 10) {
            grid.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            grid.scrollBy({ left: cardWidth(), behavior: 'smooth' });
        }
    }, 4200);

    grid.addEventListener('mouseenter', () => clearInterval(autoplay));
    grid.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => {
            if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 10) {
                grid.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                grid.scrollBy({ left: cardWidth(), behavior: 'smooth' });
            }
        }, 4200);
    });

    // Inicial
    updateDots();
    window.addEventListener('resize', updateDots);
});
