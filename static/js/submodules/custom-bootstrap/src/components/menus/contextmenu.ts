/**
 * Description placeholder
 *
 * @class CBS_ContextMenuItem
 * @typedef {CBS_ContextMenuItem}
 * @extends {CBS_Paragraph}
 */
class CBS_ContextMenuItem extends CBS_Paragraph {
    /**
     * Creates an instance of CBS_ContextMenuItem.
     *
     * @constructor
     * @param {CBS_ContextmenuSelectOptions} options
     * @param {() => void} callback
     */
    constructor( options: CBS_ContextmenuSelectOptions, callback: () => void) {
        super();

        this.text = options.name;

        if (options.color) {
            this.addClass(`text-${options.color}`);
            this.color = options.color;
        }

        this.on('click', callback);
        this.on('mouseover', () => this.addClass('bg-secondary'));
        this.on('mouseout', () => this.removeClass('bg-secondary'));

        // touch events
        this.on('touchstart', () => this.addClass('bg-secondary'));
        this.on('touchend', () => this.removeClass('bg-secondary'));
        this.on('touchcancel', () => this.removeClass('bg-secondary'));
        this.on('touchmove', () => this.removeClass('bg-secondary'));
        this.on('touchleave', () => this.removeClass('bg-secondary'));
        this.on('touchenter', () => this.addClass('bg-secondary'));
        this.on('touchforcechange', () => this.removeClass('bg-secondary'));
        this.on('touchend', () => this.removeClass('bg-secondary'));
    }
}

/**
 * Description placeholder
 *
 * @typedef {CBS_ContextmenuSections}
 */
type CBS_ContextmenuSections = {
    [key: string]: CBS_ContextmenuSection;
}

/**
 * Description placeholder
 *
 * @class CBS_ContextmenuSection
 * @typedef {CBS_ContextmenuSection}
 * @extends {CBS_Component}
 */
class CBS_ContextmenuSection extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ContextMenuItem[]}
     */
    items: CBS_ContextMenuItem[] = [];
    /**
     * Description placeholder
     *
     * @type {?CBS_Color}
     */
    color?: CBS_Color;

    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        title: new CBS_H6()
    }

    /**
     * Creates an instance of CBS_ContextmenuSection.
     *
     * @constructor
     * @param {CBS_ContextmenuSelectOptions} options
     */
    constructor(options: CBS_ContextmenuSelectOptions) {
        super();

        this.el = document.createElement('div');

        if (options.color) {
            this.addClass(`bg-${options.color}`);
            this.color = options.color;
        }

        this.name = options.name;
    }

    /**
     * Description placeholder
     *
     * @param {string} name
     * @param {() => void} callback
     * @returns {CBS_ContextMenuItem}
     */
    addItem(name: string, callback: () => void): CBS_ContextMenuItem {
        const item = new CBS_ContextMenuItem({ name, color: this.color }, callback);
        this.items.push(item);
        return item;
    }

    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {boolean}
     */
    removeItem(name: string): boolean {
        const index = this.items.findIndex((item) => item.text === name);
        if (index >= 0) {
            this.items.splice(index, 1);
            return true
        }
        return false;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set name(name: string) {
        (this.subcomponents.title as CBS_Text).text = name;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get name(): string {
        return (this.subcomponents.title as CBS_Text).text;
    }
}

/**
 * Description placeholder
 *
 * @typedef {CBS_ContextmenuSelectOptions}
 */
type CBS_ContextmenuSelectOptions = {
    color?: CBS_Color;
    name: string;
}

/**
 * Description placeholder
 *
 * @typedef {CBS_ContextmenuOptions}
 */
type CBS_ContextmenuOptions = {
    /**
     * Classes to be added to the element
     *
     * @type {?string[]}
     */
    classes?: string[];
    /**
     * Id to be added to the element
     *
     * @type {?string}
     */
    id?: string;
    /**
     * Style to be added to the element
     *
     * @type {?object}
     */
    style?: object;
    /**
     * Attributes to be added to the element
     *
     * @type {?object}
     */
    attributes?: {
        [key: string]: string;
    }

    color?: CBS_Color;
}

/**
 * Description placeholder
 *
 * @class CBS_Contextmenu
 * @typedef {CBS_Contextmenu}
 * @extends {CBS_Component}
 */
class CBS_Contextmenu extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ContextmenuSections}
     */
    sections: CBS_ContextmenuSections = {};
    /**
     * Description placeholder
     *
     * @type {?(CBS_Element|HTMLElement)}
     */
    actionElement?: CBS_Element|HTMLElement;
    /**
     * Description placeholder
     *
     * @type {?CBS_Color}
     */
    color?: CBS_Color;

    /**
     * Creates an instance of CBS_Contextmenu.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);
    }

    /**
     * Description placeholder
     *
     * @type {CBS_ContextmenuOptions}
     */
    set options(options: CBS_ContextmenuOptions) {
        const { color } = this;
        if (color) this.removeClass(`bg-${color}`);

        super.options = options;

        if (options.color) {
            this.color = options.color;
            this.addClass(`bg-${options.color}`);
        }
    }

    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {CBS_ContextmenuSection}
     */
    addSection(name: string): CBS_ContextmenuSection {
        this.sections[name] = new CBS_ContextmenuSection({ color: this.color, name });
        return this.sections[name];
    }

    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {boolean}
     */
    removeSection(name: string): boolean {
        if (this.sections[name]) {
            delete this.sections[name];
            return true;
        }
        return false;
    }

    /**
     * Description placeholder
     *
     * @param {(CBS_Element|HTMLElement)} element
     */
    applyTo(element: CBS_Element|HTMLElement) {
        try {
            if (this.actionElement) {
                if (this.actionElement instanceof CBS_Element) {
                    this.actionElement.off('contextmenu', this._show);
                } else {
                    this.actionElement.removeEventListener('contextmenu', this.show);
                }
            }

            if (element instanceof CBS_Element) {
                element.on('contextmenu', this._show);
            } else {
                element.addEventListener('contextmenu', this._show);
            }
        } catch {
            console.warn('Error applying contextmenu to:', element, 'Was it an HTML element or CBS element?');
        }
    }

    /**
     * Description placeholder
     *
     * @private
     * @param {Event} e
     */
    private _show(e: Event) {
        e.preventDefault();

        this.style = {
            '--animate-duration': '0.2s'
        }

        this.addClass('animate__animated', 'animate__faster');

        const { x, y } = this.getXY(e as MouseEvent|TouchEvent);

        const { width, height } = this.el.getBoundingClientRect();

        const { innerWidth, innerHeight } = window;

        let up: string, left: string;

        if (x + width > innerWidth) {
            this.el.style.left = `${x - width}px`;
            left = 'Right';
        } else {
            this.el.style.left = `${x}px`;
            left = 'Left';
        }

        if (y + height > innerHeight) {
            this.el.style.top = `${y - height}px`;
            up = 'Down';
        } else {
            this.el.style.top = `${y}px`;
            up = 'Up';
        }

        this.addClass(`animate__rotateIn${up}${left}`);

        this.show();

        const animateCB = () => {
            this.removeClass(`animate__rotateIn${up}${left}`, 'animate__animated', 'animate__faster');
            this.off('animationend', animateCB);
        }

        setTimeout(animateCB, 200);

        this.on('animationend', animateCB);
    }
}


CBS.addElement('contextmenu', CBS_Contextmenu);