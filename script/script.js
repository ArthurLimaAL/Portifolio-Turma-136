document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.equipe-grid');
    if (!grid) return;

    let wrap = document.querySelector('.turma-carousel-wrap');
    if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'turma-carousel-wrap';
        grid.parentNode.insertBefore(wrap, grid);
        wrap.appendChild(grid);
    }

    const oldControls = wrap.querySelector('.turma-carousel-controls');
    if (oldControls) oldControls.remove();


    const controls = document.createElement('div');
    controls.className = 'turma-carousel-controls';
    controls.innerHTML = `
    <button class="carousel-btn prev" aria-label="Voltar ao início"><i class="fa-solid fa-arrow-left"></i></button>
    <button class="carousel-btn next" aria-label="Próximo"><i class="fa-solid fa-arrow-right"></i></button>
  `;
    wrap.appendChild(controls);

    const prevBtn = controls.querySelector('.prev');
    const nextBtn = controls.querySelector('.next');
    const cards = [...grid.children];
    const cardWidth = () => (cards[0]?.offsetWidth || 268) + 20;
    const maxScroll = () => grid.scrollWidth - grid.clientWidth;

    const isAtEnd = () => grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 10;
    const isAtStart = () => grid.scrollLeft <= 10;
    nextBtn.addEventListener('click', () => {
        if (isAtEnd()) {
            grid.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            grid.scrollBy({ left: cardWidth() * 2, behavior: 'smooth' });
        }
    });

    prevBtn.addEventListener('click', () => {

        grid.scrollTo({ left: 0, behavior: 'smooth' });

    });

    let isDown = false, startX, scrollLeft;
    grid.addEventListener('mousedown', (e) => {
        isDown = true;
        grid.classList.add('dragging');
        startX = e.pageX - grid.offsetLeft;
        scrollLeft = grid.scrollLeft;
    });
    const stopDrag = () => { isDown = false; grid.classList.remove('dragging'); };
    grid.addEventListener('mouseleave', stopDrag);
    grid.addEventListener('mouseup', stopDrag);
    grid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - grid.offsetLeft;
        const walk = (x - startX) * 1.4;
        grid.scrollLeft = scrollLeft - walk;
    });

    let autoplay = setInterval(() => {
        if (grid.matches(':hover')) return;
        if (isAtEnd()) {
            grid.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            grid.scrollBy({ left: cardWidth(), behavior: 'smooth' });
        }
    }, 4000);

    grid.addEventListener('mouseenter', () => clearInterval(autoplay));
    grid.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => {
            if (isAtEnd()) {
                grid.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                grid.scrollBy({ left: cardWidth(), behavior: 'smooth' });
            }
        }, 4000);
    });
});
