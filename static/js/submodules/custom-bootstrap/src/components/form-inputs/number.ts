





/**
 * Description placeholder
 *
 * @typedef {CBS_NumberInputOptions}
 */
type CBS_NumberInputOptions = {
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
 * @class CBS_NumberInput
 * @typedef {CBS_NumberInput}
 * @extends {CBS_Input}
 */
class CBS_NumberInput extends CBS_Input {
    /**
     * Creates an instance of CBS_NumberInput.
     *
     * @constructor
     * @param {?CBS_NumberInputOptions} [options]
     */
    constructor(options?: CBS_NumberInputOptions) {
        super(options);

        this.addClass('form-control');
        this.setAttribute('type', 'number');
    }

    get value(): number {
        return +(this.el as HTMLInputElement).value;
    }

    set value(value: number) {
        (this.el as HTMLInputElement).value = value.toString();
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


CBS.addElement('input-number', CBS_NumberInput);