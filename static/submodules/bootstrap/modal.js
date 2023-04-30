CustomBootstrap.modals = [];
CustomBootstrap.Modal = class {
    constructor(options, parameters = {}) {
        this.options = options;
        this.parameters = parameters;
        this.render();
    }

    render() {
        let {
            title = '',
                body = '',
                footer = '',
                size = 'md'
        } = this.options;

        this.el = document.createElement('div');
        this.el.classList.add('modal', 'fade');
        this.el.setAttribute('tabindex', '-1');
        this.el.setAttribute('role', 'dialog');
        this.el.setAttribute('aria-labelledby', 'modalLabel');
        this.el.setAttribute('aria-hidden', 'true');

        this.modalId = CustomBootstrap.modals.length;

        this.el.innerHTML = `
            <div class="modal-dialog modal-${size}" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    </div>
                    <div class="modal-footer">
                    </div>
                </div>
            </div>
        `;

        if (typeof title === 'string') {
            if (this.parameters) {
                Object.entries(this.parameters).forEach(([key, value]) => {
                    title = title.replace(
                        new RegExp(`{{${key}}}`, 'g'),
                        `<span data-modal-param="modal-${this.cardId}-${key}">${value}</span>`
                    );
                });
            }

            this.el.querySelector('.modal-title').innerHTML = title;
        } else {
            if (this.parameters) {
                title = CustomBootstrap.replaceAllInEl(title, this.parameters);
            }
            this.el.querySelector('.modal-title').appendChild(title);
        }

        if (typeof body === 'string') {
            if (this.parameters) {
                Object.entries(this.parameters).forEach(([key, value]) => {
                    body = body.replace(
                        new RegExp(`{{${key}}}`, 'g'),
                        `<span data-modal-param="modal-${this.cardId}-${key}">${value}</span>`
                    );
                });
            }
            this.el.querySelector('.modal-body').innerHTML = body;
        } else {
            if (this.parameters) {
                body = CustomBootstrap.replaceAllInEl(body, this.parameters);
            }

            this.el.querySelector('.modal-body').appendChild(body);
        }

        if (typeof footer === 'string') {
            if (this.parameters) {
                Object.entries(this.parameters).forEach(([key, value]) => {
                    footer = footer.replace(
                        new RegExp(`{{${key}}}`, 'g'),
                        `<span data-modal-param="modal-${this.cardId}-${key}">${value}</span>`
                    );
                });
            }

            this.el.querySelector('.modal-footer').innerHTML = footer;
        } else {
            if (this.parameters) {
                footer = CustomBootstrap.replaceAllInEl(footer, this.parameters);
            }

            this.el.querySelector('.modal-footer').appendChild(footer);
        }

        this.subElements = {
            title: this.el.querySelector('.modal-title'),
            body: this.el.querySelector('.modal-body'),
            footer: this.el.querySelector('.modal-footer')
        }

        CustomBootstrap.modals.push(this);

        document.body.append(this.el);
    }

    read(param) {
        return Array.from(this.el.querySelectorAll(`[data-modal-param="modal-${this.modalId}-${param}"]`)).map(el => el.innerHTML);
    }

    write(param, value) {
        this.el.querySelectorAll(`[data-modal-param="modal-${this.modalId}-${param}"]`).forEach(el => {
            if (typeof value === 'string') {
                el.innerHTML = value;
            } else {
                el.append(value);
            }
        });
    }

    destroy() {
        this.el.remove();
    }

    show() {
        $(this.el).modal('show');
    }

    hide() {
        $(this.el).modal('hide');
    }
}