/**
 * Description placeholder
 *
 * @typedef {CBS_ContainerOptions}
 */
type CBS_ContainerOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    fluid?: boolean;
}


/**
 * Description placeholder
 *
 * @class CBS_Container
 * @typedef {CBS_Container}
 * @extends {CBS_Element}
 */
class CBS_Container extends CBS_Element {
    /**
     * Creates an instance of CBS_Container.
     *
     * @constructor
     * @param {?CBS_ContainerOptions} [options]
     */
    constructor(options?: CBS_ContainerOptions) {
        super(options);

        this.el = document.createElement('div');
        if (this.options.fluid) {
            this.addClass('container-fluid');
        } else {
            this.addClass('container');
        }
    }

    /**
     * Description placeholder
     *
     * @type {CBS_ContainerOptions}
     */
    set options(options: CBS_ContainerOptions) {
        super.options = options;
        this.removeClass('container-fluid', 'container');

        if (this.options.fluid) {
            this.addClass('container-fluid');
        } else {
            this.addClass('container');
        }
    }

    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    set fluid(fluid: boolean) {
        this.options = {
            ...this.options,
            fluid
        }
    }

    /**
     * Description placeholder
     *
     * @returns {*}
     */
    addRow() {
        const row = new CBS_Row();

        this.append(row);

        return row;
    }
}