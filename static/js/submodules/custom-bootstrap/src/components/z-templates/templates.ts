(() => {
    const card = new CBS_Card();

    card.subcomponents.image = new CBS_Image();
    card.subcomponents.header.prepend(card.subcomponents.image);

    CBS_Card.addTemplate('image', card);
})();