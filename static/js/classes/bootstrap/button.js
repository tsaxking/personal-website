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
}