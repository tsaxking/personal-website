document.querySelectorAll('.bg-hover').forEach(el => {
    el.classList.add(el.dataset.hoverOff);
    el.addEventListener('mouseover', () => {
        el.classList.add(el.dataset.hoverOn);
        el.classList.remove(el.dataset.hoverOff);
    });
    el.addEventListener('mouseout', () => {
        el.classList.remove(el.dataset.hoverOn);
        el.classList.add(el.dataset.hoverOff);
    });
});