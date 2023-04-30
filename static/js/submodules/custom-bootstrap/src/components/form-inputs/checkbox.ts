/**
 * Description placeholder
 *
 * @typedef {CBS_CheckboxOptions}
 */
type CBS_CheckboxOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    label?: string;
    mirrorValue?: any;
}


/**
 * Description placeholder
 *
 * @class CBS_CheckboxLabel
 * @typedef {CBS_CheckboxLabel}
 * @extends {CBS_Element}
 */
class CBS_CheckboxLabel extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    #text: string = '';

    /**
     * Creates an instance of CBS_CheckboxLabel.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options?: CBS_CheckboxOptions) {
        super(options);

        this.el = document.createElement('label');
        this.addClass('form-check-label');
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text: string) {
        this.#text = text;
        this.el.textContent = text;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text() {
        return this.#text;
    }
};

/**
 * Description placeholder
 *
 * @class CBS_CheckboxInput
 * @typedef {CBS_CheckboxInput}
 * @extends {CBS_Input}
 */
class CBS_CheckboxInput extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {*}
     */
    #mirrorValue: any;

    /**
     * Creates an instance of CBS_CheckboxInput.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options?: CBS_CheckboxOptions) {
        super(options);

        this.el = document.createElement('input');

        this.addClass('form-check-input');
        this.setAttribute('type', 'checkbox');

        if (options?.mirrorValue) {
            this.#mirrorValue = options.mirrorValue;
        }
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get value(): boolean {
        return (this.el as HTMLInputElement).checked;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        if (this.getMirrorValue) return this.getMirrorValue(this.value);
        return this.#mirrorValue;
    }

    /**
     * Description placeholder
     */
    select() {
        (this.el as HTMLInputElement).indeterminate = false;
        (this.el as HTMLInputElement).checked = true;
    }

    /**
     * Description placeholder
     */
    deselect() {
        (this.el as HTMLInputElement).indeterminate = false;
        (this.el as HTMLInputElement).checked = false;
    }

    /**
     * Description placeholder
     */
    toggle() {
        (this.el as HTMLInputElement).indeterminate = false;
        (this.el as HTMLInputElement).checked = !(this.el as HTMLInputElement).checked;
    }

    /**
     * Description placeholder
     */
    disable() {
        (this.el as HTMLInputElement).disabled = true;
    }

    /**
     * Description placeholder
     */
    enable() {
        (this.el as HTMLInputElement).disabled = false;
    }

    /**
     * Description placeholder
     */
    semiCheck() {
        this.deselect();
        (this.el as HTMLInputElement).indeterminate = true;
    }
}



/**
 * Description placeholder
 *
 * @class CBS_Checkbox
 * @typedef {CBS_Checkbox}
 * @extends {CBS_Input}
 */
class CBS_Checkbox extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        input: new CBS_CheckboxInput(),
        label: new CBS_CheckboxLabel()
    }

    /**
     * Creates an instance of CBS_Checkbox.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options?: CBS_CheckboxOptions) {
        super(options);

        if (options?.label) this.text = options.label;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text: string) {
        (this.subcomponents.label as CBS_CheckboxLabel).text = text;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text() {
        return (this.subcomponents.label as CBS_CheckboxLabel).text;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get value(): boolean {
        return (this.subcomponents.input as CBS_CheckboxInput).value;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        const input = this.subcomponents.input as CBS_CheckboxInput;
        return this.value ? input.mirrorValue : undefined;
    }

    /**
     * Description placeholder
     */
    select() {
        (this.subcomponents.input as CBS_CheckboxInput).select();
    }

    /**
     * Description placeholder
     */
    deselect() {
        (this.subcomponents.input as CBS_CheckboxInput).deselect();
    }

    /**
     * Description placeholder
     */
    toggle() {
        (this.subcomponents.input as CBS_CheckboxInput).toggle();
    }

    /**
     * Description placeholder
     */
    disable() {
        (this.subcomponents.input as CBS_CheckboxInput).disable();
    }

    /**
     * Description placeholder
     */
    enable() {
        (this.subcomponents.input as CBS_CheckboxInput).enable();
    }

    /**
     * Description placeholder
     */
    semiCheck() {
        (this.subcomponents.input as CBS_CheckboxInput).semiCheck();
    }
};



/**
 * Description placeholder
 *
 * @class CBS_CheckboxGroup
 * @typedef {CBS_CheckboxGroup}
 * @extends {CBS_Component}
 */
class CBS_CheckboxGroup extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_Checkbox[]}
     */
    checkboxes: CBS_Checkbox[] = [];

    /**
     * Creates an instance of CBS_CheckboxGroup.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options?: CBS_CheckboxOptions) {
        super(options);

        this.el = document.createElement('div');
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     * @param {?CBS_CheckboxOptions} [options]
     * @returns {CBS_Checkbox}
     */
    addCheckbox(value: string, options?: CBS_CheckboxOptions): CBS_Checkbox {
        const c = new CBS_Checkbox(options);
        c.text = value;

        this.append(c);
        this.checkboxes.push(c);

        return c;
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    removeCheckbox(value: string): boolean {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return false;

        this.removeElement(c);
        this.checkboxes.splice(this.checkboxes.indexOf(c), 1);
        return true;
    }

    /**
     * Description placeholder
     */
    clearCheckboxes() {
        this.checkboxes.forEach(checkbox => this.removeElement(checkbox));
        this.checkboxes = [];
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get value(): any {
        return this.checkboxes.reduce((acc, check) => {
            if (check.value) acc[check.text] = true;
            return acc;
        }, {} as {[key: string]: boolean});
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any {
        if (this.getMirrorValue) return this.getMirrorValue(this.value);
        return this.checkboxes.reduce((acc, check) => {
            if (check.value) acc[check.text] = check.mirrorValue;
            return acc;
        }, {} as {[key: string]: any})
    }










    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    select(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        c.select();
        return true;
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    isSelected(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        return c.value;
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    deselect(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        c.deselect();
        return true;
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    toggle(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        c.toggle();
        return true;
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    disable(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        c.disable();
        return true;
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    semiCheck(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        c.semiCheck();
        return true;
    }

    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    enable(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        c.enable();
        return true;
    }









    // Selecting

    /**
     * Description placeholder
     */
    selectAll() {
        this.checkboxes.forEach(checkbox => checkbox.select());
    }

    /**
     * Description placeholder
     */
    deselectAll() {
        this.checkboxes.forEach(checkbox => checkbox.deselect());
    }

    /**
     * Description placeholder
     */
    toggleAll() {
        this.checkboxes.forEach(checkbox => checkbox.toggle());
    }

    /**
     * Description placeholder
     */
    disableAll() {
        this.checkboxes.forEach(checkbox => checkbox.disable());
    }

    /**
     * Description placeholder
     */
    enableAll() {
        this.checkboxes.forEach(checkbox => checkbox.enable());
    }

    /**
     * Description placeholder
     */
    semiCheckAll() {
        this.checkboxes.forEach(checkbox => checkbox.semiCheck());
    }
};


CBS.addElement('input-checkbox', CBS_CheckboxInput);