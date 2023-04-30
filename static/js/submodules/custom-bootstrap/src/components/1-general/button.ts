/**
 * Description placeholder
 *
 * @typedef {CBS_ButtonOptions}
 */
type CBS_ButtonOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    outlined?: boolean;
    rounded?: boolean;
    size?: CBS_Size;
    color?: string;
    shadow?: boolean;

    text?: string;
}


/**
 * Description placeholder
 *
 * @class CBS_ButtonContent
 * @typedef {CBS_ButtonContent}
 * @extends {CBS_Element}
 */
class CBS_ButtonContent extends CBS_Element {
    /**
     * Creates an instance of CBS_ButtonContent.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('div');
    }
}


/**
 * Description placeholder
 *
 * @class CBS_Button
 * @typedef {CBS_Button}
 * @extends {CBS_Component}
 */
class CBS_Button extends CBS_Component {
    // options: CBS_ButtonOptions = {};
    /**
     * Description placeholder
     *
     * @type {CBS_NodeContainer}
     */
    subcomponents: CBS_ElementContainer = {
        content: new CBS_ButtonContent()
    };

    /**
     * Creates an instance of CBS_Button.
     *
     * @constructor
     * @param {?CBS_ButtonOptions} [options]
     */
    constructor(options?: CBS_ButtonOptions) {
        super(options);

        this.el = document.createElement('button');

        this.addClass('btn');

        this.append(this.subcomponents.content);

        this.options = options || {};
    }


    get content() {
        return this.subcomponents.content;
    }

    set content(content: string | HTMLElement | CBS_Element) {
        if (typeof content === 'string') {
            this.subcomponents.content.html = content;
        } else if (content instanceof HTMLElement) {
            this.subcomponents.content.el = content;
        } else if (content instanceof CBS_Element) {
            this.subcomponents.content = content;
        }
    }



    /**
     * Description placeholder
     *
     * @type {CBS_ButtonOptions}
     */
    set options(options: CBS_ButtonOptions) {
        super.options = options;

        if (options.color) {
            if (options.outlined) {
                this.el.classList.add(`btn-outline-${options.color}`);
            } else {
                this.el.classList.add(`btn-${options.color}`);
            }
        }

        if (options.size) {
            this.el.classList.add(`btn-${options.size}`);
        }

        if (options.rounded) {
            this.el.classList.add(`btn-rounded`);
        }

        if (options.shadow) {
            this.el.classList.add(`btn-shadow`);
        }

        if (options.text) {
            this.content = options.text;
        }
    }

    /**
     * Description placeholder
     */
    disable() {
        this.el.setAttribute('disabled', 'disabled');
    }

    /**
     * Description placeholder
     */
    enable() {
        this.el.removeAttribute('disabled');
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get enabled() {
        return !this.disabled;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get disabled() {
        return this.el.hasAttribute('disabled');
    }
}


CBS.addElement('button', CBS_Button);

(() => {
    const modalClose = new CBS_Button({
        color: 'secondary',
        size: CBS_Size.sm,
        classes: ['btn-close'],
        attributes: {
            'type': 'button',
            'data-bs-dismiss': 'modal',
            'aria-label': 'Close'
        }
    });

    // modalClose.removeClass('btn');

    CBS_Button.addTemplate('modal-close', modalClose);
})();