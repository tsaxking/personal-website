/**
 * Description placeholder
 *
 * @typedef {CBS_ColOptions}
 */
type CBS_ColOptions = {
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
 * @typedef {CBS_BreakpointMap}
 */
type CBS_BreakpointMap = {
    [key: string]: number;
}

/**
 * Description placeholder
 *
 * @class CBS_Col
 * @typedef {CBS_Col}
 * @extends {CBS_Element}
 */
class CBS_Col extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {{
            [key: string]: number;
        }}
     */
    breakpoints: {
        [key: string]: number;
    } = {};

    /**
     * Creates an instance of CBS_Col.
     *
     * @constructor
     * @param {?CBS_ColOptions} [options]
     */
    constructor(options?: CBS_ColOptions) {
        super(options);

        this.el = document.createElement('div');
    }

    /**
     * Description placeholder
     *
     * @param {string} breakpoint
     * @param {number} size
     */
    addBreakpoint(breakpoint: string, size: number) {
        this.addClass(`col-${breakpoint}-${size}`);
        this.breakpoints[breakpoint] = size;
    }

    /**
     * Description placeholder
     *
     * @param {string} breakpoint
     */
    removeBreakpoint(breakpoint: string) {
        this.removeClass(`col-${breakpoint}-${this.breakpoints[breakpoint]}`);
        delete this.breakpoints[breakpoint];
    }
}