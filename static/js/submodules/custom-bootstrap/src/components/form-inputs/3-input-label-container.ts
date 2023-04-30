/**
 * Description placeholder
 *
 * @typedef {CBS_InputLabelContainerOptions}
 */
type CBS_InputLabelContainerOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    type?: string;
}


/**
 * Description placeholder
 *
 * @class CBS_InputLabelContainer
 * @typedef {CBS_InputLabelContainer}
 * @extends {CBS_Component}
 * @implements {CBS_InputInterface}
 */
class CBS_InputLabelContainer extends CBS_Input implements CBS_InputInterface {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        input: new CBS_Input(),
        label: new CBS_Label(),
        text: new CBS_FormText()
    } 

    /**
     * Creates an instance of CBS_InputLabelContainer.
     *
     * @constructor
     * @param {CBS_Input} input
     * @param {CBS_Label} label
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('div');
    }

    /**
     * Description placeholder
     *
     * @type {CBS_Input}
     */
    set input(input: CBS_Input) {
        this.subcomponents.input = input;
        this.options = this.options || {};
        this.append(input);
    }

    get input() {
        return (this.subcomponents.input as CBS_Input);
    }

    /**
     * Description placeholder
     *
     * @type {*}
     */
    set label(label: CBS_Label) {
        this.subcomponents.label = label;
        this.options = this.options || {};
        this.append(label);
    }

    get label() {
        return (this.subcomponents.label as CBS_Label);
    }


    /**
     * Description placeholder
     *
     * @type {CBS_InputLabelContainerOptions}
     */
    set options(options: CBS_InputLabelContainerOptions) {
        super.options = options;

        let {
            type
        } = options;

        let {
            input, 
            label
        } = this.subcomponents;

        if (!input) input = new CBS_Input();
        if (!label) label = new CBS_Label();

        this.clearElements();

        // inline
        // label (default)
        // floating

        if (!type) type = 'label';

        switch (type) {
            case 'label':
                (() => {
                    this.marginB = 3;
                    this.append(
                        label,
                        input
                    );
                })();
                break;
            case 'inline': 
                (() => {
                    const row = new CBS_Row({
                        classes: [
                            'g-3',
                            'align-items-center'
                        ]
                    });

                    const labelCol = row.addCol();
                    labelCol.addClass('col-auto');
                    labelCol.append(label);

                    const inputCol = row.addCol();
                    inputCol.addClass('col-auto');
                    inputCol.append(input);

                    this.append(row);
                })();
                break;
            case 'floating':
                (() => {
                    this.addClass('form-floating');
                    this.append(
                        input,
                        label
                    );
                })();
                break;
        }
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get value() {
        return (this.subcomponents.input as CBS_Input).value;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        return (this.subcomponents.input as CBS_Input).mirrorValue;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get formText() {
        return (this.subcomponents.text as CBS_FormText).content;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set formText(content: string) {
        (this.subcomponents.text as CBS_FormText).content = content;
    }
}