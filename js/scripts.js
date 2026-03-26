(() => {
    const carousel = document.querySelector('.cards');
    if (!carousel) return;

    const cards = Array.from(carousel.querySelectorAll('.card'));
    const slider = carousel.closest('.slider');

    const leftBtn = slider?.querySelector('.arrow.left');
    const rightBtn = slider?.querySelector('.arrow.right');

    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = modal?.querySelector('.modal-close');
    const modalSections = Array.from(modal?.querySelectorAll('.modal-section') || []);

    const isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let activeIndex = 0;
    let ticking = false;
    let arrowHideTimer = null;
    let lastFocus = null;

    function setActiveCardByIndex(index) {
        activeIndex = Math.max(0, Math.min(index, cards.length - 1));

        cards.forEach((card, i) => {
            const isActive = i === activeIndex;
            card.classList.toggle('active', isActive);
            card.disabled = !isActive; // only active card should be clickable
            card.setAttribute('aria-disabled', String(!isActive));
        });
    }

    function updateActiveFromScroll() {
        const containerCenter = carousel.scrollLeft + carousel.clientWidth / 2;

        let bestIndex = activeIndex;
        let bestDistance = Infinity;

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const cardCenter = card.offsetLeft + card.clientWidth / 2;
            const distance = Math.abs(containerCenter - cardCenter);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestIndex = i;
            }
        }

        setActiveCardByIndex(bestIndex);
    }

    function scrollToCard(index) {
        const card = cards[index];
        if (!card) return;

        const left = card.offsetLeft - (carousel.clientWidth - card.clientWidth) / 2;
        carousel.scrollTo({ left, behavior: isReducedMotion ? 'auto' : 'smooth' });
    }

    function openModalFor(type) {
        if (!modal || !modalContent) return;

        const section = document.getElementById(`${type}-content`);
        if (!section) return;

        modalSections.forEach((s) => s.classList.toggle('active', s === section));

        modal.classList.add('active');
        modalContent.scrollTop = 0; // reset scroll on every open

        document.body.style.overflow = 'hidden';
        lastFocus = document.activeElement;
        modalCloseBtn?.focus?.();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modalSections.forEach((s) => s.classList.remove('active'));
        document.body.style.overflow = '';

        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    // Keep active card in sync with scroll position
    carousel.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            updateActiveFromScroll();
            ticking = false;
        });
    });

    // Init: middle card active
    window.addEventListener('load', () => {
        const initialIndex = cards.length >= 3 ? 1 : 0;
        setActiveCardByIndex(initialIndex);
        window.requestAnimationFrame(() => scrollToCard(initialIndex));
    });

    window.addEventListener('resize', () => updateActiveFromScroll());

    // Only active card can open modal
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            if (card.disabled) return;
            openModalFor(card.dataset.type);
        });
    });

    // Arrows
    leftBtn?.addEventListener('click', () => {
        const nextIndex = activeIndex - 1;
        setActiveCardByIndex(nextIndex);
        scrollToCard(nextIndex);
    });

    rightBtn?.addEventListener('click', () => {
        const nextIndex = activeIndex + 1;
        setActiveCardByIndex(nextIndex);
        scrollToCard(nextIndex);
    });

    // Modal interactions
    modalCloseBtn?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (e) => {
        // Only close when user clicks the backdrop (not modal content)
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Mobile arrow auto-hide (desktop stays visible via CSS)
    const isMobile = window.matchMedia?.('(max-width: 767px)').matches;
    if (isMobile) {
        const showArrowsTemporarily = () => {
            if (!slider) return;
            slider.classList.add('show-arrows');
            if (arrowHideTimer) window.clearTimeout(arrowHideTimer);
            arrowHideTimer = window.setTimeout(() => slider.classList.remove('show-arrows'), 2500);
        };

        window.addEventListener('touchstart', showArrowsTemporarily, { passive: true });
        window.addEventListener('pointerdown', showArrowsTemporarily, { passive: true });
        window.addEventListener('mousemove', showArrowsTemporarily, { passive: true });
    }
})();
/*анті-школьнік-угон*/
document.addEventListener("keydown", e => {
    if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
    ) {
        e.preventDefault();
        alert("DevTools заблоковано.");
    }
});