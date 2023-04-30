/**
 * Description placeholder
 *
 * @typedef {CBS_ParagraphOptions}
 */
type CBS_ParagraphOptions = {
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
 * @class CBS_Paragraph
 * @typedef {CBS_Component}
 * @extends {CBS_Component}
 */
class CBS_Paragraph extends CBS_Text {
    /**
     * Creates an instance of CBS_Paragraph.
     *
     * @constructor
     * @param {?CBS_ParagraphOptions} [options]
     */
    constructor(options?: CBS_ParagraphOptions) {
        super(options);

        this.el = document.createElement('p');
    }
}


CBS.addElement('paragraph', CBS_Component);