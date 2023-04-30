/**
 * Description placeholder
 *
 * @typedef {CBS_DateInputOptions}
 */
type CBS_DateInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
};

/**
 * Description placeholder
 *
 * @class CBS_DateInput
 * @typedef {CBS_DateInput}
 * @extends {CBS_Input}
 */
class CBS_DateInput extends CBS_Input {
    /**
     * Creates an instance of CBS_DateInput.
     *
     * @constructor
     * @param {?CBS_DateInputOptions} [options]
     */
    constructor(options?: CBS_DateInputOptions) {
        super(options);

        this.addClass('form-control');
        this.setAttribute('type', 'date');
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value(): string {
        return (this.el as HTMLInputElement).value;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value: string) {
        (this.el as HTMLInputElement).value = value;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {Date}
     */
    get mirrorValue(): Date {
        if (this.getMirrorValue) return this.getMirrorValue(this.value);
        return new Date(this.value);
    }
}

CBS.addElement('input-date', CBS_DateInput);