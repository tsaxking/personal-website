/**
 * Description placeholder
 *
 * @typedef {CBS_LabelOptions}
 */
type CBS_LabelOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    name?: string;
}

/**
 * Description placeholder
 *
 * @class CBS_Label
 * @typedef {CBS_Label}
 * @extends {CBS_Element}
 */
class CBS_Label extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    #text: string = '';
    
    /**
     * Creates an instance of CBS_Label.
     *
     * @constructor
     * @param {?CBS_InputOptions} [options]
     */
    constructor(options?: CBS_InputOptions) {
        super(options);

        this.el = document.createElement('label');
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text: string) {
        this.#text = text;
        this.el.innerHTML = text;
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


CBS.addElement('input', CBS_Input);