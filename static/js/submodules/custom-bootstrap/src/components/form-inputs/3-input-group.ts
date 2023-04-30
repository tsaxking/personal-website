/**
 * Description placeholder
 *
 * @typedef {CBS_InputGroupOptions}
 */
type CBS_InputGroupOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    type?: string;
}

/**
 * Description placeholder
 *
 * @class CBS_InputGroupLabel
 * @typedef {CBS_InputGroupLabel}
 * @extends {CBS_Element}
 */
class CBS_InputGroupLabel extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    #text: string = '';

    /**
     * Creates an instance of CBS_InputGroupLabel.
     *
     * @constructor
     * @param {?CBS_InputGroupOptions} [options]
     */
    constructor(options?: CBS_InputGroupOptions) {
        super(options);

        this.el = document.createElement('span');
        this.addClass('input-group-text');
    }


    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text: string) {
        this.#text = text;
        this.el.textContent = text;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text() {
        return this.#text;
    }
}



/**
 * Description placeholder
 *
 * @class CBS_InputGroup
 * @typedef {CBS_InputGroup}
 * @extends {CBS_Component}
 */
class CBS_InputGroup extends CBS_Component {
    // id: string = 'basic-addon-' + Math.floor(Math.random() * Date.now()).toString(16);

    /**
     * Creates an instance of CBS_InputGroup.
     *
     * @constructor
     * @param {?CBS_InputGroupOptions} [options]
     */
    constructor(options?: CBS_InputGroupOptions) {
        super(options);

        this.el = document.createElement('div');
        this.addClass('input-group');
        this.marginB = 3;
    }

    /**
     * Description placeholder
     *
     * @param {string} label
     */
    addGroupLabel(label: string) {
        const groupLabel = new CBS_InputGroupLabel();
        groupLabel.text = label;
        this.append(groupLabel);

        this.trigger('label:add');
    }

    /**
     * Description placeholder
     *
     * @param {(CBS_Input|CBS_InputLabelContainer)} input
     */
    addInput(input: CBS_Input|CBS_InputLabelContainer) {
        this.append(input);

        this.trigger('input:add');
    }
}