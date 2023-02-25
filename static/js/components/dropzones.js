document.querySelectorAll('.dropzone', dz => {
    let drop = new Dropzone(dz.id, { url: dz.dataset.url });
});