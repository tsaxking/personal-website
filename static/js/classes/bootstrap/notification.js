const allNotifications = [];
CustomBootstrap.Notification = class {
    /**
     * 
     * @param {Object} options Notification options
     * @param {String} options.msg content of body
     * @param {String} options.status bs color
     * @param {String} options.title title, defaults to 'sfzMusic'
     * @param {Number} options.length in seconds
     */
    constructor({
        msg,
        status,
        title,
        length
    }) {
        this.msg = msg;
        this.status = status || 'info';
        this.title = title || currentPage.title;
        this.length = length;

        this.initialized = new Date();

        this.createEl();
        this.create();
        this.show();
        this.removed = false;
    }

    createEl() {
        const toast = document.createElement('div');
        toast.classList.add('toast', `bg-${this.status}`, 'notification');
        toast.id = 'notification-' + numNotifs;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        const header = document.createElement('div');
        header.classList.add('toast-header',
            'bg-dark',
            'd-flex',
            'justify-content-between'
        );

        const strong = document.createElement('strong');
        strong.classList.add('mr-auto', `text-${this.color}`);
        strong.innerText = this.title ? this.title : 'sfzMusic';
        header.appendChild(strong);

        const small = document.createElement('small');
        small.classList.add('text-muted');
        small.innerText = (this.initialized).toLocaleString();
        header.appendChild(small);

        this.button = document.createElement('button');
        this.button.setAttribute('type', 'button');
        this.button.classList.add(
            'ml-2',
            'mb-1',
            'bg-dark',
            'border-0',
            'text-light'
        );
        this.button.setAttribute('data-dismiss', 'toast');


        const span = document.createElement('span');
        span.setAttribute('aria-hidden', 'true');
        span.innerHTML = '&times;';
        this.button.appendChild(span);
        header.appendChild(this.button);
        toast.appendChild(header);

        const body = document.createElement('div');
        body.classList.add('toast-body');
        body.innerText = this.msg;
        toast.appendChild(body);

        this.element = toast;
    }

    create() {
        setTimeout(() => {
            this.remove();
        }, this.length ? this.length * 1000 : 1000 * 5);

        this.button.addEventListener('click', () => {
            if (!this.removed) {
                this.remove();
                clearTimeout(this.timeout);
            }
        });

        document.querySelector('#notifications').appendChild(this.element);

        allNotifications.push(this);
    }

    show() {
        try {
            // Shows toast using bs api
            $(`#notification-${numNotifs}`).toast({
                animation: true,
                autohide: true,
                delay: this.length ? this.length * 1000 : 1000 * 5
            });
            $(`#notification-${numNotifs}`).toast('show');
            $(`#${this.element.id}`).on('hidden.bs.toast', () => {
                this.remove();
            });
        } catch (err) {
            console.warn('Bootstrap may not be loaded. (notification.js)');
            console.error(err);
        }
    }

    remove() {
        this.removed = true;
        this.element.remove();
    }
}