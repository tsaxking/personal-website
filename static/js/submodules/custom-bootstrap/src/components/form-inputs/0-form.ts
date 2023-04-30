
// █▀ ▄▀▄ █▀▄ █▄ ▄█ ▄▀▀ 
// █▀ ▀▄▀ █▀▄ █ ▀ █ ▄█▀ 

/**
 * Description placeholder
 *
 * @typedef {CBS_FormOptions}
 */
type CBS_FormOptions = {
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
 * @typedef {CBS_InputList}
 */
type CBS_InputList = {
    [key: string]: CBS_Input|CBS_InputLabelContainer;
}


/**
 * Description placeholder
 *
 * @class CBS_Form
 * @typedef {CBS_Form}
 * @extends {CBS_Component}
 */
class CBS_Form extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
    }
    
    /**
     * Description placeholder
     *
     * @type {CBS_InputList}
     */
    inputs: CBS_InputList = {};

    /**
     * Creates an instance of CBS_Form.
     *
     * @constructor
     * @param {?CBS_FormOptions} [options]
     */
    constructor(options?: CBS_FormOptions) {
        super(options);

        this.el = document.createElement('form');

        this.subcomponents.submit = new CBS_Button({
            text: 'Submit',
            color: 'primary',
            attributes: {
                type: 'submit'
            }
        });

        this.append(this.subcomponents.submit);
    }

    /**
     * Description placeholder
     *
     * @returns {CBS_InputGroup}
     */
    addGroup(name: string) {
        const group = new CBS_InputGroup();
        this.append(group);

        group.on('input:add', () => {
            const input = group.components[group.components.length - 1];
            this.inputs[name] = input as CBS_Input|CBS_InputLabelContainer;
        });

        return group;
    }

    /**
     * Description placeholder
     *
     * @param {(CBS_Input|CBS_InputLabelContainer)} input
     */
    addInput(input: CBS_Input|CBS_InputLabelContainer, name?: string) {
        if (name) input.setAttribute('name', name);
        else name = input.getAttribute('name');
        if (!name) {
            return console.error('CBS_Form.addInput: Input must have a name attribute');
        }

        if (!(input instanceof CBS_InputLabelContainer)) {
            let container = new CBS_InputLabelContainer();
            container.label = new CBS_Label();
            container.label.text = name;
            container.input = input;
            input = container;
        }

        this.inputs[name] = input;
        this.insertBefore(this.components[this.components.length - 1], input);
    }

    /**
     * Description placeholder
     *
     * @param {string} type
     * @param {CBS_Options} options
     * @returns {CBS_Input}
     */
    createInput(name: string, type: string, options?: CBS_Options): CBS_Input {
        options = {
            ...options,
            attributes: {
                ...(options?.attributes || {}),
                name: name
            }
        };

        let i;

        switch (type) {
            case 'text':
                i = new CBS_TextInput(options);
                break;
            case 'password':
                i = new CBS_PasswordInput(options);
                break;
            case 'email':
                i = new CBS_EmailInput(options);
                break;
            case 'select':
                i = new CBS_SelectInput(options);
                break;
            case 'textarea':
                i = new CBS_TextareaInput(options);
                break;
            case 'checkbox':
                i = new CBS_Checkbox(options);
                break;
            case 'radio':
                i = new CBS_Radio(options);
                break;
            case 'file':
                i = new CBS_FileInput(options);
                break;
            case 'range':
                i = new CBS_RangeInput(options);
                break;
            case 'color':
                i = new CBS_ColorInput(options);
                break;
            case 'date':
                i = new CBS_DateInput(options);
                break;
            default:
                i = new CBS_Input(options);
                break;
        }

        this.addInput(i, name);

        return i;
    }





    get value() {
        return Object.entries(this.inputs).reduce((acc, [name, input]) => {
            if (input instanceof CBS_InputLabelContainer) {
                acc[name] = input.value;
            } else {
                acc[name] = input.value;
            }
            return acc;
        }, {} as {[key: string]: any});
    }

    get mirrorValue() {
        return Object.entries(this.inputs).reduce((acc, [name, input]) => {
            if (input instanceof CBS_InputLabelContainer) {
                acc[name] = input.mirrorValue;
            } else {
                acc[name] = input.mirrorValue;
            }
            return acc;
        }, {} as {[key: string]: any});
    }
}


CBS.addElement('form', CBS_Form);