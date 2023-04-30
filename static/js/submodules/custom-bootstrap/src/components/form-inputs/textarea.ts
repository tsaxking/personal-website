




/**
 * Description placeholder
 *
 * @typedef {CBS_TextareaOptions}
 */
type CBS_TextareaOptions = {
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
 * @class CBS_TextAreaInput
 * @typedef {CBS_TextareaInput}
 * @extends {CBS_Input}
 */
class CBS_TextareaInput extends CBS_Input {
    /**
     * Creates an instance of CBS_TextAreaInput.
     *
     * @constructor
     * @param {?CBS_TextareaOptions} [options]
     */
    constructor(options?: CBS_TextareaOptions) {
        super(options);

        this.addClass('form-control');

        this.el = document.createElement('textarea');
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value(): string {
        return (this.el as HTMLTextAreaElement).value;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value: string) {
        (this.el as HTMLTextAreaElement).value = value;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    get columns(): number {
        return (this.el as HTMLTextAreaElement).cols;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set columns(value: number) {
        (this.el as HTMLTextAreaElement).cols = value;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    get rows(): number {
        return (this.el as HTMLTextAreaElement).rows;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set rows(value: number) {
        (this.el as HTMLTextAreaElement).rows = value;
    }



    /**
     * Description placeholder
     *
     * @readonly
     * @type {any}
     */
    get mirrorValue():any {
        if (this.getMirrorValue) return this.getMirrorValue(this.value);
        return this.mirrorValues[this.value];
    }
}


CBS.addElement('input-textarea', CBS_TextareaInput);