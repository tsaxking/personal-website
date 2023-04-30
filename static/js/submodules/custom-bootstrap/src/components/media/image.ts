/**
 * Description placeholder
 *
 * @typedef {CBS_ImageOptions}
 */
type CBS_ImageOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    src?: string
}

/**
 * Description placeholder
 *
 * @class CBS_Image
 * @typedef {CBS_Image}
 * @extends {CBS_Component}
 */
class CBS_Image extends CBS_Component {
    /**
     * Creates an instance of CBS_Image.
     *
     * @constructor
     * @param {?CBS_ImageOptions} [options]
     */
    constructor(options?: CBS_ImageOptions) {
        super(options);

        this.el = document.createElement('img');
    }




    /**
     * Description placeholder
     *
     * @type {CBS_ImageOptions}
     */
    set options(options: CBS_ImageOptions) {
        super.options = options;

        (this.el as HTMLImageElement).src = options.src || '';
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set src(src: string) {
        this.options = {
            ...this.options,
            src
        };
    }
}


CBS.addElement('picture', CBS_Image);