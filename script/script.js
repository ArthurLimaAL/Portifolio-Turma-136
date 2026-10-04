/* =========================================================
   TURMA 136 - SCRIPT PRINCIPAL
   ========================================================= */

/* ---------------------------------------------------------
   1. MENU MOBILE - HAMBÚRGUER
   --------------------------------------------------------- */
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


/* ---------------------------------------------------------
   2. CARROSSEL DE ALUNOS - COM LOOP
   --------------------------------------------------------- */
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
    const cardWidth = () => cards[0]?.offsetWidth + 20; // largura + gap

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

    // Detecta início/fim do scroll para o loop
    const isAtStart = () => grid.scrollLeft <= 2;
    const isAtEnd = () => grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2;

    // Setas com LOOP: do último volta pro primeiro e do primeiro vai pro último
    prevBtn.addEventListener('click', () => {
        if (isAtStart()) {
            // Está no primeiro → vai para o último
            grid.scrollTo({ left: grid.scrollWidth - grid.clientWidth, behavior: 'smooth' });
        } else {
            grid.scrollBy({ left: -cardWidth() * 2, behavior: 'smooth' });
        }
    });

    nextBtn.addEventListener('click', () => {
        if (isAtEnd()) {
            // Está no último → volta para o primeiro
            grid.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            grid.scrollBy({ left: cardWidth() * 2, behavior: 'smooth' });
        }
    });

    grid.addEventListener('scroll', updateActiveDot, { passive: true });

    // Drag to scroll (arrastar com o mouse)
    let isDown = false, startX, scrollLeft;
    grid.addEventListener('mousedown', (e) => {
        isDown = true;
        grid.classList.add('dragging');
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

    // Inicializa os pontinhos e recalcula ao redimensionar a tela
    updateDots();
    window.addEventListener('resize', updateDots);
});