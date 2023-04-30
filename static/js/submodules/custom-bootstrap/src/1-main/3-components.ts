

/**
 * For Subcomponents
 *
 * @typedef {CBS_SubComponentContainer}
 */
type CBS_SubComponentContainer = {
    [key: string]: CBS_Element;
}





/**
 * Layer between larger components and their respective elements
 * I don't know if this is necessary, but it's here for now
 * This just makes it easier to differentiate if a class is a component or an element (has mulitple elements or is just one)
 *
 * @class CBS_Component
 * @typedef {CBS_Component}
 * @extends {CBS_Element}
 */
class CBS_Component extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {};

    /**
     * Creates an instance of CBS_Component.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        // Object.values(this.subcomponents).forEach((value) => {
        //     this.append(value);
        // });
    }
}