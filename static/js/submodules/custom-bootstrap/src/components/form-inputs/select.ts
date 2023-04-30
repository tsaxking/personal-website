
/**
 * Description placeholder
 *
 * @typedef {CBS_SelectOptions}
 */
type CBS_SelectOptions = {
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
 * @class CBS_SelectOption
 * @typedef {CBS_SelectOption}
 * @extends {CBS_Element}
 */
class CBS_SelectOption extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    value: string;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    text: string;
    /**
     * Description placeholder
     *
     * @type {*}
     */
    mirrorValue: any;

    /**
     * Creates an instance of CBS_SelectOption.
     *
     * @constructor
     * @param {string} text
     * @param {string} value
     * @param {*} [mirrorValue=null]
     */
    constructor(text: string, value: string, mirrorValue: any = null) {
        super();

        this.value = value;
        this.text = text;

        const el = document.createElement('option');
        el.value = value;
        el.textContent = text;

        this.el = el;
        this.mirrorValue = mirrorValue;
    }

    /**
     * Description placeholder
     */
    select() {
        this.setAttribute('selected', '');
    }

    /**
     * Description placeholder
     */
    deselect() {
        this.removeAttribute('selected');
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {string}
     */
    get selected() {
        return this.getAttribute('selected');
    }

    /**
     * Description placeholder
     */
    disable() {
        this.setAttribute('disabled', '');
    }

    /**
     * Description placeholder
     */
    enable() {
        this.removeAttribute('disabled');
    }
}



/**
 * Description placeholder
 *
 * @class CBS_SelectInput
 * @typedef {CBS_SelectInput}
 * @extends {CBS_Input}
 */
class CBS_SelectInput extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_SelectOption[]}
     */
    selectOptions: CBS_SelectOption[] = [];

    /**
     * Creates an instance of CBS_SelectInput.
     *
     * @constructor
     * @param {?CBS_SelectOptions} [options]
     */
    constructor(options?: CBS_SelectOptions) {
        super(options);

        this.addClass('form-select');
        this.el = document.createElement('select');
    }

    /**
     * Description placeholder
     *
     * @param {string} text
     * @param {string} value
     * @param {*} [mirrorValue=null]
     * @returns {(CBS_SelectOption|null)}
     */
    addOption(text: string, value: string, mirrorValue: any = null): CBS_SelectOption|null {
        const has = this.selectOptions.find(option => option.value === value);
        if (has) {
            return null;
        }

        const option = new CBS_SelectOption(text, value, mirrorValue);
        this.selectOptions.push(option);
        this.append(option);

        return option;
    }

    /**
     * Description placeholder
     *
     * @param {(string|CBS_SelectOption)} valueOrOption
     */
    removeOption(valueOrOption: string|CBS_SelectOption) {
        if (typeof valueOrOption === 'string') {
            const option = this.selectOptions.find(option => option.value === valueOrOption);
            if (option) {
                this.selectOptions.splice(this.selectOptions.indexOf(option), 1);
                this.removeElement(option);
            }
        } else {
            this.selectOptions.splice(this.selectOptions.indexOf(valueOrOption), 1);
            this.removeElement(valueOrOption);
        }
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     */
    select(value: string) {
        this.selectOptions.forEach(option => {
            if (option.value === value) {
                option.select();
            } else {
                option.deselect();
            }
        });
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {string}
     */
    get value():string {
        return (this.el as HTMLInputElement).value;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue():any {
        const option = this.selectOptions.find(option => option.value === this.value);
        if (option) {
            return option.mirrorValue;
        }

        return null;
    }
}



CBS.addElement('input-select', CBS_SelectInput);