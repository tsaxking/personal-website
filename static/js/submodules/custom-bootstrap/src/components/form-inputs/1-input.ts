
/**
 * Description placeholder
 *
 * @typedef {CBS_InputOptions}
 */
type CBS_InputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    name?: string;
    label?: string;
    value?: string;
    group?: boolean;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
}

/**
 * Description placeholder
 *
 * @interface CBS_InputInterface
 * @typedef {CBS_InputInterface}
 */
interface CBS_InputInterface {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    value: string;
    /**
     * Description placeholder
     *
     * @type {HTMLElement}
     */
    el: HTMLElement;

    /**
     * Description placeholder
     *
     * @type {CBS_InputOptions}
     */
    options: CBS_InputOptions;

    /**
     * Description placeholder
     *
     * @type {?*}
     */
    mirrorValue?: any;
}

/**
 * Description placeholder
 *
 * @typedef {CBS_InputMirrorValueMap}
 */
type CBS_InputMirrorValueMap = {
    [key: string]: any;
}

/**
 * Description placeholder
 *
 * @class CBS_Input
 * @typedef {CBS_Input}
 * @extends {CBS_Element}
 * @implements {CBS_InputInterface}
 */
class CBS_Input extends CBS_Component implements CBS_InputInterface {
    /**
     * Description placeholder
     *
     * @type {CBS_InputMirrorValueMap}
     */
    mirrorValues: CBS_InputMirrorValueMap = {};
    /**
     * Description placeholder
     *
     * @type {?(value: any) => any}
     */
    getMirrorValue?: (value: any) => any;

    /**
     * Description placeholder
     *
     * @type {HTMLInputElement}
     */
    _el: HTMLInputElement = this.el as HTMLInputElement; // just to trick compiler

    /**
     * Creates an instance of CBS_Input.
     *
     * @constructor
     * @param {?CBS_InputOptions} [options]
     */
    constructor(options?: CBS_InputOptions) {
        super(options);

        this.el = document.createElement('input');
        this.addClass('form-control');
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get value(): any {
        return this._el.value;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any {
        return this.getMirrorValue ? this.getMirrorValue(this._el.value) : null;
    }

    /**
     * Description placeholder
     *
     * @param {(value: string) => any} fn
     * @returns {any) => void}
     */
    setMirrorValueGetter(fn: (value: string) => any) {
        this.getMirrorValue = fn;
    }


    /**
     * Description placeholder
     *
     * @param {string} name
     * @param {*} value
     */
    addMirrorValue(name: string, value: any): void {
        this.mirrorValues[name] = value;
    }
}


CBS.addElement('input', CBS_Input);