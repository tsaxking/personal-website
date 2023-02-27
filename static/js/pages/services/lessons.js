// const saxophoneCanvas = new Canvas(document.querySelector('#saxophone-canvas'));
// const compositionCanvas = new Canvas(document.querySelector('#composition-canvas'));

// const saxophoneTOS = new PDF('../static/pdfs/saxophone_tos.pdf');
// const compositionTOS = new PDF('../static/pdfs/composition_tos.pdf');

const resize = () => {
    // TODO: resize canvases
}

(async() => {
    await saxophoneTOS.load();
    await compositionTOS.load();
}); // TODO: will impliment after alexarose foundation grant