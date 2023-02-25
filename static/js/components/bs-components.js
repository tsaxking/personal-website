function createPdfCard(pdf, buttons, classes) {
    const { filename, src, size } = pdf;

    const col = createElementFromSelector(`div${classes ? classes : '.col-md-6.col-sm-12.col-xs-12.h-100.mb-1'}@data-pdf=${src}`);

    const card = createElementFromSelector('div.card');

    const header = document.createElement('div');
    header.classList.add('card-header');
    header.innerHTML = `<h6>${filename}</h6>`;
    card.appendChild(header);

    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.setAttribute('src', '../static/pictures/icons/pdf.png');
    img.style.width = '100%';
    card.appendChild(img);

    // create buttons
    const body = document.createElement('div');
    body.classList.add('card-body');

    if (size) {
        let sizeText = document.createElement('p');
        sizeText.innerHTML = formatBytes(size);
        body.appendChild(sizeText);
    }

    const view = createButton('<i class="material-icons">preview</i>', ['bg-green', 'text-gray-light'], [{
        type: 'click',
        action: (e) => {
            $('#edit-lib-piece-modal').modal('hide');
            openPage('/pdf-editor');
            renderPdfEditor(src);
        }
    }]);

    view.classList.add('m-1');

    body.appendChild(view);

    if (buttons) {
        buttons.forEach(btn => {
            btn.classList.add('m-1');
            body.appendChild(btn);
        });
    }

    card.appendChild(body);
    col.appendChild(card);
    return col;
}

function createCsvCard(csv, buttons, classes) {
    const { filename, src, size } = csv;

    const col = createElementFromSelector(`div${classes ? classes : '.col-md-6.col-sm-12.col-xs-12.h-100.mb-1'}@data-pdf=${src}`);

    const card = createElementFromSelector('div.card');

    const header = document.createElement('div');
    header.classList.add('card-header');
    header.innerHTML = `<h6>${filename}</h6>`;
    card.appendChild(header);

    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.setAttribute('src', '../static/pictures/icons/csv.png');
    img.style.width = '100%';
    card.appendChild(img);

    // create buttons
    const body = document.createElement('div');
    body.classList.add('card-body');

    if (size) {
        let sizeText = document.createElement('p');
        sizeText.innerHTML = formatBytes(size);
        body.appendChild(sizeText);
    }

    const view = createButton('<i class="material-icons">preview</i>', ['bg-green', 'text-gray-light'], [{
        type: 'click',
        action: (e) => {
            // $('#edit-lib-piece-modal').modal('hide');
            openPage('/view-csv');
            // renderPdfEditor(src);
        }
    }]);

    view.classList.add('m-1');

    body.appendChild(view);

    if (buttons) {
        buttons.forEach(btn => {
            btn.classList.add('m-1');
            body.appendChild(btn);
        });
    }

    card.appendChild(body);
    col.appendChild(card);
    return col;
}