// target elements with the "draggable" class
interact('.swap')
    .draggable({
        // enable inertial throwing
        inertia: false,
        // keep the element within the area of it's parent
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
        ],
        // enable autoScroll
        autoScroll: true,

        listeners: {
            // call this function on every dragmove event
            move: dragMoveListener,
            end: (e) => {
                // if (e.target.dataset.reset == 'true') resetDrag(e.target);
            }
        }
    });

interact('.swap')
    .dropzone({
        overlap: .5,
        accept: '.swap',
        ondropactivate: (e) => {
            // console.log('drop activate');
        },
        ondragenter: (e) => {
            e.target.classList.add('bg-info');
            e.target.classList.remove('bg-secondary');

            e.relatedTarget.dataset.swap = 'true';
        },
        ondragleave: (e) => {
            e.target.classList.remove('bg-info');
            e.target.classList.add('bg-secondary');

            e.relatedTarget.dataset.swap = 'false';
        },
        ondrop: (e) => {
            e.target.classList.remove('bg-info');
            e.target.classList.add('bg-secondary');
            swapElements(e.target, e.relatedTarget);
        },
        ondropdeactivate: (e) => {
            // console.log('drop deactivate');

            if (e.relatedTarget.dataset.swap == 'false') resetDrag(e.relatedTarget);
        }
    });

function dragMoveListener(event, scale) {
    if (!scale) scale = 1;

    console.log(event);


    const {
        target
    } = event;
    target.dataset.reset = true;

    target.style.zIndex = '9999999999999999999';

    // keep the dragged position in the data-x/data-y attributes
    var x = scale * ((parseFloat(target.getAttribute('data-x')) || 0) + event.dx);
    var y = scale * ((parseFloat(target.getAttribute('data-y')) || 0) + event.dy);

    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function resetDrag(target) {
    // keep the dragged position in the data-x/data-y attributes
    var x = 0;
    var y = 0;
    target.style.zIndex = '';

    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function swapElements(from, to) {
    let fromClone = from.cloneNode(true);
    let toClone = to.cloneNode(true);

    from.replaceWith(toClone);

    to.replaceWith(fromClone);

    resetDrag(toClone);
    resetDrag(fromClone);
}