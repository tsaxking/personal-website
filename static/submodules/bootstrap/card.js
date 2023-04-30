CustomBootstrap.cards = [];
CustomBootstrap.Card = class {
    constructor({
        body = '',
        footer = '',
        header = '',
        color = 'light',
        border = 'border',
        shadow = 'shadow',
        width = '100%',
        height = '100%',
        id = '',
        classes = [],
        attributes = {},
        minimize = false
    } = {}, parameters = {}) {
        this.options = {
            body,
            footer,
            header,
            color,
            border,
            shadow,
            width,
            height,
            id,
            classes,
            attributes,
            minimize
        };

        this.subElements = {};
        this.parameters = parameters;

        CustomBootstrap.cards.push(this);
        this.cardId = CustomBootstrap.cards.length - 1;

        this.render();
    }

    render() {
        let {
            body,
            footer,
            header,
            color,
            border,
            shadow,
            width,
            height,
            id,
            classes,
            attributes,
            minimize
        } = this.options;


        this.el = document.createElement('div');
        this.el.classList.add('card', `bg-${color}`, border, shadow, ...classes);
        this.el.style.width = width;
        this.el.style.height = height;
        this.el.id = id;
        Object.entries(attributes).forEach(([key, value]) => {
            this.el.setAttribute(key, value);
        });
        if (header) {
            this.subElements.header = document.createElement('div');
            this.subElements.header.classList.add('card-header');
            if (typeof header == 'string') {
                Object.entries(this.parameters).forEach(([key, value]) => {
                    header = header.replace(
                        new RegExp(`{{${key}}}`, 'g'),
                        `<span data-card-param="card-${this.cardId}-${key}">${value}</span>`
                    );
                });

                this.subElements.header.innerHTML = header;
            } else {
                header = CustomBootstrap.replaceAllInEl(header, this.parameters);
                this.subElements.header.appendChild(header);
            }

            if (minimize) {
                this.subElements.minimize = document.createElement('button');
                this.subElements.minimize.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'float-right');
                this.subElements.minimize.innerText = 'Minimize';
                this.subElements.minimize.addEventListener('click', () => {
                    this.subElements.body.classList.toggle('d-none');
                    this.subElements.footer.classList.toggle('d-none');
                    this.subElements.minimize.classList.toggle('rotate-180');
                });
                this.subElements.header.appendChild(this.subElements.minimize);
            }

            this.el.appendChild(this.subElements.header);
        }


        if (body) {
            this.subElements.body = document.createElement('div');
            this.subElements.body.classList.add('card-body');
            if (typeof body == 'string') {
                if (this.parameters) {
                    Object.entries(this.parameters).forEach(([key, value]) => {
                        body = body.replace(
                            new RegExp(`{{${key}}}`, 'g'),
                            `<span data-card-param="card-${this.cardId}-${key}">${value}</span>`
                        );
                    });
                }
                this.subElements.body.innerHTML = body;
            } else {
                if (this.parameters) {
                    // Object.entries(this.parameters).forEach(([key, value]) => {
                    //     body.innerHTML = body.innerHTML.replace(
                    //         new RegExp(`{{${key}}}`, 'g'),
                    //         `<span data-card-param="card-${this.cardId}-${key}">${value}</span>`
                    //     );
                    // });

                    body = CustomBootstrap.replaceAllInEl(body, this.parameters);
                }
                this.subElements.body.appendChild(body);
            }

            this.el.appendChild(this.subElements.body);
        }

        if (footer) {
            this.subElements.footer = document.createElement('div');
            this.subElements.footer.classList.add('card-footer');
            if (typeof footer == 'string') {
                if (this.parameters) {
                    Object.entries(this.parameters).forEach(([key, value]) => {
                        this.footer = this.footer.replace(
                            new RegExp(`{{${key}}}`, 'g'),
                            `<span data-card-param="card-${this.cardId}-${key}">${value}</span>`
                        );
                    });
                }
                this.subElements.footer.innerHTML = footer;
            } else {
                if (this.parameters) {
                    // Object.entries(this.parameters).forEach(([key, value]) => {
                    //     footer.innerHTML = footer.innerHTML.replace(
                    //         new RegExp(`{{${key}}}`, 'g'),
                    //         `<span data-card-param="card-${this.cardId}-${key}">${value}</span>`
                    //     );
                    // });

                    footer = CustomBootstrap.replaceAllInEl(footer, this.parameters);
                }
                this.subElements.footer.appendChild(footer);
            }

            this.el.appendChild(this.subElements.footer);
        }
    }

    read(param) {
        return Array.from(this.el.querySelectorAll(`[data-card-param="card-${this.cardId}-${param}"]`)).map(el => el.innerHTML);
    }

    write(param, value) {
        this.el.querySelectorAll(`[data-card-param="card-${this.cardId}-${param}"]`).forEach(el => {
            if (typeof value == 'string') {
                el.innerHTML = value;
            } else {
                el.innerHTML = '';
                el.appendChild(value);
            }
        });
    }

    destroy() {
        this.el.remove();
    }
}