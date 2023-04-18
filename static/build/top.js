;
class CustomBootstrap {
    static replaceAllInEl(el, parameters) {
        // replaces every instance of {{param}} with the value of parameters[param]
        // runs recursively on all children of el
        // returns el
        if (typeof el == 'string') {
            Object.entries(parameters).forEach(([key, value]) => {
                el = el.replace(
                    new RegExp(`{{${key}}}`, 'g'),
                    `<span data-card-param="card-${this.cardId}-${key}">${value}</span>`
                );
            });
        } else {
            if (el.children) {
                Array.from(el.children).forEach(child => {
                    this.replaceAllInEl(child, parameters);
                });
            }
        }

        return el;
    }
};
CustomBootstrap.ButtonGroups = [];
CustomBootstrap.ButtonGroup = class {
    /**
     * 
     * @param {HTMLElement} el The HTML element of the button group (optional)
     */
    constructor(el) {
        if (el) el.innerHTML = '';
        /**
         * @type {HTMLElement} The HTML element of the button group
         */
        this.el = el || document.createElement('div');
        this.el.classList.add('btn-group');

        /**
         * @type {CustomBootstrap.Button[]} The buttons in the group
         */
        this.buttons = [];
        CustomBootstrap.ButtonGroups.push(this);
    }

    /**
     * Adds a button to the group
     * @param {...CustomBootstrap.Button} button CustomBootstrap.Button to add to the group 
     */
    addButton(...button) {
        this.buttons.push(...button);
        button.forEach(b => this.el.appendChild(b.el));
    }

    /**
     * Removes a button from the group
     * @param {CustomBootstrap.Button} button CustomBootstrap.Button to remove from the group
     */
    removeButton(button) {
        this.buttons.splice(this.buttons.indexOf(button), 1);
        this.el.removeChild(button.el);
    }
};
CustomBootstrap.Button = class {
    constructor({
        content = '',
        type = 'button',
        classes = [],
        attributes = {},
        parameters = {},
        onclick = () => {}
    }, params = {}) {
        this.options = {
            content,
            type,
            classes,
            attributes,
            onclick,
            parameters
        };

        this.parameters = params;
        this.render();
    }

    render() {
        this.el = document.createElement('button');
        this.el.classList.add('btn', ...this.options.classes);
        this.el.type = this.options.type;

        if (this.options.content) {
            if (typeof this.options.content == 'string') {
                Object.entries(this.parameters).forEach(([key, value]) => {
                    this.options.content = this.options.content.replace(
                        new RegExp(`{{${key}}}`, 'g'),
                        `<span data-card-param="card-${this.cardId}-${key}">${value}</span>`
                    );
                });
                this.el.innerHTML = this.options.content;
            } else {
                CustomBootstrap.replaceAllInEl(this.options.content, this.parameters);
                this.el.appendChild(this.options.content);
            }
        }

        Object.entries(this.options.attributes).forEach(([key, value]) => {
            this.el.setAttribute(key, value);
        });
        this.el.onclick = this.options.onclick;
    }

    read(param) {
        return Array.from(this.el.querySelectorAll(`[data-card-param="card-${this.cardId}-${param}"]`)).map(el => el.innerHTML);
    }

    write(param, value) {
        this.parameters[param] = value;
        Array.from(this.el.querySelectorAll(`[data-card-param="card-${this.cardId}-${param}"]`)).forEach(el => el.innerHTML = value);

        CustomBootstrap.replaceAllInEl(this.el, {
            [param]: value
        });
    }

    disable() {
        this.el.disabled = true;
    }

    enable() {
        this.el.disabled = false;
    }
};
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
};
CustomBootstrap.Column = class {
    constructor(options = {
        classes: [],
        attributes: {},
        width: '100%',
        height: '100%',
        content: ''
    }) {
        this.options = options;
        this.render();
    }

    render() {
        this.el = document.createElement('div');
        this.el.classList.add('col', ...this.options.classes);
        this.el.style.width = this.options.width;
        this.el.style.height = this.options.height;
        Object.entries(this.options.attributes).forEach(([key, value]) => {
            this.el.setAttribute(key, value);
        });
        this.el.innerHTML = this.options.content;
    }
};
CustomBootstrap.confirm = (message, options) => {
    return new Promise((res, rej) => {
        const shake = (el) => {
            el.classList.add('animate__animated', 'animate__shakeX');
            el.addEventListener('animationend', () => {
                el.classList.remove('animate__animated', 'animate__shakeX', 'animate__fast');
            });
        }

        const confirm = new CustomBootstrap.ConfirmModal(message, options);

        confirm.modal.el.addEventListener('hidden.bs.modal', () => {
            confirm.modal.el.remove();
            res(false);
        });

        confirm.modal.el.querySelector('.confirm-btn').addEventListener('click', () => {
            if (confirm.options.password) {
                if (confirm.modal.el.querySelector('input').value !== confirm.options.password) {
                    return shake(confirm.modal.el);
                }
            }

            if (confirm.options.enterText) {
                if (confirm.modal.el.querySelector('input').value !== confirm.options.enterText) {
                    return shake(confirm.modal.el);
                }
            }


            res(true);
            $(confirm.modal.el).modal('hide');
        });

        confirm.modal.el.querySelector('.cancel-btn').addEventListener('click', () => {
            res(false);
            $(confirm.modal.el).modal('hide');
        });

        confirm.modal.show();

        confirm.modal.el.querySelector('.confirm-btn').focus();
    });
}
CustomBootstrap.ConfirmModal = class {
    constructor(message, {
        title = '<span class="no-select">Confirm</span>',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        confirmClass = 'btn-primary',
        cancelClass = 'btn-secondary',
        password = false,
        enterText = false,
        buttons = []
    } = {}) {
        this.message = message;
        this.options = {
            title,
            confirmText,
            cancelText,
            confirmClass,
            cancelClass,
            password,
            enterText,
            buttons
        };

        this.render();
    }

    render() {
        const {
            title,
            confirmText,
            cancelText,
            confirmClass,
            cancelClass,
            password,
            enterText,
            buttons
        } = this.options;

        const body = document.createElement('div');
        const p = document.createElement('p');
        p.innerHTML = this.message;
        body.append(p);

        if (password) {
            const input = document.createElement('input');
            input.type = 'password';
            input.classList.add('form-control');
            input.placeholder = 'Password';
            body.append(input);
        }

        if (enterText) {
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('form-control');
            input.placeholder = 'Type: ' + enterText;
            body.append(input);
        }

        this.modal = new CustomBootstrap.Modal({
            title,
            body,
            footer: `
                <button type="button" class="btn ${confirmClass} confirm-btn" data-dismiss="modal">${confirmText}</button>
                <button type="button" class="btn ${cancelClass} cancel-btn" data-dismiss="modal">${cancelText}</button>
            `
        });
    }
};
CustomBootstrap.contextMenus = [];
CustomBootstrap.ContextMenu = class {
    constructor(element, sections, options = {}) {
        this.element = element;
        this.sections = sections;
        this.options = options;
        this.element.addEventListener('contextmenu', this.render.bind(this));

        Bootstrap.contextMenus.push(this);
    }

    render(e) {
        const {
            ignoreFrom
        } = this.options;



        const ignoreEls = [];
        if (Array.isArray(ignoreFrom)) {
            ignoreFrom.forEach(i => {
                el.querySelectorAll(i).forEach(_e => {
                    ignoreEls.push(_e);
                });
            });
            // return if the element is in the ignore list or is a child of one of the ignore list elements.
            if (ignoreEls.some(i => i.contains(e.target))) {
                // console.log('Ignoring right click');
                return;
            }
        }

        e.preventDefault();
        const contextmenuContainer = document.querySelector('#contextmenu-container');

        const menu = createElementFromSelector('div.contextmenu.show.bg-dark.text-light.animate__animated.animate__flipInY.animate__faster');
        menu.innerHTML = '';

        this.sections.forEach(section => {
            const { name, items } = section;
            // const sectionEl = document.createElement('li');
            const sectionTitle = createElementFromSelector('p.ws-nowrap.bg-dark.text-secondary.p-1.rounded.m-0.no-select');
            sectionTitle.innerHTML = name;
            // sectionEl.appendChild(sectionTitle);
            menu.appendChild(sectionTitle);

            // const sectionDivider = document.createElement('li');
            const sectionDividerEl = createElementFromSelector('hr.dropdown-divider.bg-light.m-0');
            // sectionDivider.appendChild(sectionDividerEl);
            menu.appendChild(sectionDividerEl);

            items.forEach(item => {
                const { name, func, color } = item;
                // const itemEl = document.createElement('li');
                const itemElLink = createElementFromSelector('p.ws-nowrap.cursor-pointer.bg-dark.text-light.m-0.p-1.rounded');

                itemElLink.addEventListener('mouseover', () => {
                    itemElLink.classList.remove('bg-dark');
                    itemElLink.classList.add(`bg-${color ? color : 'primary'}`);
                });
                itemElLink.addEventListener('mouseout', () => {
                    itemElLink.classList.remove(`bg-${color ? color : 'primary'}`);
                    itemElLink.classList.add('bg-dark');
                });

                itemElLink.innerHTML = name;
                itemElLink.addEventListener('click', func);
                // itemEl.appendChild(itemElLink);
                menu.appendChild(itemElLink);
            });
        });

        const { clientX: mouseX, clientY: mouseY } = e;
        contextmenuContainer.style.left = mouseX + 'px';
        contextmenuContainer.style.top = mouseY + 'px';
        contextmenuContainer.appendChild(menu);
    }

    removeListener() {
        return this.element.removeEventListener('contextmenu', this.render.bind(this));
    }

    hide() {
        const contextmenuContainer = document.querySelector('#contextmenu-container');
        contextmenuContainer.innerHTML = '';
    }
};
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
};
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
};
CustomBootstrap.Row = class {
    constructor(options = {
        columns: [],
        classes: [],
        attributes: {}
    }) {
        this.options = options;
        this.render();
    }

    render() {
        this.el = document.createElement('div');
        this.el.classList.add('row', ...this.options.classes);
        Object.entries(this.options.attributes).forEach(([key, value]) => {
            this.el.setAttribute(key, value);
        });
        this.options.columns.forEach(column => {
            this.el.appendChild(column.el);
        });
    }
};
CustomBootstrap.Selects = [];
CustomBootstrap.Select = class {
    constructor(el) {
        this.el = el;
        this.el.classList.add('form-select');
        CustomBootstrap.Selects.push(this);

        this.options = [];
    }

    addOption(text, value, selected = false) {
        const option = document.createElement('option');
        option.innerText = text;
        option.value = value;
        option.selected = selected;
        this.el.appendChild(option);
    }

    removeOption(value) {
        this.el.querySelector(`option[value="${value}"]`).remove();
    }

    get value() {
        return this.el.value;
    }

    set value(value) {
        this.el.value = value;
    }

    disableOption(value) {
        this.el.querySelector(`option[value="${value}"]`).disabled = true;
    }

    enableOption(value) {
        this.el.querySelector(`option[value="${value}"]`).disabled = false;
    }

    isDisabled(value) {
        return this.el.querySelector(`option[value="${value}"]`).disabled;
    }

    disable() {
        this.el.disabled = true;
    }

    enable() {
        this.el.disabled = false;
    }

    clearOptions() {
        this.el.innerHTML = '';
    }
};
class Calendar {};
class Day {
    /**
     * 
     * @param {Date} date date object
     */
    constructor(date) {
        this.date = date;
        this.month = new Month(date);
        this.week = new Week(date);
    }

    next() {
        const date = new Date(this.date);
        date.setDate(date.getDate() + 1);
        return new Day(date);
    }

    prev() {
        const date = new Date(this.date);
        date.setDate(date.getDate() - 1);
        return new Day(date);
    }
};
class Month {
    /**
     * @param {Date} date date object
     */
    constructor(date) {
        this.date = date;

        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const day = new Date(date);
        day.setDate(1);
        this.days = new Array(daysInMonth).fill(0).map((_, i) => {
            const date = new Date(day);
            date.setDate(date.getDate() + i);
            return new Day(date);
        });
    }

    next() {
        const date = new Date(this.date);
        date.setMonth(date.getMonth() + 1);
        return new Month(date);
    }

    prev() {
        const date = new Date(this.date);
        date.setMonth(date.getMonth() - 1);
        return new Month(date);
    }

    get start() {
        return this.days[0].date;
    }

    get end() {
        return this.days[this.days.length - 1].date;
    }

    get weeks() {
        const weeks = [];
        let week = new Week(this.start);
        while (week.start < this.end) {
            weeks.push(week);
            week = week.next();
        }
        return weeks;
    }
};
class Week {
    /**
     * @param {Date} date date object
     */
    constructor(date) {
        this.date = date;
        this.month = new Month(date);

        const day = new Date(date);
        day.setDate(day.getDate() - day.getDay());
        this.days = new Array(7).fill(0).map((_, i) => {
            const date = new Date(day);
            date.setDate(date.getDate() + i);
            return new Day(date);
        });
    }

    next() {
        const date = new Date(this.date);
        date.setDate(date.getDate() + 7);
        return new Week(date);
    }

    prev() {
        const date = new Date(this.date);
        date.setDate(date.getDate() - 7);
        return new Week(date);
    }

    get start() {
        return this.days[0].date;
    }

    get end() {
        return this.days[6].date;
    }
};
class Canvas {
    /**
     * Creates a new canvas
     * @param {HTMLElement} canvas the canvas element you want to create a class for
     */
    constructor(canvas, options = {}) {
        if (!options.state) {
            options.state = {
                onChange: () => {},
                onReject: () => {},
                onClear: () => {}
            };
        }

        /**
         * @type {HTMLElement} the canvas element
         */
        this.canvas = canvas;
        /**
         * @type {Object} the options object
         */
        this.options = options;
        /**
         * @type {CanvasRenderingContext2D} the canvas context
         */
        this.context = canvas.getContext('2d');

        /**
         * @type {Array[Any]} the elements on the canvas
         */
        this.elements = [];
        /**
         * @type {Boolean} whether or not the canvas is animating
         */
        this.animating = false;

        this.canvas.addEventListener('click', this.onclick.bind(this));

        this.canvas.addEventListener('mousedown', this.onstart.bind(this));
        this.canvas.addEventListener('mousemove', this.onmove.bind(this));
        this.canvas.addEventListener('mouseup', this.onend.bind(this));

        this.canvas.addEventListener('touchstart', this.onstart.bind(this));
        this.canvas.addEventListener('touchmove', this.onmove.bind(this));
        this.canvas.addEventListener('touchend', this.onend.bind(this));
        this.canvas.addEventListener('touchcancel', this.onend.bind(this));

        /**
         * @type {StateStack} the state stack
         */
        this.stack = new StateStack(options.state.onChange, options.state.onClear, options.state.onReject);
    }

    /**
     * Adds a state to the stack
     */
    async addState() {
        const img = new CanvasImage(this.canvas.toDataURL());
        await img.render();
        this.stack.addState({
            image: img
        });
    }

    /**
     * @private
     */
    onstart(e) {
        // console.log('Canvas start');

        // get x and y as % of canvas size
        const { x, y } = this.getXY(e);

        this.elements.forEach(el => {
            if (el.onstart && el.isIn && el.isIn(x, y, this)) {
                el.onstart(e, el);
            }
        });
    }

    /**
     * @private
     */
    onclick(e) {
        // console.log('Canvas click');

        // get x and y as % of canvas size
        const { x, y } = this.getXY(e);

        this.elements.forEach(el => {
            if (el.onclick && el.isIn && el.isIn(x, y, this)) {
                el.onclick(e, el);
            }
        });
    }

    /**
     * @private
     */
    onmove(e) {
        // console.log('Canvas move');

        e.preventDefault();
        // get x and y as % of canvas size
        const { x, y } = this.getXY(e);

        this.elements.forEach(el => {
            if (el.onmove && el.isIn && el.isIn(x, y, this)) {
                el.onmove(e, el);
            }
        });
    }

    /**
     * @private
     */
    onend(e) {
        // console.log('Canvas end');

        // get x and y as % of canvas size
        const { x, y } = this.getXY(e);

        this.elements.forEach(el => {
            if (el.onend && el.isIn && el.isIn(x, y, this)) {
                el.onend(e, el);
            }
        });
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    /**
     * Clears the canvas 
     * NOTE: This doesn't remove images!!!
     */
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Adds an element that will run element.draw() when you run canvas.draw()
     * @param {Object} element an element with a draw function
     * @param  {Function} element.draw A function that will draw onto this canvas
     */
    add(...element) {
        this.elements.unshift(...element.filter(e => {
            if (e.__added) {
                console.warn('Element already added to a canvas. You may have some dependencies between canvases or you added the same element twice.');
                if (this.options.skipDuplicates) return false;
            }
            e.__added = true;
            return e;
        }));
    }

    /**
     * Removes an element from this canvas' element list
     * @param {Object} element an element with a draw function
     * @param  {Function} element.draw A function that will draw onto this canvas
     */
    remove(element) {
        if (element.added) this.elements.splice(this.elements.indexOf(element), 1);

        element.added = false;
    }

    /**
     * Resizes the canvas to a certain width and height
     * @param {number} width the width you want to resize the canvas to 
     * @param {number} height the height you want to resize the canvas to 
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    /**
     * - Clears the canvas
     * - Calls element.draw() for each element in canvas.elements
     */
    draw() {
        // console.log('Drawing canvas');
        this.clear();
        this.elements.forEach(element => element.draw(this));
    }

    /**
     * Draws a frame onto the canvas
     * @param {CanvasImage} img canvas image to draw
     */
    drawFrame(img) {
        this.stop();
        this.clear();
        img.draw(this);
    }

    /**
     * Repeatedly redraws each element then runs a function on it
     * @param {function} animateFunction A function that takes in this canvas' elements and then animates them
     * @private
     */
    animate() {
        if (!this.animating) return;
        this.animateFunction(this.elements);
        this.draw();
        requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Starts animating the canvas
     */
    start(animateFunction) {
        console.log('Starting animation');
        this.animating = true;
        this.animateFunction = typeof animateFunction == 'function' ? animateFunction : () => {};
        requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Stops animating the canvas and removes it's animate function
     */
    stop() {
        console.log('Stopping animation');
        this.animating = false;
        this.animateFunction = null;
    }

    /**
     * 
     * @param {Event} e Event object 
     * @returns {Object} x and y as a percentage of the canvas size
     */
    getXY(e) {
        const { x, y } = getXY(e);
        const {
            width,
            height,
            top,
            left
        } = this.canvas.getBoundingClientRect();

        return {
            x: (x - left) / width,
            y: (y - top) / height
        };
    }

    get image() {
        return this.canvas.toDataURL('image/png');
    }

    destroy() {
        this.stop();
        this.elements.forEach(e => e.__added = false);
        this.elements = [];
        this.clear();

        this.canvas.removeEventListener('mousedown', this.onstart);
        this.canvas.removeEventListener('touchstart', this.onstart);
        this.canvas.removeEventListener('click', this.onclick);
        this.canvas.removeEventListener('mousemove', this.onmove);
        this.canvas.removeEventListener('touchmove', this.onmove);
        this.canvas.removeEventListener('mouseup', this.onend);
        this.canvas.removeEventListener('touchend', this.onend);
    }
};
class CanvasButton {
    /**
     * @param {Object} functions Parameters for the button
     */
    constructor({
        onclick = () => {},
        onstart = () => {},
        onend = () => {},
        onmove = () => {}
    }, {
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        options: {
            color = "white",
            borderColor = "black",
            border = 1
        },
        text = ''
    }, customParameters = {}) {
        Object.assign(this, {
            onclick,
            onstart,
            onend,
            onmove
        });

        /**
         * @type {Object} properties The properties of the button
         */
        this.properties = {
            x,
            y,
            width,
            height,
            options: {
                color,
                borderColor,
                border
            },
            text
        };

        /**
         * @type {Object} customParameters The custom parameters of the button
         */
        this.customParameters = customParameters;
    }

    /**
     * 
     * @param {Canvas} canvas the custom canvas class 
     */
    draw(canvas) {
        const {
            context,
            canvas: {
                width: cWidth,
                height: cHeight
            }
        } = canvas;
        const {
            x,
            y,
            width,
            height,
            options,
            text
        } = this.properties;

        context.save();

        if (options) {
            if (options.color) context.fillStyle = options.color;
            if (options.borderColor) context.strokeStyle = options.borderColor;
            if (options.border) context.lineWidth = options.border;
        }

        if (text) {
            const dimension = Math.min(width, height);

            const t = new CanvasText(
                x + width / 2,
                y + height / 2,
                text, {
                    fillStyle: options.borderColor,
                    font: `${dimension * 0.8}px Arial`,
                    textAlign: 'center',
                    textBaseline: 'middle'
                }
            );

            t.draw(canvas);
        }

        context.fillRect(x * cWidth, y * cHeight, width * cWidth, height * cHeight);
        context.strokeRect(x * cWidth, y * cHeight, width * cWidth, height * cHeight);

        context.restore();
    }

    isIn(x, y) {
        const { x: bx, y: by, width, height } = this.properties;

        return x >= bx && x <= bx + width && y >= by && y <= by + height;
    }
};;
class CanvasImage {
    constructor(dataUrl, options = {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        ignoreRendering: false
    }) {
        this.dataUrl = dataUrl;
        this.options = options;

        this.rendered = false;
    }

    /**
     * 
     * @param {Canvas} canvas canvas object 
     */
    draw(canvas) {
        if (!this.rendered && !this.options.ignoreRendering) throw new Error('Image not rendered');

        const {
            context,
            width: cWidth,
            height: cHeight
        } = canvas;

        const {
            x,
            y,
            width: imgWidth,
            height: imgHeight
        } = this.options;

        context.drawImage(this.image, x, y, imgWidth * cWidth, imgHeight * cHeight);
    }

    async render() {
        this.image = await new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                this.rendered = true;
                resolve(image);
            };
            image.onerror = reject;
            image.src = this.dataUrl;
        });

        return this;
    }

    isIn(x, y) {
        const {
            x: bx,
            y: by,
            width,
            height
        } = this.options;

        return x >= bx && x <= bx + width && y >= by && y <= by + height;
    }
};
class CustomIcon {
    constructor(svg, {
        color = Color.fromBootstrap('light').toString('hex'),
        size = 24
    } = {}) {
        const icon = document.createElement('div');
        this.color = color;
        this.size = size;

        icon.innerHTML = svg;
        this.svg = icon.querySelector('svg');

        this.setStyle({
            fill: color,
            width: size,
            height: size
        });
    }

    /**
     * 
     * @param {Object} styleObj Similar to the HTML style attribute
     */
    setStyle(styleObj) {
        Object.keys(styleObj).forEach(key => {
            this.svg.style[key] = styleObj[key];
        });

        return this;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    async draw(canvas) {
        if (!this.img) {
            await this.render();
        }

        const { context, width, height } = canvas;

        context.drawImage(
            this.img.image,
            (this.x * width) - (this.size / 2),
            (this.y * height) - (this.size / 2),
            this.size,
            this.size
        );
    }

    isIn(x, y, canvas) {
        const { width, height } = canvas;

        const x1 = (this.x * width) - (this.size / 2);
        const y1 = (this.y * height) - (this.size / 2);

        const x2 = x1 + this.size;
        const y2 = y1 + this.size;

        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    }

    clone() {
        return new CustomIcon(this.svg.outerHTML, this.color, this.size);
    }

    async render() {
        this.style = window.getComputedStyle(this.svg);

        delete this.svg.style;

        // change svg into dataurl
        let xml = new XMLSerializer().serializeToString(this.svg);

        // change color of svg to match the color of the icon
        const { color } = this;
        xml = xml.replace(/#000000/g, color);

        const svg64 = btoa(xml);
        const b64Start = 'data:image/svg+xml;base64,';
        const image64 = b64Start + svg64;
        this.img = new CanvasImage(image64);
        await this.img.render();
        return this.img;
    }

    /**
     * 
     * @param {String} l The location of the icon in the globalIcons object 
     * @returns {CustomIcon} The icon
     * @example
     * const icon = CustomIcon.from('2023.cone');
     */
    static from(l) {
        const [p, n] = l.split('.');

        return new CustomIcon(globalIcons[p][n]);
    }
};
class CanvasText {
    constructor(x, y, text, options) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.options = options;
    }

    /**
     * 
     * @param {Canvas} canvas the custom canvas class
     *
     */
    draw(canvas) {
        const { context } = canvas;
        const { x, y, text, options } = this;

        context.save();

        if (options) {
            if (options.fillStyle) context.fillStyle = options.color;
            if (options.font) context.font = options.font;
            if (options.textAlign) context.textAlign = options.textAlign;
            if (options.textBaseline) context.textBaseline = options.textBaseline;
        }

        context.fillText(text, x, y);

        context.restore();
    }

    isIn(x, y) {
        const { x: bx, y: by, width, height } = this;

        return x >= bx && x <= bx + width && y >= by && y <= by + height;
    }
};
class PathCollection {
    constructor(paths) {
        this.paths = paths || [];
        this.paths.reverse();

        this.latestPath = null;
    }

    /**
     * Adds a path to the collection
     * @param {Path | Undefined} path (optional) Path to add to the collection 
     */
    addPath(path = new Path()) {
        this.paths.unshift(path);
        this.latestPath = path;
    }

    /**
     * 
     * @param {Canvas} canvas 
     */
    draw(canvas) {
        this.paths.forEach(path => path.draw(canvas));
    }
};
class Path {
    /**
     * 
     * @param {Color} color the color of the path 
     */
    constructor(color = new Color(0, 0, 0), options = {}) {
        /**
         * @type {Color} the color of the path
         */
        this.color = color;

        /**
         * @type {Array[Point]} the points in the path
         */
        this.points = [];

        /**
         * @type {Point} the latest point in the path
         */
        this.latestPoint = null;

        /**
         * @type {Object} the options of the path
         */
        this.options = options;
    }

    /**
     * 
     * @param {Number} x between 0 and 1
     * @param {Number} y between 0 and 1
     * @param {Number} options the thickness of the path
     */
    addPoint(x, y, options) {
        this.points.push(new Point(x, y, options));
        this.latestPoint = this.points[this.points.length - 1];
    }

    /**
     * Adds several points to the path
     * @param {Array[Point]} points the points to add
     */
    addPoints(points) {
        points.forEach(point => this.addPoint(point.x, point.y, point.options));
    }

    /**
     * 
     * @param {Canvas} canvas the custom canvas class
     */
    draw(canvas) {
        const {
            context,
            canvas: {
                width: cWidth,
                height: cHeight
            }
        } = canvas;

        context.save();

        context.beginPath();
        context.strokeStyle = this.color.rgb;
        context.lineWidth = this.options.thickness || 1;
        this.points.forEach((point, i) => {
            if (i == 0) context.moveTo(point.x * cWidth, point.y * cHeight);
            else context.lineTo(point.x * cWidth, point.y * cHeight);
        });
        context.stroke();

        context.restore();
    }

    /**
     * Removes the last point in the path
     */
    pop() {
        this.points.pop();
    }

    /**
     * Removes the first point in the path
     */
    shift() {
        this.points.shift();
    }

    /**
     * Returns the length of the path
     */
    get length() {
        return this.points.length;
    }

    linearBestFit() {
        const x = this.points.map(point => point.x);
        const y = this.points.map(point => point.y);

        const xMean = x.reduce((a, b) => a + b) / x.length;
        const yMean = y.reduce((a, b) => a + b) / y.length;

        const xDev = x.map(x => x - xMean);
        const yDev = y.map(y => y - yMean);

        const xyDev = xDev.map((x, i) => x * yDev[i]);

        const xDevSquared = xDev.map(x => x ** 2);

        const slope = xyDev.reduce((a, b) => a + b) / xDevSquared.reduce((a, b) => a + b);
        const yIntercept = yMean - slope * xMean;

        return {
            slope,
            yIntercept
        };
    }

    /**
     * Returns the coefficients of a polynomial of the given degree that best fits the path
     * @param {Number} degree the degree of the polynomial
     * @returns {Array[Number]} the coefficients of the polynomial
     */
    polynomialBestFit(degree) {
        return new Array(degree + 1).fill(0).map((_, i) => {
            const x = this.points.map(point => point.x ** i);
            const y = this.points.map(point => point.y);

            const xMean = x.reduce((a, b) => a + b) / x.length;
            const yMean = y.reduce((a, b) => a + b) / y.length;

            const xDev = x.map(x => x - xMean);
            const yDev = y.map(y => y - yMean);

            const xyDev = xDev.map((x, i) => x * yDev[i]);

            const xDevSquared = xDev.map(x => x ** 2);

            const slope = xyDev.reduce((a, b) => a + b) / xDevSquared.reduce((a, b) => a + b);
            const yIntercept = yMean - slope * xMean;

            return yIntercept;
        });
    }

    /**
     * Returns the derivative of the path
     * @returns {Path} the derivative of the path
     */
    derivative() {
        return new Path(this.color, this.options).addPoints(this.points.map((point, i) => {
            if (i == 0) return point;
            else {
                const x = point.x;
                const y = (point.y - this.points[i - 1].y) / (point.x - this.points[i - 1].x);

                return new Point(x, y);
            }
        }));
    }

    /**
     * Returns the integral of the path
     * @returns {Path} the integral of the path
     * @param {Number} constant the constant of integration
     */
    integral(constant = 0) {
        return new Path(this.color, this.options).addPoints(this.points.map((point, i) => {
            if (i == 0) return point;
            else {
                const x = point.x;
                const y = (point.y + this.points[i - 1].y) / 2 * (point.x - this.points[i - 1].x) + constant;

                return new Point(x, y);
            }
        }));
    }
};
class Point {
    /**
     * 
     * @param {Number} x between 0 and 1
     * @param {Number} y between 0 and 1
     * @param {Object} options (optional) options for the point
     * @param {Number} options.radius (optional) the radius of the point (used for drawing)
     * @param {Color} options.color (optional) the color of the point (used for drawing)
     * @param {Number} options.thickness (optional) the thickness of the point (used for drawing)
     */
    constructor(x, y, {
        radius,
        color,
        thickness
    } = {
        radius: 0,
        color: Color.fromName('black'),
        thickness: 1
    }) {
        /**
         * @type {Number} x between 0 and 1
         */
        this.x = x;

        /**
         * @type {Number} y between 0 and 1
         */
        this.y = y;

        /**
         * @type {Number} radius (optional) the radius of the point (used for drawing)
         */
        this.radius = radius;

        /**
         * @type {Color} color (optional) the color of the point (used for drawing)
         * @default Color.fromName('black')
         */
        this.color = color ? color : Color.fromName('black').rgb.toString();

        /**
         * @type {Number} thickness (optional) the thickness of the point (used for drawing)
         */
        this.thickness = thickness;
    }

    /**
     * Draws the point onto a canvas
     */
    draw(canvas) {
        const { x, y } = this;

        const {
            context,
            canvas: {
                width,
                height
            }
        } = canvas;

        context.save();

        context.beginPath();
        context.fillStyle = this.color;
        context.lineWidth = this.thickness;
        context.arc(x * width, y * height, this.radius, 0, 2 * Math.PI);
        context.fill();

        context.restore();
    }

    /**
     * Moves the point to a new position
     * @param {Number} x between 0 and 1
     * @param {Number} y between 0 and 1
     * @returns {Point} the point
     */
    moveTo(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Linear interpolation between this point and another point
     * @param {Number} frames Number of frames
     * @param {Point} point the point to interpolate to
     * @returns {Array[Point]} the points in between
     */
    linearMove(frames, point) {
        const arr = new Array(frames).fill(0).map((_, i) => {
            const x = this.x + (point.x - this.x) * (i / frames);
            const y = this.y + (point.y - this.y) * (i / frames);
            return new Point(x, y);
        });
        const path = new Path();
        path.addPoints(arr);
        return path;
    }

    /**
     * Polynomial interpolation between this point and another point
     * @param {Number} frames Number of frames
     * @param {...Point} point the point to interpolate to
     * @returns {Array[Point]} the points in between
     */
    polynomialMove(frames, ...points) {
        const pointsArray = [this, ...points];

        const arr = new Array(frames).fill(0).map((_, i) => {
            const x = pointsArray.reduce((acc, point, index) => {
                return acc + point.x * Math.pow(i / frames, index);
            }, 0);
            const y = pointsArray.reduce((acc, point, index) => {
                return acc + point.y * Math.pow(i / frames, index);
            }, 0);
            return new Point(x, y);
        });

        const path = new Path();
        path.addPoints(arr);
        return path;
    }

    /**
     * Logarithmic interpolation between this point and another point
     * @param {Number} frames Number of frames
     * @param {Point} point the point to interpolate to
     * @param {Number} base the base of the logarithm
     * @returns {Array[Point]} the points in between
     */
    logarithmicMove(frames, point, base) {
        const arr = new Array(frames).fill(0).map((_, i) => {
            const x = this.x + (point.x - this.x) * Math.log(i + 1) / Math.log(base);
            const y = this.y + (point.y - this.y) * Math.log(i + 1) / Math.log(base);
            return new Point(x, y);
        });

        const path = new Path();
        path.addPoints(arr);
        return path;
    }

    /**
     * Exponential interpolation between this point and another point
     * @param {Number} frames Number of frames
     * @param {Point} point the point to interpolate to
     * @param {Number} base the base of the exponent
     * @returns {Array[Point]} the points in between
     */
    exponentialMove(frames, point, base) {
        return new Array(frames).fill(0).map((_, i) => {
            const x = this.x + (point.x - this.x) * (base ** i - 1) / (base - 1);
            const y = this.y + (point.y - this.y) * (base ** i - 1) / (base - 1);
            return new Point(x, y);
        });
    }

    /**
     * Sine interpolation between this point and another point
     * @param {Number} frames Number of frames
     * @param {Point} point the point to interpolate to
     * @returns {Array[Point]} the points in between
     */
    sineMove(frames, point) {
        return new Array(frames).fill(0).map((_, i) => {
            const x = this.x + (point.x - this.x) * (Math.sin(Math.PI * i / frames - Math.PI / 2) + 1) / 2;
            const y = this.y + (point.y - this.y) * (Math.sin(Math.PI * i / frames - Math.PI / 2) + 1) / 2;
            return new Point(x, y);
        });
    }

    /**
     * Cosine interpolation between this point and another point
     * @param {Number} frames Number of frames
     * @param {Point} point the point to interpolate to
     * @returns {Array[Point]} the points in between
     */
    cosineMove(frames, point) {
        return new Array(frames).fill(0).map((_, i) => {
            const x = this.x + (point.x - this.x) * (Math.cos(Math.PI * i / frames - Math.PI / 2) + 1) / 2;
            const y = this.y + (point.y - this.y) * (Math.cos(Math.PI * i / frames - Math.PI / 2) + 1) / 2;
            return new Point(x, y);
        });
    }

    /**
     * Tangent interpolation between this point and another point
     * @param {Number} frames Number of frames
     * @param {Point} point the point to interpolate to
     * @returns {Array[Point]} the points in between
     */
    tangentMove(frames, point) {
        return new Array(frames).fill(0).map((_, i) => {
            const x = this.x + (point.x - this.x) * Math.tan(Math.PI * i / frames - Math.PI / 2);
            const y = this.y + (point.y - this.y) * Math.tan(Math.PI * i / frames - Math.PI / 2);
            return new Point(x, y);
        });
    }

    /**
     * Calculates the distance from this point to another point
     * @param {Point} point the point to calculate the distance from
     * @returns {Number} the distance from this point to another point (in whatever unit its x and y are in)
     */
    distanceFrom(point) {
        return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
    }

    /**
     * Clears the point from the canvas
     * @param {Canvas} canvas the canvas to draw on 
     */
    clear(canvas) {
        const {
            radius,
            x,
            y
        } = this;

        canvas.context.clearRect(x * canvas.width - radius, y * canvas.height - radius, radius * 2, radius * 2);
    }
};
/**
 * @fileoverview Color class
 * @author tsaxking
 * @license MIT
 * @version 1.0.0
 * @since 1.0.0
 * @example
 * const color = new Color(255, 255, 255);
 * console.log(color.rgb); // rgb(255, 255, 255)
 * console.log(color.rgba); // rgba(255, 255, 255, 1)
 * console.log(color.hex); // #ffffff
 */
class Color {
    /**
     * 
     * @param {Number} r Red between 0 and 255
     * @param {Number} g Green between 0 and 255
     * @param {Number} b Blue between 0 and 255
     * @param {Number} a Alpha between 0 and 1
     */
    constructor(r, g, b, a) {
        if (isNaN(r) || isNaN(g) || isNaN(b)) throw new Error('Invalid Color');
        if (r > 255 || g > 255 || b > 255) throw new Error('Invalid Color');
        if (a > 1 || a < 0) throw new Error('Invalid Color');
        if (r < 0 || g < 0 || b < 0) throw new Error('Invalid Color');

        /**
         * @property {Number} r Red between 0 and 255
         * @readonly
         */
        this.r = r;

        /**
         * @property {Number} g Green between 0 and 255
         * @readonly
         */
        this.g = g;

        /**
         * @property {Number} b Blue between 0 and 255
         * @readonly
         */
        this.b = b;

        /**
         * @property {Number} a Alpha between 0 and 1
         * @readonly
         * @default 1
         */
        this.a = typeof a == 'number' ? a : 1;
    }

    /**
     * Returns the color in rgb format
     */
    get rgb() {
        return {
            values: [this.r, this.g, this.b],
            /**
             * Sets the color
             * @param {Number} r Red between 0 and 255
             * @param {Number} g Green between 0 and 255
             * @param {Number} b Blue between 0 and 255
             * @param {Number} a Alpha between 0 and 1
             * @returns {Color} This color object
             */
            set: (r, g, b, a) => {
                if (isNaN(r) || isNaN(g) || isNaN(b)) throw new Error('Invalid Color');
                if (r > 255 || g > 255 || b > 255) throw new Error('Invalid Color');
                if (a > 1 || a < 0) throw new Error('Invalid Color');
                if (r < 0 || g < 0 || b < 0) throw new Error('Invalid Color');

                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;

                return this;
            },
            /**
             * Sets the red value
             * @param {Number} r Red between 0 and 255 
             * @returns {Color} This color object
             */
            setRed: (r) => {
                if (isNaN(r)) throw new Error('Invalid Color');
                if (r > 255) throw new Error('Invalid Color');
                if (r < 0) throw new Error('Invalid Color');

                this.r = r;

                return this;
            },
            /**
             * Sets the green value
             * @param {Number} g Green between 0 and 255 
             * @returns {Color} This color object
             */
            setGreen: (g) => {
                if (isNaN(g)) throw new Error('Invalid Color');
                if (g > 255) throw new Error('Invalid Color');
                if (g < 0) throw new Error('Invalid Color');

                this.g = g;

                return this;
            },
            /**
             * Sets the blue value
             * @param {Number} b Blue between 0 and 255 
             * @returns {Color} This color object
             */
            setBlue: (b) => {
                if (isNaN(b)) throw new Error('Invalid Color');
                if (b > 255) throw new Error('Invalid Color');
                if (b < 0) throw new Error('Invalid Color');

                this.b = b;

                return this;
            },
            /**
             * 
             * @returns {String} The color in rgb format
             */
            toString: () => this.toString('rgb')
        }
    }

    /**
     * Returns the color in rgba format
     */
    get rgba() {
        return {
            ...this.rgb,
            values: [this.r, this.g, this.b, this.a],
            /**
             * Sets the color
             * @param {Number} r Red between 0 and 255
             * @param {Number} g Green between 0 and 255
             * @param {Number} b Blue between 0 and 255
             * @param {Number} a Alpha between 0 and 1
             * @returns {Color} This color object
             */
            set: (r, g, b, a) => {
                if (isNaN(r) || isNaN(g) || isNaN(b)) throw new Error('Invalid Color');
                if (r > 255 || g > 255 || b > 255) throw new Error('Invalid Color');
                if (a > 1 || a < 0) throw new Error('Invalid Color');
                if (r < 0 || g < 0 || b < 0) throw new Error('Invalid Color');

                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;

                return this;
            },
            /**
             * Sets the alpha value
             * @param {Number} a Alpha between 0 and 1 
             * @returns {Color} This color object
             */
            setAlpha: (a) => {
                if (isNaN(a)) throw new Error('Invalid Color');
                if (a > 1) throw new Error('Invalid Color');
                if (a < 0) throw new Error('Invalid Color');

                this.a = a;

                return this;
            },
            /**
             * 
             * @returns {String} The color in rgba format
             */
            toString: () => this.toString('rgba')
        }
    }

    /**
     * Returns the color in hex format
     */
    get hex() {
        return {
            values: [this.r.toString(16), this.g.toString(16), this.b.toString(16)],
            /**
             * Sets the color
             * @param {String} hex Hex value for color 
             * @returns {Color} This color object
             */
            set: (hex) => {
                const c = Color.fromHex(hex);
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;

                return this;
            },
            /**
             * 
             * @param {String} r Hex value for red 
             * @returns {Color} This color object
             */
            setRed: (r) => {
                if (r.length != 2) throw new Error('Invalid Color');
                if (isNaN(parseInt(r, 16))) throw new Error('Invalid Color');

                this.r = parseInt(r, 16);

                return this;
            },
            /**
             * 
             * @param {String} g Hex value for green 
             * @returns {Color} This color object
             */
            setGreen: (g) => {
                if (g.length != 2) throw new Error('Invalid Color');
                if (isNaN(parseInt(g, 16))) throw new Error('Invalid Color');

                this.g = parseInt(g, 16);

                return this;
            },
            /**
             * 
             * @param {String} b Hex value for blue 
             * @returns {Color} This color object
             */
            setBlue: (b) => {
                if (b.length != 2) throw new Error('Invalid Color');
                if (isNaN(parseInt(b, 16))) throw new Error('Invalid Color');

                this.b = parseInt(b, 16);

                return this;
            },
            /**
             * 
             * @returns {String} The color in hex format
             */
            toString: () => this.toString('hex')
        }
    }

    /**
     * Returns the color in hex format with alpha
     */
    get hexa() {
        return {
            ...this.hex,
            values: [this.r.toString(16), this.g.toString(16), this.b.toString(16), this.a.toString(16)],
            /**
             * Sets the color
             * @param {String} hex Hex value for color 
             * @returns {Color} This color object
             */
            set: (hex) => {
                const c = Color.fromHex(hex);
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;

                return this;
            },
            /**
             * Sets the alpha value
             * @param {Number} a Alpha between 0 and 1
             * @returns {Color} This color object
             */
            setAlpha: (a) => {
                if (isNaN(a)) throw new Error('Invalid Color');
                if (a > 1) throw new Error('Invalid Color');
                if (a < 0) throw new Error('Invalid Color');

                this.a = a;

                return this;
            },
            /**
             * 
             * @returns {String} The color in hexa format
             */
            toString: () => this.toString('hexa')
        }
    }

    /**
     * Returns the color in hsl format
     */
    get hsl() {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        let h;
        let s;
        let l = (max + min) / 2;

        if (max == min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            h /= 6;
        }

        return {
            values: [h, s, l],
            /**
             * Sets the color
             * @param {Number} h Hue between 0 and 1 
             * @param {Number} s Saturation between 0 and 1
             * @param {Number} l Lightness between 0 and 1
             * @returns {Color} This color object
             */
            set: (h, s, l) => {
                if (isNaN(h) || isNaN(s) || isNaN(l)) throw new Error('Invalid Color');
                if (h > 1 || s > 1 || l > 1) throw new Error('Invalid Color');
                if (h < 0 || s < 0 || l < 0) throw new Error('Invalid Color');

                const c = Color.fromHSL(h, s, l);
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;

                return this;
            },
            /**
             * Sets the hue
             * @param {Number} h Hue between 0 and 1
             * @returns {Color} This color object
             */
            setHue: (h) => {
                if (isNaN(h)) throw new Error('Invalid Color');
                if (h > 1) throw new Error('Invalid Color');
                if (h < 0) throw new Error('Invalid Color');

                const c = Color.fromHSL(h, this.hsl.values[1], this.hsl.values[2]);
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;

                return this;
            },
            /**
             * Sets the saturation
             * @param {Number} s Saturation between 0 and 1
             * @returns {Color} This color object
             */
            setSaturation: (s) => {
                if (isNaN(s)) throw new Error('Invalid Color');
                if (s > 1) throw new Error('Invalid Color');
                if (s < 0) throw new Error('Invalid Color');

                const c = Color.fromHSL(this.hsl.values[0], s, this.hsl.values[2]);
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;

                return this;
            },
            /**
             * Sets the lightness
             * @param {Number} l Lightness between 0 and 1
             * @returns {Color} This color object
             */
            setLightness: (l) => {
                if (isNaN(l)) throw new Error('Invalid Color');
                if (l > 1) throw new Error('Invalid Color');
                if (l < 0) throw new Error('Invalid Color');

                const c = Color.fromHSL(this.hsl.values[0], this.hsl.values[1], l);
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;

                return this;
            },
            /**
             * 
             * @returns {String} The color in hsl format
             */
            toString: () => this.toString('hsl')
        }
    }

    /**
     * Returns the color in hsla format
     */
    get hsla() {
        const [h, s, l] = this.hsl.values;

        return {
            ...this.hsl,
            values: [h, s, l, this.a],
            /**
             * Sets the color
             * @param {Number} h Hue between 0 and 1 
             * @param {Number} s Saturation between 0 and 1
             * @param {Number} l Lightness between 0 and 1
             * @param {Number} a Alpha between 0 and 1
             * @returns {Color} This color object
             */
            set: (h, s, l, a) => {
                if (isNaN(h) || isNaN(s) || isNaN(l)) throw new Error('Invalid Color');
                if (h > 1 || s > 1 || l > 1) throw new Error('Invalid Color');
                if (h < 0 || s < 0 || l < 0) throw new Error('Invalid Color');

                const c = Color.fromHSL(h, s, l);
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;
                this.a = a;

                return this;
            },
            /**
             * Sets the alpha
             * @param {Number} a Alpha between 0 and 1
             * @returns {Color} This color object
             */
            setAlpha: (a) => {
                if (isNaN(a)) throw new Error('Invalid Color');
                if (a > 1) throw new Error('Invalid Color');
                if (a < 0) throw new Error('Invalid Color');

                this.a = a;

                return this;
            },
            /**
             * 
             * @returns {String} The color in hsla format
             */
            toString: () => this.toString('hsla')
        }
    }

    /**
     * Returns the color in lab format
     */
    get cielab() {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;

        const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
        const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
        const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

        const x_ = x / 0.95047;
        const y_ = y / 1.00000;
        const z_ = z / 1.08883;

        const f = (t) => t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116;

        const l = 116 * f(y_) - 16;
        const a = 500 * (f(x_) - f(y_));
        const _b = 200 * (f(y_) - f(z_));

        return {
            values: [l, a, _b],
            /**
             * Sets the color
             * @param {Number} l Luminance between 0 and 100
             * @param {Number} a A between -128 and 127
             * @param {Number} b B between -128 and 127
             * @returns {Color} This color object
             */
            set: (l, a, b) => {
                if (isNaN(l) || isNaN(a) || isNaN(b)) throw new Error('Invalid Color');
                if (l > 100 || a > 127 || b > 127) throw new Error('Invalid Color');
                if (l < 0 || a < -128 || b < -128) throw new Error('Invalid Color');

                const c = Color.fromCIELAB(l, a, b);
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;

                return this;
            },
            /**
             * Sets the luminance
             * @param {Number} l Luminance between 0 and 100
             * @returns {Color} This color object
             */
            setLuminance: (l) => {
                if (isNaN(l)) throw new Error('Invalid Color');
                if (l > 100) throw new Error('Invalid Color');
                if (l < 0) throw new Error('Invalid Color');

                const c = Color.fromCIELAB(l, this.cielab.values[1], this.cielab.values[2]);
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;

                return this;
            },
            /**
             * Sets the a
             * @param {Number} a A between -128 and 127
             * @returns {Color} This color object
             */
            setA: (a) => {
                if (isNaN(a)) throw new Error('Invalid Color');
                if (a > 127) throw new Error('Invalid Color');
                if (a < -128) throw new Error('Invalid Color');

                const c = Color.fromCIELAB(this.cielab.values[0], a, this.cielab.values[2]);
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;

                return this;
            },
            /**
             * Sets the b
             * @param {Number} b B between -128 and 127
             * @returns {Color} This color object
             */
            setB: (b) => {
                if (isNaN(b)) throw new Error('Invalid Color');
                if (b > 127) throw new Error('Invalid Color');
                if (b < -128) throw new Error('Invalid Color');

                const c = Color.fromCIELAB(this.cielab.values[0], this.cielab.values[1], b);
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;

                return this;
            },
            /**
             * 
             * @returns {String} The color in cielab format
             */
            toString: () => this.toString('cielab')
        }
    }

    /**
     * Returns the color in rgb/rgba/hex/hexa/hsl/hsla/cielab format for css use
     * @param {String} type (optional) Color format to return. Default is rgb 
     */
    toString(type = 'rgb') {
        switch (type) {
            case 'rgb':
                return `rgb(${this.r}, ${this.g}, ${this.b})`;
            case 'rgba':
                return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
            case 'hex':
                return `#${this.hex.values.join('')}`;
            case 'hexa':
                return `#${this.hexa.values.join('')}`;
            case 'hsl':
                return `hsl(${this.hsl.values.join(', ')})`;
            case 'hsla':
                return `hsla(${this.hsla.values.join(', ')})`;
            case 'cielab':
                return `lab(${this.cielab.values.join(', ')})`;
            default:
                throw new Error('Invalid color format');
        }
    }

    /**
     * Generates the color from a hex string
     * @param {String} hex Hexadecimal color 
     * @returns {Color} Color object
     */
    static fromHex(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const a = parseInt(hex.slice(7, 9), 16) / 255;

        return new Color(r, g, b, a);
    }

    /**
     * Generates the color from hsl values
     * @param {Number} h Hue value between 0 and 1
     * @param {Number} s Saturation value between 0 and 1
     * @param {Number} l Lightness value between 0 and 1
     * @param {Number} a (optional) Alpha value between 0 and 1. Default is 1
     * @returns {Color} Color object
     */
    static fromHSL(h, s, l, a = 1) {
        let r, g, b;

        if (s == 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return new Color(r * 255, g * 255, b * 255, a);
    }

    /**
     * Generates the color from cielab values
     * @param {Number} l Luminance value
     * @param {Number} a A value
     * @param {Number} b B value
     * @returns {Color} Color object
     */
    static fromCIELAB(l, a, b) {
        if (isNaN(l) || isNaN(a) || isNaN(b)) throw new Error('Invalid Color');
        if (l > 100 || a > 127 || b > 127) throw new Error('Invalid Color');
        if (l < 0 || a < -128 || b < -128) throw new Error('Invalid Color');

        const f = (t) => t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116;
        const y_ = (l + 16) / 116;
        const x_ = a / 500 + y_;
        const z_ = y_ - b / 200;

        const r = 255 * (f(x_) * 0.95047);
        const g = 255 * (f(y_) * 1.00000);
        const _b = 255 * (f(z_) * 1.08883);

        return new Color(r, g, _b);
    }

    /**
     * Generates a random color
     * @param {Boolean} withAlpha (optional) Whether to include alpha value
     * @returns {Color} Random color
     */
    static random(withAlpha = false) {
        const c = new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), withAlpha ? Math.random() : 1);

        c.hsl.setSaturation(.25 + Math.random() * .5);
        c.hsl.setLightness(.25 + Math.random() * .5);

        return c;
    }

    /**
     * Generates a color from a color name
     * @param {String} name Color name 
     * @param {Number} a (optional) Alpha value
     * @returns {Color} Color object
     */
    static fromName(name, a = 1) {
        const { colors } = this;

        if (name in colors) {
            return new Color(...colors[name], a);
        }

        return null;
    }

    /**
     * Returns the contrast ratio between this color and the given color
     * @param {Color} color Color to compare to
     * @returns {Number} Contrast ratio
     */
    detectContrast(color) {
        const l1 = 0.2126 * Math.pow(this.r / 255, 2.2) + 0.7152 * Math.pow(this.g / 255, 2.2) + 0.0722 * Math.pow(this.b / 255, 2.2);
        const l2 = 0.2126 * Math.pow(color.r / 255, 2.2) + 0.7152 * Math.pow(color.g / 255, 2.2) + 0.0722 * Math.pow(color.b / 255, 2.2);

        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    /**
     * Returns an array of colors that fade from this color to the given color on a linear scale
     * @param {Color} color Color to fade to 
     * @param {Number} frames Frames to fade to color 
     * @returns {Gradient} Gradient object
     */
    linearFade(color, frames) {
        return new Gradient(...new Array(frames).fill(0).map((_, i) => {
            return new Color(
                Math.floor(this.r + (color.r - this.r) / frames * i),
                Math.floor(this.g + (color.g - this.g) / frames * i),
                Math.floor(this.b + (color.b - this.b) / frames * i),
                this.a + (color.a - this.a) / frames * i
            );
        }));
    }

    /**
     * Returns an array of colors that fade from this color to the given color on a logarithmic scale
     * @param {Color} color Color to fade to
     * @param {Number} frames Frames to fade to color
     * @param {Number} base Base of the logarithm (default: 2)
     * @returns {Gradient} Gradient object
     */
    logarithmicFade(color, frames, base = 2) {
        return new Gradient(...new Array(frames).fill(0).map((_, i) => {
            return new Color(
                Math.floor(this.r + (color.r - this.r) / Math.pow(base, frames) * Math.pow(base, i)),
                Math.floor(this.g + (color.g - this.g) / Math.pow(base, frames) * Math.pow(base, i)),
                Math.floor(this.b + (color.b - this.b) / Math.pow(base, frames) * Math.pow(base, i)),
                this.a + (color.a - this.a) / Math.pow(base, frames) * Math.pow(base, i)
            );
        }));
    }

    /**
     * Returns an array of colors that fade from this color to the given color on a exponential scale
     * @param {Color} color Color to fade to
     * @param {Number} frames Frames to fade to color
     * @param {Number} base Base of the exponential (default: 2)
     * @returns {Gradient} Gradient object
     */
    exponentialFade(color, frames, base = 2) {
        return new Gradient(new Array(frames).fill(0).map((_, i) => {
            return new Color(
                Math.floor(this.r + (color.r - this.r) / Math.pow(base, frames) * Math.pow(base, i)),
                Math.floor(this.g + (color.g - this.g) / Math.pow(base, frames) * Math.pow(base, i)),
                Math.floor(this.b + (color.b - this.b) / Math.pow(base, frames) * Math.pow(base, i)),
                this.a + (color.a - this.a) / Math.pow(base, frames) * Math.pow(base, i)
            );
        }));
    }

    /**
     * Logs with the color of this color
     * @param  {...any} args
     */
    logText(...args) {
        args.forEach(a => {
            if (typeof a !== "string") {
                throw new Error("Only strings are allowed");
            }
        })
        console.log(`%c${args.join(" ")}`, `color: ${this.closestName.color.toString('hex')}`);
    }

    /**
     * View the color in the console
     */
    view() {
        this.logText("Color:", this.closestName.name);
    }

    /**
     * All colors and their RGB values
     */
    static get colors() {
        return {
            "aliceblue": [240, 248, 255, 1],
            "antiquewhite": [250, 235, 215, 1],
            "aqua": [0, 255, 255, 1],
            "aquamarine": [127, 255, 212, 1],
            "azure": [240, 255, 255, 1],
            "beige": [245, 245, 220, 1],
            "bisque": [255, 228, 196, 1],
            "black": [0, 0, 0, 1],
            "blanchedalmond": [255, 235, 205, 1],
            "blue": [0, 0, 255, 1],
            "blueviolet": [138, 43, 226, 1],
            "brown": [165, 42, 42, 1],
            "burlywood": [222, 184, 135, 1],
            "cadetblue": [95, 158, 160, 1],
            "chartreuse": [127, 255, 0, 1],
            "chocolate": [210, 105, 30, 1],
            "coral": [255, 127, 80, 1],
            "cornflowerblue": [100, 149, 237, 1],
            "cornsilk": [255, 248, 220, 1],
            "crimson": [220, 20, 60, 1],
            "cyan": [0, 255, 255, 1],
            "darkblue": [0, 0, 139, 1],
            "darkcyan": [0, 139, 139, 1],
            "darkgoldenrod": [184, 134, 11, 1],
            "darkgray": [169, 169, 169, 1],
            "darkgreen": [0, 100, 0, 1],
            "darkgrey": [169, 169, 169, 1],
            "darkkhaki": [189, 183, 107, 1],
            "darkmagenta": [139, 0, 139, 1],
            "darkolivegreen": [85, 107, 47, 1],
            "darkorange": [255, 140, 0, 1],
            "darkorchid": [153, 50, 204, 1],
            "darkred": [139, 0, 0, 1],
            "darksalmon": [233, 150, 122, 1],
            "darkseagreen": [143, 188, 143, 1],
            "darkslateblue": [72, 61, 139, 1],
            "darkslategray": [47, 79, 79, 1],
            "darkslategrey": [47, 79, 79, 1],
            "darkturquoise": [0, 206, 209, 1],
            "darkviolet": [148, 0, 211, 1],
            "deeppink": [255, 20, 147, 1],
            "deepskyblue": [0, 191, 255, 1],
            "dimgray": [105, 105, 105, 1],
            "dimgrey": [105, 105, 105, 1],
            "dodgerblue": [30, 144, 255, 1],
            "firebrick": [178, 34, 34, 1],
            "floralwhite": [255, 250, 240, 1],
            "forestgreen": [34, 139, 34, 1],
            "fuchsia": [255, 0, 255, 1],
            "gainsboro": [220, 220, 220, 1],
            "ghostwhite": [248, 248, 255, 1],
            "gold": [255, 215, 0, 1],
            "goldenrod": [218, 165, 32, 1],
            "gray": [128, 128, 128, 1],
            "green": [0, 128, 0, 1],
            "greenyellow": [173, 255, 47, 1],
            "grey": [128, 128, 128, 1],
            "honeydew": [240, 255, 240, 1],
            "hotpink": [255, 105, 180, 1],
            "indianred": [205, 92, 92, 1],
            "indigo": [75, 0, 130, 1],
            "ivory": [255, 255, 240, 1],
            "khaki": [240, 230, 140, 1],
            "lavender": [230, 230, 250, 1],
            "lavenderblush": [255, 240, 245, 1],
            "lawngreen": [124, 252, 0, 1],
            "lemonchiffon": [255, 250, 205, 1],
            "lightblue": [173, 216, 230, 1],
            "lightcoral": [240, 128, 128, 1],
            "lightcyan": [224, 255, 255, 1],
            "lightgoldenrodyellow": [250, 250, 210, 1],
            "lightgray": [211, 211, 211, 1],
            "lightgreen": [144, 238, 144, 1],
            "lightgrey": [211, 211, 211, 1],
            "lightpink": [255, 182, 193, 1],
            "lightsalmon": [255, 160, 122, 1],
            "lightseagreen": [32, 178, 170, 1],
            "lightskyblue": [135, 206, 250, 1],
            "lightslategray": [119, 136, 153, 1],
            "lightslategrey": [119, 136, 153, 1],
            "lightsteelblue": [176, 196, 222, 1],
            "lightyellow": [255, 255, 224, 1],
            "lime": [0, 255, 0, 1],
            "limegreen": [50, 205, 50, 1],
            "linen": [250, 240, 230, 1],
            "magenta": [255, 0, 255, 1],
            "maroon": [128, 0, 0, 1],
            "mediumaquamarine": [102, 205, 170, 1],
            "mediumblue": [0, 0, 205, 1],
            "mediumorchid": [186, 85, 211, 1],
            "mediumpurple": [147, 112, 219, 1],
            "mediumseagreen": [60, 179, 113, 1],
            "mediumslateblue": [123, 104, 238, 1],
            "mediumspringgreen": [0, 250, 154, 1],
            "mediumturquoise": [72, 209, 204, 1],
            "mediumvioletred": [199, 21, 133, 1],
            "midnightblue": [25, 25, 112, 1],
            "mintcream": [245, 255, 250, 1],
            "mistyrose": [255, 228, 225, 1],
            "moccasin": [255, 228, 181, 1],
            "navajowhite": [255, 222, 173, 1],
            "navy": [0, 0, 128, 1],
            "oldlace": [253, 245, 230, 1],
            "olive": [128, 128, 0, 1],
            "olivedrab": [107, 142, 35, 1],
            "orange": [255, 165, 0, 1],
            "orangered": [255, 69, 0, 1],
            "orchid": [218, 112, 214, 1],
            "palegoldenrod": [238, 232, 170, 1],
            "palegreen": [152, 251, 152, 1],
            "paleturquoise": [175, 238, 238, 1],
            "palevioletred": [219, 112, 147, 1],
            "papayawhip": [255, 239, 213, 1],
            "peachpuff": [255, 218, 185, 1],
            "peru": [205, 133, 63, 1],
            "pink": [255, 192, 203, 1],
            "plum": [221, 160, 221, 1],
            "powderblue": [176, 224, 230, 1],
            "purple": [128, 0, 128, 1],
            "red": [255, 0, 0, 1],
            "rosybrown": [188, 143, 143, 1],
            "royalblue": [65, 105, 225, 1],
            "saddlebrown": [139, 69, 19, 1],
            "salmon": [250, 128, 114, 1],
            "sandybrown": [244, 164, 96, 1],
            "seagreen": [46, 139, 87, 1],
            "seashell": [255, 245, 238, 1],
            "sienna": [160, 82, 45, 1],
            "silver": [192, 192, 192, 1],
            "skyblue": [135, 206, 235, 1],
            "slateblue": [106, 90, 205, 1],
            "slategray": [112, 128, 144, 1],
            "slategrey": [112, 128, 144, 1],
            "snow": [255, 250, 250, 1],
            "springgreen": [0, 255, 127, 1],
            "steelblue": [70, 130, 180, 1],
            "tan": [210, 180, 140, 1],
            "teal": [0, 128, 128, 1],
            "thistle": [216, 191, 216, 1],
            "tomato": [255, 99, 71, 1],
            "transparent": [0, 0, 0, 0],
            "turquoise": [64, 224, 208, 1],
            "violet": [238, 130, 238, 1],
            "wheat": [245, 222, 179, 1],
            "white": [255, 255, 255, 1],
            "whitesmoke": [245, 245, 245, 1],
            "yellow": [255, 255, 0, 1],
            "yellowgreen": [154, 205, 50, 1],
            "rebeccapurple": [102, 51, 153, 1]
        }
    }

    /**
     * Get the bootstrap colors
     * @returns {Object}
     */
    static get bootstrap() {
        return {
            "primary": [0, 123, 255, 1],
            "secondary": [108, 117, 125, 1],
            "success": [40, 167, 69, 1],
            "info": [23, 162, 184, 1],
            "warning": [255, 193, 7, 1],
            "danger": [220, 53, 69, 1],
            "light": [248, 249, 250, 1],
            "dark": [52, 58, 64, 1],
            // colors-extended.css
            "indigo": Color.fromHex('#4b0082').rgba.values,
            "indigo-light": Color.fromHex('#ca80ff').rgba.values,
            "indigo-dark": Color.fromHex('#1e0033').rgba.values,

            "teal": Color.fromHex('#1fc794').rgba.values,
            "teal-light": Color.fromHex('#e9fcf6').rgba.values,
            "teal-dark": Color.fromHex('#158463').rgba.values,

            "orange": Color.fromHex('#ff6600').rgba.values,
            "orange-light": Color.fromHex('#ffd1b3').rgba.values,
            "orange-dark": Color.fromHex('#b34700').rgba.values,

            "pink": Color.fromHex('#ff33cc').rgba.values,
            "pink-light": Color.fromHex('#ffccf2').rgba.values,
            "pink-dark": Color.fromHex('#e600ac').rgba.values,

            "maroon": Color.fromHex('#800000').rgba.values,
            "maroon-light": Color.fromHex('#ff8080').rgba.values,
            "maroon-dark": Color.fromHex('#330000').rgba.values,

            "navy": Color.fromHex('#000066').rgba.values,
            "navy-light": Color.fromHex('#6666ff').rgba.values,
            "navy-dark": Color.fromHex('#00001a').rgba.values,

            "yellow": Color.fromHex('#ffff00').rgba.values,
            "yellow-light": Color.fromHex('#ffffb3').rgba.values,
            "yellow-dark": Color.fromHex('#b3b300').rgba.values,

            "lime": Color.fromHex('#00ff00').rgba.values,
            "lime-light": Color.fromHex('#b3ffb3').rgba.values,
            "lime-dark": Color.fromHex('#00b300').rgba.values,

            "gray": Color.fromHex('#808080').rgba.values,
            "gray-light": Color.fromHex('#e6e6e6').rgba.values,
            "gray-dark": Color.fromHex('#595959').rgba.values,

            "brown": Color.fromHex('#993300').rgba.values,
            "brown-light": Color.fromHex('#ffbb99').rgba.values,
            "brown-dark": Color.fromHex('#4d1a00').rgba.values,

            "grape": Color.fromHex('#b9135b').rgba.values,
            "grape-light": Color.fromHex('#f5a3c6').rgba.values,
            "grape-dark": Color.fromHex('#730c39').rgba.values,

            "vermillion": Color.fromHex('#e34234').rgba.values,
            "vermillion-light": Color.fromHex('#f6c1bc').rgba.values,
            "vermillion-dark": Color.fromHex('#b42518').rgba.values,

            "steel": Color.fromHex('#878f99').rgba.values,
            "steel-light": Color.fromHex('#a2b9bc').rgba.values,
            "steel-dark": Color.fromHex('#6b5b95').rgba.values,

            "green": Color.fromHex('#006600').rgba.values,
            "green-light": Color.fromHex('#66ff66').rgba.values,
            "green-dark": Color.fromHex('#003300').rgba.values
        }
    }

    /**
     * @returns {Object} The closest color name and its distance
     */
    get closestName() {
        const { colors } = Color;
        const [r, g, b] = this.rgb.values;

        return Object.entries(colors).reduce((closest, [name, rgb]) => {
            const [r2, g2, b2] = rgb;
            const distance = Math.sqrt(
                Math.pow(r - r2, 2) +
                Math.pow(g - g2, 2) +
                Math.pow(b - b2, 2)
            );

            if (distance < closest.distance) {
                return {
                    name,
                    distance,
                    color: new Color(...rgb)
                };
            }

            return closest;
        }, {
            name: null,
            distance: Infinity,
            color: null
        });
    }

    /**
     * @returns {Color} A copy of this color with no dependencies
     */
    clone() {
        return new Color(...this.rgba.values);
    }

    /**
     * Get a color from the bootstrap color palette
     * @param {String} name bootstrap color name 
     * @returns {Color} A color from bootstrap
     */
    static fromBootstrap(name) {
        if (!Color.bootstrap[name]) {
            throw new Error(`Invalid bootstrap color name: ${name}`);
        }

        return new Color(...Color.bootstrap[name]);
    }

    /**
     * Generate a random color with high contrast to the given colors
     * @param  {...Color} colors Colors to generate a random color with high contrast to 
     * @returns 
     */
    static generateRandomWithContrast(...colors) {
        const hsls = colors.map(c => c.hsl.values[0]);
        const intervals = hsls.reduce((intervals, hue, i) => {
            const next = hsls[i + 1];
            if (next) {
                intervals.push({
                    diff: Math.abs(hue - next),
                    hues: [hue, next]
                });
            }

            return intervals;
        }, []);

        const max = Math.max(...intervals.map(i => i.diff));
        const interval = intervals.find(i => i.diff === max);

        const [hue1, hue2] = interval.hues;
        const hue = Math.random() * (hue2 - hue1) + hue1;

        const color = Color.fromHSL(hue, 0.5, 0.5);
        return color;

        // let color = Color.random();

        // let attempts = 0;
        // while (!colors.every(c => color.detectContrast(c) >= 1)) {
        //     color = Color.random();

        //     attempts++;
        //     if (attempts > 100) {
        //         throw new Error('Could not find a color with enough contrast in 100 attempts');
        //     }
        // }

        // return color;
    }

    /**
     * 
     * @param {Number} num Number of colors to generate 
     * @param {Boolean} gradient Whether to return a gradient or an array of colors
     * @returns {Color[]} An array of colors that are complimentary to this color
     */
    compliment(num, gradient = false) {
        num = Math.floor(num);
        if (num < 2) {
            throw new Error('Must have at least 2 colors');
        }
        const interval = 1 / num;
        const hsl = this.hsl.values;
        const hues = new Array(num - 1).fill(0).map((_, i) => {
            return (hsl[0] + (i + 1) * interval) % 1;
        });

        const g = [this, ...hues.map(h => Color.fromHSL(h, hsl[1], hsl[2]))];

        return gradient ? new Gradient(...g) : g;
    }

    /**
     * @returns {Color[]} An array of colors that are analagous to this color
     */
    analagous() {
        const hsl = this.hsl.values;
        const hues = [hsl[0] - (30 / 360), hsl[0] + (30 / 360)];

        return [this, ...hues.map(h => Color.fromHSL(h, hsl[1], hsl[2]))];
    }
};
class Gradient {
    /**
     * 
     * @param {...Color} colors - the colors that make up the gradient
     */
    constructor(...colors) {
        colors = colors.flat();
        /**
         * @type {Array[Color]} colors - the colors that make up the gradient
         */
        this.colors = colors;
    }

    /**
     * @param {Number} deg - the degree of the gradient
     * @returns {String} - the gradient as a string
     * @example
     * // returns 'linear-gradient(90deg, rgb(255, 0, 0), rgb(0, 255, 0), rgb(0, 0, 255))'
     */
    toString(deg = 90) {
        let gradient = 'linear-gradient(' + deg + 'deg';
        this.colors.forEach(color => {
            gradient += `, ${color.toString()}`;
        });
        gradient += ')';
        return gradient;
    }


    /**
     * 
     * @param {Path} path - the path to create the gradient from
     */
    fromPath(path) {
        if (path.points.length !== this.colors.length + 1) throw new Error('The number of points in the path must be equal to the number of colors in the gradient plus one (each color is between two points)');
        return {
            /**
             * 
             * @param {Canvas} canvas - the canvas to draw the gradient on 
             */
            draw: (canvas) => {
                const { context } = canvas;
                const { points } = path;
                const { colors } = this;

                context.moveTo(points[0].x, points[0].y);
                context.strokeStyle = colors[0].toString();

                points.forEach((p, i) => {
                    if (i === 0) return;
                    context.lineTo(p.x, p.y);
                    context.strokeStyle = colors[i - 1].toString();
                    context.stroke();
                });

                context.closePath();
            }
        }
    }

    /**
     * view the gradient
     */
    view() {
        this.colors.forEach(c => c.view());
    }

    /**
     * console.log(text) but with the gradient
     * @param {String} string - the string to log
     */
    logText(string) {
        if (typeof string !== 'string') throw new Error('The string must be a string');

        // log text where each character is a different color
        // the gradient is repeated if the string is longer than the gradient
        // the string must be a single line

        const { colors } = this;
        const gradientLength = colors.length;

        const gradient = string.split('').map((char) => {
            return `%c${char}`;
        }).join('');

        let gradientIndex = 0;
        let direction = 1;
        const gradientString = string.split('').map((_, i) => {
            // if the string is longer than the gradient, go backwards through the gradient

            if (direction == 1) {
                if (gradientIndex === gradientLength - 1) direction = -1;
            } else {
                if (gradientIndex === 0) direction = 1;
            }


            gradientIndex += direction;

            return `color: ${colors[gradientIndex].toString()}`;

        });

        console.log(gradient, ...gradientString);
    }

    /**
     * Create a random gradient
     * @param {Number} frames - the number of frames to fade over (default: 60) 
     * @returns 
     */
    static random(frames = 60) {
        return Color.random().linearFade(Color.random(), frames);
    }

    /**
     * Combine multiple gradients into one
     * @param  {...Gradient} gradients - the gradients to combine (in order)
     * @returns {Gradient} - the combined gradient
     */
    static combine(...gradients) {
        const colors = [];
        gradients.forEach(gradient => {
            gradient.colors.forEach(color => {
                colors.push(color);
            });
        });
        return new Gradient(colors);
    }

    /**
     * Add multiple gradients together
     * @param  {...Gradient} gradients - the gradients to add
     * @returns {Gradient} - This gradient
     */
    add(...gradients) {
        gradients.forEach(gradient => {
            this.colors = [...this.colors, ...gradient.colors];
        });
        return this;
    }
};
class CustomFile {};
class CSV extends CustomFile {};
class PDF {
    /**
     * 
     * @param {String} filename 
     */
    constructor(filename) {
        /**
         * @type {String} filename (without extension)
         */
        this.filename = filename;
    }

    async load() {
        this.loadingTask = pdfjsLib.getDocument('../uploads' + this.filename);

        this.pdf = await this.loadingTask.promise;

        this.pages = new Array(this.pdf.numPages).fill(0).map((_, i) => new PDFPage(this.filename, i + 1, this));
    }

    async renderPages() {
        return await Promise.all(this.pages.map(page => page.render()));
    }

    async draw(canvas, options) {
        this.currentPageIndex = 0;
        this.currentPage = this.pages[this.currentPageIndex];

        await this.currentPage.render(canvas);

        const [prev, next] = new Array(2).fill(0).map((_, i) => {
            const color = Color.fromBoostrap('primary').rgba.setAlpha(.5).toString('hex');

            return new CanvasButton({
                onclick: () => {
                    if (i) {
                        this.currentPageIndex++;
                    } else {
                        this.currentPageIndex--;
                    }

                    this.currentPage = this.pages[this.currentPageIndex];

                    this.currentPage.render(canvas);
                },
                onenter: () => {},
                onleave: () => {}
            }, {
                x: i ? 0.05 : 0.9,
                y: 0.4,
                width: 0.1,
                height: 0.2,
                options: {
                    color: color,
                    borderColor: color.analagous()[0].toString('hex'),
                    border: 1
                },
                text: i ? '<' : '>'
            })
        });
    }
};
class PDFPage {
    constructor(filename, pagenum, pdf) {
        /**
         * @type {String} filename
         */
        this.filename = filename;

        /**
         * @type {Number} pagenum
         */
        this.pagenum = pagenum;
        /**
         * @type {PDF} pdf
         */
        this.pdf = pdf;

        /**
         * @type {Boolean} rendered
         */
        this.rendered = false;
    }

    /**
     * @param {Canvas} canvas (optional) canvas object
     * @param {Object} options (optional) options for the CanvasImage
     * @returns {Promise} resolves to a dataURL of the page
     */
    render(canvas, options) {
        return new Promise(async(resolve, reject) => {
            const page = await this.pdf.pdf.getPage(this.pagenum);

            const viewport = page.getViewport({ scale: 1 });

            const tempCanvas = document.createElement('canvas');
            const context = tempCanvas.getContext('2d');
            tempCanvas.height = viewport.height;
            tempCanvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;

            this.dataURL = tempCanvas.toDataURL();

            if (canvas) {
                const img = new CanvasImage(this.dataURL, options);
                await img.render();
                img.draw(canvas);
            }

            this.rendered = true;

            resolve(this.dataURL);
        });
    }

    /**
     * 
     * @param {Object} options options for the Bootstrap.Card 
     * @returns {Bootstrap.Card} a Bootstrap.Card with the page as an image
     */
    displayCard(options) {
        if (!this.rendered) throw new Error('Page not rendered');
        return new Bootstrap.Card({
            title: `Page ${this.pagenum}`,
            body: `<img src="${this.dataURL}" class="img-fluid" />`,
            ...options
        });
    }
};
class Curve {
    constructor(points) {
        this.points = points;
    }

    static linear(frames, from, to) {
        return new Curve(new Array(frames).fill(0).map((_, i) => {
            return {
                x: i,
                y: from + (to - from) / frames * i
            }
        }));
    }

    static polynomial(frames, from, to, ...coefficients) {
        const maxPower = coefficients.length - 1;
        return new Curve(new Array(frames).fill().map((_, i) => {
            // create a polynomial function
            const polynomial = coefficients.reduce((acc, coeff, power) => {
                return acc + coeff * Math.pow(i / frames, power);
            }, 0);

            return {
                x: i,
                y: from + (to - from) * polynomial
            }
        }));
    }

    static exponential(frames, from, to, base) {
        return new Curve(new Array(frames).fill().map((_, i) => {
            return {
                x: i,
                y: from + (to - from) * Math.pow(base, i / frames)
            }
        }));
    }

    static logarithmic(frames, from, to, base) {
        return new Curve(new Array(frames).fill().map((_, i) => {
            return {
                x: i,
                y: from + (to - from) * Math.log(i / frames) / Math.log(base)
            }
        }));
    }

    static sinusoidal(frames, from, to) {
        return new Curve(new Array(frames).fill().map((_, i) => {
            return {
                x: i,
                y: from + (to - from) * Math.sin(i / frames * Math.PI)
            }
        }));
    }

    static circular(frames, from, to) {
        return new Curve(new Array(frames).fill().map((_, i) => {
            return {
                x: i,
                y: from + (to - from) * (1 - Math.sqrt(1 - Math.pow(i / frames, 2)))
            }
        }));
    }
};
/**
 * 
 * @param {String} text text to copy into clipboard 
 */
function copyText(text) {
    navigator.clipboard.writeText(text);
    createNotification('Clipboard', `Copied text: ${text}`, 'success');
};
/**
 * 
 * @param {String} name cookie name
 * @returns cookie string
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};
// How long you want the animation to take, in ms
const animationDuration = 2000;
// Calculate how long each ‘frame’ should last if we want to update the animation 60 times per second
const frameDuration = 1000 / 60;
// Use that to calculate how many frames we need to complete the animation
const totalFrames = Math.round(animationDuration / frameDuration);
// An ease-out function that slows the count as it progresses
const easeOutQuad = t => t * (2 - t);

// The animation function, which takes an Element
const animateCountUp = el => {
    let frame = 0;
    const countTo = parseInt(el.innerHTML, 10);
    // Start the animation running 60 times per second
    const counter = setInterval(() => {
        frame++;
        // Calculate our progress as a value between 0 and 1
        // Pass that value to our easing function to get our
        // progress on a curve
        const progress = easeOutQuad(frame / totalFrames);
        // Use the progress value to calculate the current count
        const currentCount = Math.round(countTo * progress);

        // If the current count has changed, update the element
        if (parseInt(el.innerHTML, 10) !== currentCount) {
            el.innerHTML = currentCount;
        }

        // If we’ve reached our last frame, stop the animation
        if (frame === totalFrames) {
            clearInterval(counter);
        }
    }, frameDuration);
};

// Run the animation on all elements with a class of ‘countup’
const runCountUpAnimation = () => {
    const countupEls = document.querySelectorAll('.countup');
    countupEls.forEach(animateCountUp);
};

runCountUpAnimation();;
function showElement(el) {
    el.classList.remove('d-none');
    // el.classList.add('d-block');
}

function hideElement(el) {
    // el.classList.remove('d-block');
    el.classList.add('d-none');
}

function isHidden(el) {
    return el.classList.contains('d-none');
}

function cloak(el) {
    el.classList.add('invisible');
    el.classList.remove('visible');
}

function deCloak(el) {
    el.classList.remove('invisible');
    el.classList.add('visible');
}

// Turns html string into html object
function createElementFromText(str) {
    let div = document.createElement('div');
    div.innerHTML = str;
    return div.children[0];
}

function createElementFromSelector(selector) {
    var pattern = /^(.*?)(?:#(.*?))?(?:\.(.*?))?(?:@(.*?)(?:=(.*?))?)?$/;
    var matches = selector.match(pattern);
    var element = document.createElement(matches[1] || 'div');
    if (matches[2]) element.id = matches[2];
    if (matches[3]) {
        matches[3].split('.').forEach(c => {
            element.classList.add(c);
        });
    }
    if (matches[4]) element.setAttribute(matches[4], matches[5] || '');
    return element;
}


function createCheckbox(id, value, classList, name, checked, func) {
    let formCheck = document.createElement('div');
    formCheck.classList.add('form-check');
    formCheck.classList.add('ws-nowrap');

    let input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.value = value;
    input.id = id;
    if (classList) classList.forEach(c => {
        input.classList.add(c);
    });

    input.checked = checked;

    if (func) input.addEventListener('change', func);


    formCheck.appendChild(input);

    if (name) {
        let label = document.createElement('label');
        label.classList.add('form-check-label');
        label.classList.add('ps-2');
        label.innerText = name;
        formCheck.appendChild(label);
    }

    return formCheck;
}


/**
 * 
 * @param {HTMLElement} el HTML element
 * @param {Array} sections Array of objects with title/name and items
 * @param {Object} options Options object
 * 
 * @example
 * ```
 * createContextMenu(document.getElementById('myElement'), [
 *  {
 *     title: 'Title',
 *     items: [
 *       {
 *          title: 'Item',
 *         action: () => {
 *           // do something
 *        }
 *    }
 * ], {
 *   ignoreFrom: ['input', 'textarea'], // css selectors
 *   touchHold: {
 *    time: 500, // ms
 *    allowAttribute: 'data-touch-allow', // attribute to create context menu on touch hold. Use when you don't want a contextmenu to appear, ie. dragging (default: data-touch-allow)
 *    parentTest: false // if true, will test parent elements for allowAttribute (default: false)
 *   }
 * });
 * ```
 */
// function createContextMenu(el, sections, options) {
//     // remove previous event listeners?

//     let ignoreFrom,
//         touchHold = {
//             time: 500,
//             allowAttribute: 'data-touch-allow',
//             parentTest: false
//         };
//     if (options) {
//         ignoreFrom = options.ignoreFrom;
//         touchHold = {...touchHold, ...options.touchHold };
//     }

//     const createSections = (e) => {
//         let ignoreEls = [];
//         if (Array.isArray(ignoreFrom)) {
//             ignoreFrom.forEach(i => {
//                 el.querySelectorAll(i).forEach(_e => {
//                     ignoreEls.push(_e);
//                 });
//             });
//             // return if the element is in the ignore list or is a child of one of the ignore list elements.
//             if (ignoreEls.some(i => i.contains(e.target))) {
//                 // console.log('Ignoring right click');
//                 return;
//             }
//         }

//         e.preventDefault();
//         const contextmenuContainer = document.querySelector('#contextmenu-container');

//         const menu = document.querySelector('#contextmenu');
//         menu.innerHTML = '';

//         sections.forEach(section => {
//             const { name, items } = section;
//             let { title } = section;

//             if (!title) title = name;
//             // const sectionEl = document.createElement('li');
//             const sectionTitle = createElementFromSelector('p.ws-nowrap.bg-dark.text-secondary.p-1.rounded.m-0.no-select');
//             sectionTitle.innerHTML = title;
//             // sectionEl.appendChild(sectionTitle);
//             menu.appendChild(sectionTitle);

//             // const sectionDivider = document.createElement('li');
//             const sectionDividerEl = createElementFromSelector('hr.dropdown-divider.bg-light.m-0');
//             // sectionDivider.appendChild(sectionDividerEl);
//             menu.appendChild(sectionDividerEl);

//             items.forEach(item => {
//                 const { name, action, func, color } = item;
//                 let { title } = item;
//                 if (!title) title = name;
//                 // const itemEl = document.createElement('li');
//                 const itemElLink = createElementFromSelector('p.ws-nowrap.cursor-pointer.bg-dark.text-light.m-0.p-1.rounded');

//                 itemElLink.addEventListener('mouseover', () => {
//                     itemElLink.classList.remove('bg-dark');
//                     itemElLink.classList.add(`bg-${color ? color : 'primary'}`);
//                 });
//                 itemElLink.addEventListener('mouseout', () => {
//                     itemElLink.classList.remove(`bg-${color ? color : 'primary'}`);
//                     itemElLink.classList.add('bg-dark');
//                 });

//                 itemElLink.innerHTML = title;
//                 if (action) {
//                     itemElLink.addEventListener('click', action);
//                 } else if (func) {
//                     itemElLink.addEventListener('click', func);
//                 }
//                 // itemEl.appendChild(itemElLink);
//                 menu.appendChild(itemElLink);
//             });
//         });

//         const { clientX: mouseX, clientY: mouseY } = e;
//         contextmenuContainer.style.left = mouseX + 'px';
//         contextmenuContainer.style.top = mouseY + 'px';
//         showElement(contextmenuContainer);

//         const removeMenu = (evt) => {
//             if (evt.target == el) return;
//             hideElement(contextmenuContainer);
//             menu.innerHTML = '';
//             document.removeEventListener('click', removeMenu);
//             // document.removeEventListener('contextmenu', removeMenu);
//         }

//         document.addEventListener('click', removeMenu);
//         // document.addEventListener('contextmenu', removeMenu);
//     }

//     el.removeEventListener('contextmenu', createSections);
//     el.addEventListener('contextmenu', createSections);
//     el.addEventListener('touchstart', (e) => {
//         let runFunction = true;
//         e.preventDefault();
//         e.clientX = e.touches[0].clientX;
//         e.clientY = e.touches[0].clientY;

//         const touchEnd = (e) => {
//             runFunction = false;
//             el.removeEventListener('touchend', touchEnd);
//             clearTimeout(timeout);
//         }

//         el.addEventListener('touchend', touchEnd);

//         console.log(touchHold);

//         let timeout = setTimeout(() => {
//             if (runFunction) {
//                 let allow = false;
//                 if (touchHold.parentTest) {
//                     getAllParentElements(e.target).forEach(p => {
//                         if (p.getAttribute(touchHold.allowAttribute)) allow = true;
//                     });
//                 } else {
//                     if (e.target.getAttribute(touchHold.allowAttribute)) allow = true;
//                 }
//                 if (allow) createSections(e);
//             }
//             el.removeEventListener('touchend', touchEnd);
//         }, touchHold.time);
//     });
// }

function createContextMenu(el, sections, options = {
    ignoreFrom: [],
    touchMenu: true
}) {
    // remove previous event listeners

    const { ignoreFrom, touchMenu } = options;

    const createSections = (e) => {
        let ignoreEls = [];
        if (Array.isArray(ignoreFrom)) {
            ignoreFrom.forEach(i => {
                el.querySelectorAll(i).forEach(_e => {
                    ignoreEls.push(_e);
                });
            });
            // return if the element is in the ignore list or is a child of one of the ignore list elements.
            if (ignoreEls.some(i => i.contains(e.target))) {
                // console.log('Ignoring right click');
                return;
            }
        }

        e.preventDefault();
        const contextmenuContainer = document.querySelector('#contextmenu-container');

        const menu = document.querySelector('#contextmenu');
        menu.innerHTML = '';

        sections.forEach(section => {
            const { name, items } = section;
            let { title } = section;

            if (!title) title = name;
            // const sectionEl = document.createElement('li');
            const sectionTitle = createElementFromSelector('p.ws-nowrap.bg-dark.text-secondary.p-1.rounded.m-0.no-select');
            sectionTitle.innerHTML = title;
            // sectionEl.appendChild(sectionTitle);
            menu.appendChild(sectionTitle);

            // const sectionDivider = document.createElement('li');
            const sectionDividerEl = createElementFromSelector('hr.dropdown-divider.bg-light.m-0');
            // sectionDivider.appendChild(sectionDividerEl);
            menu.appendChild(sectionDividerEl);

            items.forEach(item => {
                const { name, action, func, color } = item;
                let { title } = item;
                if (!title) title = name;
                // const itemEl = document.createElement('li');
                const itemElLink = createElementFromSelector('p.ws-nowrap.cursor-pointer.bg-dark.text-light.m-0.p-1.rounded');

                itemElLink.addEventListener('mouseover', () => {
                    itemElLink.classList.remove('bg-dark');
                    itemElLink.classList.add(`bg-${color ? color : 'primary'}`);
                });
                itemElLink.addEventListener('mouseout', () => {
                    itemElLink.classList.remove(`bg-${color ? color : 'primary'}`);
                    itemElLink.classList.add('bg-dark');
                });

                itemElLink.innerHTML = title;
                if (action) {
                    itemElLink.addEventListener('click', action);
                } else if (func) {
                    itemElLink.addEventListener('click', func);
                }
                // itemEl.appendChild(itemElLink);
                menu.appendChild(itemElLink);
            });
        });

        if (e.type == 'touchstart') {
            e = {
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            }
        }

        const {
            clientX: mouseX,
            clientY: mouseY
        } = e;
        contextmenuContainer.style.left = mouseX + 'px';
        contextmenuContainer.style.top = mouseY + 'px';
        showElement(contextmenuContainer);

        const removeMenu = (evt) => {
            if (evt.target == el) return;
            hideElement(contextmenuContainer);
            menu.innerHTML = '';
            document.removeEventListener('click', removeMenu);
            // document.removeEventListener('contextmenu', removeMenu);
        }

        document.addEventListener('click', removeMenu);
        // document.addEventListener('contextmenu', removeMenu);
    }

    el.removeEventListener('contextmenu', createSections);
    el.addEventListener('contextmenu', createSections);

    if (touchMenu) {
        let touching = false;
        const waitForTouch = (e) => {
            e.preventDefault();
            // if touch is held for .5 seconds
            touching = true;

            setTimeout(() => {
                if (touching) {
                    createSections(e);
                    touching = false;
                }
            }, 500);
        }

        const stopTouch = (e) => {
            e.preventDefault();
            touching = false;
        }

        el.removeEventListener('touchstart', waitForTouch);
        el.removeEventListener('touchend', stopTouch);

        el.addEventListener('touchstart', waitForTouch);
        el.addEventListener('touchend', stopTouch);


    }
}

function getAllParentElements(el) {
    let parents = [];
    let parent = el.parentElement;
    while (parent) {
        parents.push(parent);
        parent = parent.parentElement;
    }
    return parents;
};
// // Data url:
// // Get a reference to the file input
// const fileInput = document.querySelector('input#thing');

// // Listen for the change event so we can capture the file
// fileInput.addEventListener('change', (e) => {
//     // Get a reference to the file
//     const file = e.target.files[0];

//     // Encode the file using the FileReader API
//     const reader = new FileReader();
//     reader.onloadend = () => {
//         console.log(reader.result);
//         // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
//     };
//     reader.readAsDataURL(file);
// });

// function fileUploadToDataUrl(input) {
//     // Get a reference to the file
//     const file = input.files[0];

//     // Encode the file using the FileReader API
//     const reader = new FileReader();
//     reader.onloadend = () => {
//         console.log(reader.result);
//         // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
//     };
//     reader.readAsDataURL(file);
// }





// FileReader:

function fileUpload(file, cb, cbError) {
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function(evt) {
            if (cb) cb(evt);
            // document.getElementById("fileContents").innerHTML = evt.target.result;
        }
        reader.onerror = function(evt) {
            console.log('Error reading file');
            if (cbError) cbError(evt);
            // document.getElementById("fileContents").innerHTML = "error reading file";
        }
    }
}

/**
 * 
 * @param {Element} input File input element 
 * @param {Function} callback Function to call when file is loaded 
 * @param {Array} accept Array of accepted file types ['pdf','png','jpg']
 * @param {Function} unacceptableCb (optional) Function to call when file is unacceptable, else it will create an alert
 */
function readMultipleFiles(input, callback, accept, unacceptableCb) {
    if (!input.querySelector) throw new Error('input must be a node!');
    if (!callback) throw new Error('readMultipleFiles requires a callback!');

    const { files } = input;

    var reader = new FileReader();
    let fileBin = [];

    const readFile = (index) => {
        const file = files[index];

        if (index >= files.length) {
            callback(fileBin);
            return;
        }

        const splitName = file.name.split('.');
        const ext = splitName[splitName.length - 1];
        if (!accept.find(a => a.toLowerCase() == ext.toLowerCase())) {
            if (unacceptableCb) unacceptableCb(file, index);
            else alert('File type not accepted!');
            return;
        }

        reader.onloadend = (e) => {
            // get file content
            fileBin.push({
                filename: file.name,
                data: e.target.result,
                extension: ext
            });
            readFile(index + 1);
        }
        reader.readAsBinaryString(file);
    }
    readFile(0);
}

async function readFiles(input, accept = []) {
    if (!input.querySelector) throw new Error('input must be a node!');
    const { files } = input;

    var reader = new FileReader();
    return await Promise.all(Array.from(files).map(async(file) => {
        const splitName = file.name.split('.');
        const ext = splitName[splitName.length - 1];
        if (!accept.find(a => a.toLowerCase() == ext.toLowerCase())) {
            alert('File type not accepted!');
            return;
        }

        return await new Promise((resolve, reject) => {
            reader.onloadend = (e) => {
                // get file content
                resolve({
                    filename: file.name,
                    data: e.target.result,
                    extension: ext
                });
            }
            reader.readAsBinaryString(file);
        });
    }));
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (parseFloat((bytes / Math.pow(k, i)).toFixed(dm))) + ' ' + sizes[i];
}

function viewImageFromFileUpload(input, target) {
    if (input.files.length > 0) {
        var reader = new FileReader();

        reader.onload = function(e) {
            target.setAttribute('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
};
'use strict';
// let currentPage;
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const interactEvents = [
    'mouseover',
    'mousemove',
    'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'mousewheel',
    'mouseout',
    'contextmenu',
    'keydown',
    'keypress',
    'keyup',
    'touchstart',
    'touchend',
    'touchmove',
    'touchcancel'
];

const manualEvents = [
    'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'contextmenu',
    'keydown',
    'keypress',
    'keyup',
    'touchstart',
    'touchend',
    'touchcancel'
];

/**
 * 
 * @param {Array} matches matches array pulled from database OR thebluealliance API 
 * @returns {Array} sorted array starting with qm1 and ending with finals
 */
function sortMatches(matches) {
    const sortArr = [
        'qm',
        'qf',
        'sf',
        'f'
    ];

    return matches.sort((a, b) => a.number - b.number).sort((a, b) => {
        const aIndex = sortArr.indexOf(a.compLevel || a.comp_level);
        const bIndex = sortArr.indexOf(b.compLevel || b.comp_level);

        if (aIndex > bIndex) {
            return 1;
        } else if (aIndex < bIndex) {
            return -1;
        } else {
            return 0;
        }
    });
}

function filterTatorMatches(matches) {
    return matches.filter((match) => {
        const {
            alliances
        } = match;

        if (alliances.red.teamKeys.includes('frc2122') || alliances.blue.teamKeys.includes('frc2122')) {
            return true;
        } else return false;
    });
}

/**
 * 
 * @param {Date} date Target date object
 * @param {HTMLElement} element Target element to append the date to
 * @param {String} endMessage (OPTIONAL) Message to append to the end of the date
 * @returns {Object} Interval object
 */
function countdownToDate(date, element, endMessage) {
    // set interval to update the countdown
    let cdInterval = setInterval(() => {
        const now = new Date();
        const diff = date - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        element.innerHTML = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

        if (diff < 0) {
            clearInterval(cdInterval);
            element.innerHTML = endMessage ? endMessage : 'Countdown finished';
        }
    }, 1000);

    return cdInterval;
}

function convertDateStrToObj(str) {
    // input is "2022-08-22"
    const dateArr = str.split('-');
    return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
}


const sleep = async(n) => {
    // sleep for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000 * n));
    return 'done';
};


const convertObjToCamelCase = (obj) => {
    try {
        JSON.stringify(obj);
    } catch {
        console.error('Cannot convert to camel case due to circular reference');
        return obj;
    }

    // convert json string to camel case using regex
    // only convert keys
    // if value is object, convert recursively

    if (Array.isArray(obj)) return obj.map(convertObjToCamelCase);

    if (typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                newObj[convertObjToCamelCase(key)] = convertObjToCamelCase(obj[key]);
            } else {
                newObj[convertObjToCamelCase(key)] = obj[key];
            }
        }
        return newObj;
    } else {
        return obj.replace(/(_[a-z])/g, (match) => {
            return match[1].toUpperCase();
        });
    }
}


const mainFunctions = {};

window.isMobile =
    (function(a) {
        return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)));
    })(navigator.userAgent || navigator.vendor || window.opera);

// Chart.register(BoxPlotController, BoxAndWhiskers, LinearScale, CategoryScale);;
class CustomNotification {
    constructor(title, msg, color, options) {
        this.title = title;
        this.msg = msg;
        this.color = color;
        this.options = options;
    }

    create() {
        this.el = createNotificationEl(this.title, this.msg, this.color, this.options);
    }

    static createNew(title, msg, color, options) {
        const n = new CustomNotification(title, msg, color, options);
        n.create();
    }

    remove() {
        this.el.remove();
    }
}



document.addEventListener('DOMContentLoaded', () => {
    // VVVVVVVVV Creates notification container VVVVVVVVV
    let notificationEl = document.createElement('div');
    notificationEl.setAttribute('aria-live', 'polite');
    notificationEl.setAttribute('aria-atomic', 'true');
    notificationEl.style.minWidth = 'min-content';
    notificationEl.style.minHeight = 'min-content';
    notificationEl.style.position = 'fixed';
    notificationEl.style.top = '56px';
    notificationEl.style.right = '0px';
    notificationEl.classList.add('text-light');

    let innerNotificationEl = document.createElement('div');
    innerNotificationEl.style.position = 'absolute';
    innerNotificationEl.style.top = '0';
    innerNotificationEl.style.right = '0';
    innerNotificationEl.id = 'notifications';

    notificationEl.appendChild(innerNotificationEl);

    document.querySelector('main').appendChild(notificationEl);
});



let num = 0;

// Makes toast
function createNotificationEl(title, msg, color) {
    let toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add(`bg-${color}`);
    toast.classList.add('notification');
    toast.id = 'notification-' + num;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    let header = document.createElement('div');
    header.classList.add('toast-header');
    header.classList.add('bg-dark');
    header.classList.add('d-flex');
    header.classList.add('justify-content-between');

    let strong = document.createElement('strong');
    strong.classList.add('mr-auto');
    strong.classList.add(`text-${color}`);
    strong.innerText = title ? title : 'Team Tators';
    header.appendChild(strong);

    let small = document.createElement('small');
    small.classList.add('text-muted');
    small.innerText = (new Date(Date.now())).toDateString();
    header.appendChild(small);

    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('ml-2');
    button.classList.add('mb-1');
    button.classList.add('bg-dark');
    button.classList.add('border-0');
    button.classList.add('text-light');
    button.setAttribute('data-dismiss', 'toast');


    let span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '&times;';
    button.appendChild(span);
    header.appendChild(button);
    toast.appendChild(header);

    let body = document.createElement('div');
    body.classList.add('toast-body');
    body.innerText = msg;
    toast.appendChild(body);

    return toast;
}

/**
 * 
 * @param {String} title title, defaults to 'Team Tators'
 * @param {String} msg content of body
 * @param {String} color bs color
 * @param {Number} length in seconds 
 */
function createNotification(title, msg, color, options) {
    let length, permanent = false;

    if (options) {
        length = options.length;
        permanent = options.permanent;
    }

    let notification = createNotificationEl(title, msg, color);

    let removed = false;
    const timeout = setTimeout(() => {
        removed = true;
        removeNotification(notification);
    }, length ? length * 1000 : 1000 * 5);

    notification.querySelector('button').addEventListener('click', () => {
        if (!removed) {
            removeNotification(notification);
            clearTimeout(timeout);
        }
    });

    document.querySelector('#notifications').appendChild(notification);

    // Shows toast using bs api
    $(`#notification-${num}`).toast({
        animation: true,
        autohide: !permanent,
        delay: length ? length * 1000 : 1000 * 5
    });
    $(`#notification-${num}`).toast('show');
    $(`#${notification.id}`).on('hidden.bs.toast', () => {
        notification.remove();
    });
    num++;

    return notification;
}

function removeNotification(notification) {
    $(`#${notification.id}`).toast('hide');
}

function pushNotification(title, message) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        // alert("This browser does not support desktop notification");
        return;
    }
    // Let's check if the user is okay to get some notification
    if (window.Notification.permission === "granted") {
        // If it's okay let's create a notification
        var options = {
            body: message,
            dir: "ltr"
        };
        var notification = new window.Notification(title ? title : "Team Tators", options);
        console.log(notification);
        return;
    }
    // Otherwise, we need to ask the user for permission
    // Note, Chrome does not implement the permission static property
    // So we have to check for NOT 'denied' instead of 'default'
    if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
            // Whatever the user answers, we make sure we store the information
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }
            // If the user is okay, let's create a notification
            if (permission === "granted") {
                var options = {
                    body: message,
                    dir: "ltr"
                };
                var notification = new Notification(title ? title : "Team Tators", options);
            }
        });
        return;
    }

    alert(`${title ? title : "Team Tators"}: ${message}`);

    // At last, if the user already denied any notification, and you
    // want to be respectful there is no need to bother them anymore.
}

// TODO: run on deployment
// pushNotification('Team Tators: init', 'Notifications are working!');;
class CustomRequest {
    constructor({
        url,
        method = 'POST',
        func,
        headers,
        body,
        params,
        noHeaders,
        receive = 'JSON',
        cached = false
    }) {
        this.url = url;
        this.method = method;
        this.func = func;
        this.headers = headers;
        this.body = body;
        this.params = params;
        this.noHeaders = noHeaders;
        this.receive = receive;
        this.cached = cached;

        this.requestStart = Date.now();
        this.originalUrl = url;
        if (!url) {
            console.error('Error: No URL provided, no request sent');
            return;
        }

        if ((method.toUpperCase() == "GET" || method.toUpperCase() == "HEAD") && body != undefined) {
            console.error('Cannot have body in GET or HEAD request, no request sent');
            return;
        }

        let _headers = {};
        if (body && !noHeaders) _headers = {...headers,
            "Content-Type": "application/json"
        };

        this.headers = _headers;
        this.headers['Accept'] = "application/json";

        // iterates through params and puts them on the urlString as an encodedURI Variable
        if (params) {
            url += '?'
            Object.keys(params).forEach(param => {
                url += encodeURI(`${param}=${params[param]}&`);
            });
            url = url.slice(0, url.length - 1);
        }

        // console.log(`${method} Request: ${url}`);
    }

    async send() {
        const data = await requestFromServer({
            url: this.url,
            method: this.method,
            headers: this.headers,
            body: this.body,
            receive: this.receive,
            cached: this.cached
        });

        if (this.func) {
            if (this.func.constructor.name == 'AsyncFunction') {
                return await this.func(data);
            } else {
                return this.func(data);
            }
        }

        if (data.msg) {
            const n = new CustomNotification(data.title, data.msg, data.color, data.options);
            n.create();
        }

        return data;
    }

    static async sendNew(obj) {
        const request = new CustomRequest(obj);
        return await request.send();
    }
}


let requestTimes = [],
    totalLoadTime = 0;
async function requestFromServer({
    url,
    method = 'POST',
    func,
    headers,
    body,
    params,
    noHeaders,
    receive = 'JSON',
    cached = false
}) {
    const requestStart = Date.now();
    const originalUrl = url;
    if (!url) {
        console.error('Error: No URL provided, no request sent');
        return;
    }
    if ((method.toUpperCase() == "GET" || method.toUpperCase() == "HEAD") && body != undefined) {
        console.error('Cannot have body in GET or HEAD request, no request sent');
        return;
    }

    let _headers = {};
    if (body && !noHeaders) _headers = {...headers,
        "Content-Type": "application/json"
    };
    headers = _headers
    headers['Accept'] = "application/json";

    // iterates through params and puts them on the urlString as an encodedURI Variable
    if (params) {
        url += '?'
        Object.keys(params).forEach(param => {
            url += encodeURI(`${param}=${params[param]}&`);
        });
        url = url.slice(0, url.length - 1);
    }
    // console.log(`${method} Request: ${url}`);
    let options = {
        method: method.toUpperCase(),
        body: JSON.stringify({
            ...body,
            date: requestStart
        }),
        headers: headers
    }

    let prevRequest = requestTimes.find(r => {
        let _params = true;
        if (r.params) {
            _params = JSON.stringify(r.params) == JSON.stringify(params);
        }
        let _body = true;
        if (r.body) {
            _body = JSON.stringify(r.body) == JSON.stringify(body);
        }
        return (r.url == url && r.method == method && _body && _params);
    });

    if (prevRequest && cached) {
        console.log(`Request found in cache, returning cached response`);
        return prevRequest.response;
    }



    return fetch(url, options).then(res => {
        if (receive == 'JSON') return res.json();
        if (receive == 'TEXT') return res.text();
        if (receive == 'BLOB') return res.blob();
    }).then(async(data) => {
        // console.log(data);

        if (data.status == 'epic-failure') return;

        // Creates notification
        const { status, title, msg, url, wait, clearCart, notificationLength, permanent } = data;
        if (msg) {
            createNotification(title, msg, status, {
                length: notificationLength,
                permanent
            });
        }

        if (url) setTimeout(() => {
            location.pathname = url;
        }, wait ? wait * 1000 : 0);

        if (func) {
            if (func.constructor.name == 'AsyncFunction') await func(data);
            else func(data);
        }
        if (clearCart) window.localStorage.removeItem('cart'); // specific to my code
        const requestEnd = Date.now();
        const requestDelta = requestEnd - requestStart;
        // console.log(`Time for ${method} - ${originalUrl}: ${requestDelta}`);
        totalLoadTime += requestDelta;
        // console.log(`Total Load Time: ${totalLoadTime}`);
        requestTimes.push({
            url: originalUrl,
            start: requestStart,
            end: requestEnd,
            delta: requestDelta,
            totalTime: totalLoadTime,
            body,
            params,
            response: data
        });
        return data;
    });
};
/**
 * 
 * @param {Date} date Date object
 * @returns Time in am/pm instead of 24hr
 */
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function AMPMtoMinutes(time) {
    const [t, ap] = time.split(' ');
    const [h, m] = t.split(':');
    const delta = ap == 'AM' ? 0 : 12;

    let minutes = ((+h + +delta) * 60) + +m;
    return minutes;
}

function minutesToAMPM(minutes) {
    let h = Math.floor(minutes / 60);
    let m = minutes % 60;
    let ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    m = m < 10 ? '0' + m : m;
    var strTime = h + ':' + m + ' ' + ap;
    return strTime;
}

function convertDayToDate(dayInput) {
    try {
        // dayInput is a string in the format of '07/19/2022, 5:30 PM'
        // output must be a Date object
        const [date, time] = dayInput.split(', ');
        const [month, day, year] = date.split('/');
        const [_time, ampm] = time.split(' ');
        const [hour, minute] = _time.split(':');
        const delta = ampm.toUpperCase() == 'AM' ? 0 : 12;
        const hours = (+hour + +delta);
        const minutes = +minute;
        const seconds = 0;
        const milliseconds = 0;
        return new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
    } catch (e) {
        console.log(e);
        alert('Your date input is invalid, it must be in the format of: "mm/dd/yyyy, hh:mm AM/PM"');
    }
}