
/**
 * Description placeholder
 *
 * @typedef {CBS_AnchorOptions}
 */
type CBS_AnchorOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

/**
 * Description placeholder
 *
 * @class CBS_Anchor
 * @typedef {CBS_Anchor}
 * @extends {CBS_Component}
 */
class CBS_Anchor extends CBS_Component {
    /**
     * Creates an instance of CBS_Anchor.
     *
     * @constructor
     * @param {?CBS_AnchorOptions} [options]
     */
    constructor(options?: CBS_AnchorOptions) {
        super(options);

        this.el = document.createElement('a');
    }
}




CBS.addElement('anchor', CBS_Anchor);