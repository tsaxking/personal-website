(() => {
    // test for jQuery and popper
    try {
        $('hello-world');
    } catch {
        console.error('jQuery is not loaded!');
    }

    if (!$('.any').toast) {
        console.error('Popper is not loaded!');
    }
})();


// Generic types
/**
 * Generic types for the library
 *
 * @typedef {CBS_NodeContainer}
 */
type CBS_NodeContainer = {
    [key: string]: CBS_Node;
}

// Used for subcomponents
/**
 * Used for subcomponents
 *
 * @typedef {CBS_ElementContainer}
 */
type CBS_ElementContainer = {
    [key: string]: CBS_Element;
}

// Used for parameters
/**
 * Used for parameters
 *
 * @typedef {CBS_ParameterValue}
 */
type CBS_ParameterValue = string|number|boolean|HTMLElement|undefined|Element|Node;

/**
 * Used for parameters
 *
 * @typedef {CBS_Parameters}
 */
type CBS_Parameters = {
    [key: string]: CBS_ParameterValue;
}





// // Is not currently used, but may be useful in the future?
// /**
//  * Description placeholder
//  *
//  * @interface CBS_ElementNameMap
//  * @typedef {CBS_ElementNameMap}
//  */
// interface CBS_ElementNameMap {
//     /**
//      * Description placeholder
//      *
//      * @type {CBS_AudioCard}
//      */
//     'audio': CBS_AudioCard;
//     /**
//      * Description placeholder
//      *
//      * @type {CBS_Video}
//      */
//     'video': CBS_Video;

//     /**
//      * Description placeholder
//      *
//      * @type {CBS_Modal}
//      */
//     'modal': CBS_Modal;

//     /**
//      * Description placeholder
//      *
//      * @type {CBS_Card}
//      */
//     'card': CBS_Card;
//     /**
//      * Description placeholder
//      *
//      * @type {CBS_Form}
//      */
//     'form': CBS_Form;
//     /**
//      * Description placeholder
//      *
//      * @type {CBS_List}
//      */
//     'list': CBS_List;
//     /**
//      * Description placeholder
//      *
//      * @type {CBS_Progress}
//      */
//     'progress-bar': CBS_Progress;

//     /**
//      * Description placeholder
//      *
//      * @type {CBS_CheckboxInput}
//      */
//     'checkbox': CBS_CheckboxInput;
//     /**
//      * Description placeholder
//      *
//      * @type {CBS_RadioInput}
//      */
//     'radio': CBS_RadioInput;
//     /**
//      * Description placeholder
//      *
//      * @type {CBS_Input}
//      */
//     'input': CBS_Input;
//     /**
//      * Description placeholder
//      *
//      * @type {CBS_TextareaInput}
//      */
//     'textarea': CBS_TextareaInput;
//     /**
//      * Description placeholder
//      *
//      * @type {CBS_Button}
//      */
//     'button': CBS_Button;
//     /**
//      * Description placeholder
//      *
//      * @type {CBS_SelectInput}
//      */
//     'select': CBS_SelectInput;

// }


// TODO: Add all the elements to this interface
// /**
//  * Description placeholder
//  *
//  * @interface CBS
//  * @typedef {CBS}
//  */
// interface CBS {
//     /**
//      * Description placeholder
//      *
//      * @template K
//      * @param {K} tagName
//      * @returns {CBS_ElementNameMap[K]}
//      */
//     createElement<K extends keyof CBS_ElementNameMap>(tagName: K): CBS_ElementNameMap[K];
// }

/**
 * Selector object returned by CustomBootstrap.parseSelector()
 *
 * @typedef {Selector}
 */
type Selector = {
    tag: string;
    id?: string;
    classes?: string[];
    attributes?: {
        [key: string]: string;
    };
}

/**
 * Not currently used, but it's for someMethod() to return the constructor, not the element
 *
 * @typedef {CBS_ElementConstructorMap}
 */
type CBS_ElementConstructorMap = {
    [key: string]: new (options?: CBS_Options) => CBS_Element;
}

/**
 * Container for all of the CustomBootstrap library
 *
 * @class CustomBootstrap
 * @typedef {CustomBootstrap}
 */
class CustomBootstrap {
    /**
     * Parses a string into a selector object
     *
     * @static
     * @param {string} selector
     * @returns {Selector}
     */
    static parseSelector(selector: string): Selector {
        selector = selector.trim();

        const getTag = (selector: string): string => {
            // get first word (before ., #, or [])
            const tag = selector.match(/^[^.#[]+/);
            return tag ? tag[0] : '';
        };

        const getId = (selector: string): string => {
            // get id (after #, and before . or [ or end of string)
            const id = selector.match(/#[^.#[\]]+/);
            return id ? id[0].substring(1) : '';
        }

        const getClasses = (selector: string): string[] => {
            // get classes (after ., and before # or [ or end of string)
            const classes = selector.match(/\.[^.#[\]]+/g);
            return classes ? classes.map(c => c.substring(1)) : [];
        }

        const getAttributes = (selector: string): { [key: string]: string } => {
            // get attributes (after [, and before ] or end of string)
            const attributes = selector.match(/\[[^\]]+\]/g);
            if (!attributes) return {};

            const result: { [key: string]: string } = {};
            attributes.forEach(a => {
                const parts = a.substring(1, a.length - 1).split('=');
                result[parts[0]] = parts[1];
            });
            return result;
        };

        return {
            tag: getTag(selector),
            id: getId(selector),
            classes: getClasses(selector),
            attributes: getAttributes(selector)
        };
    }





    // all of these are added when the constructor is created, so I commented them out
    // However, I may want to change this and I don't want to rewrite all of this
    /**
     * Elements contained in the CustomBootstrap library
     *
     * @type {CBS_ElementConstructorMap}
     */
    #elements: CBS_ElementConstructorMap = {
        // // media
        // 'audio': CBS_Audio,
        // 'video': CBS_Video,
        // 'picture': CBS_Picture,

        // // modals
        // 'modal-alert': CBS_ModalAlert,
        // 'modal-confirm': CBS_ModalConfirm,
        // 'modal-select': CBS_ModalSelect,
        // 'modal': CBS_Modal,

        // // card
        // 'card': CBS_Card,

        // // form
        // 'form': CBS_Form,
        // 'input': CBS_Input,
        // 'input-textarea': CBS_TextAreaInput,
        // 'input-select': CBS_SelectInput,
        // 'input-radio': CBS_RadioInput,
        // 'input-checkbox': CBS_CheckboxInput,
        // 'input-email': CBS_EmailInput,
        // 'input-password': CBS_PasswordInput,
        // 'input-number': CBS_NumberInput,
        // 'input-range': CBS_RangeInput,
        // 'input-date': CBS_DateInput,
        // 'input-color': CBS_ColorInput,
        // 'input-file': CBS_FileInput,
        // 'input-text': CBS_TextInput,
        
        // // list
        // 'list': CBS_List,
        // 'list-item': CBS_ListItem,

        // // text
        // 'a': CBS_Anchor,
        // 'p': CBS_Paragraph,
        // 'h': CBS_Heading,
        // 'h1': CBS_H1,
        // 'h2': CBS_H2,
        // 'h3': CBS_H3,
        // 'h4': CBS_H4,
        // 'h5': CBS_H5,
        // 'h6': CBS_H6,

        // // progress
        // 'progress-bar': CBS_ProgressBar,

        // // button
        // 'button': CBS_Button,

        // // table
        // 'table': CBS_Table,
    };

    /**
     * Adds an element to the CustomBootstrap library
     *
     * @param {string} name
     * @param {new (options?: CBS_Options) => CBS_Element} element
     * @returns {(CBS_Element) => void}
     */
    addElement(name: string, element: new (options?: CBS_Options) => CBS_Element) {
        this.#elements[name] = element;
    }


    /**
     * Creates an element from a selector string
     *
     * @param {string} selector
     * @param {?CBS_Options} [options]
     * @returns {CBS_Element}
     */
    createElement(selector: string, options?: CBS_Options): CBS_Element {
        const { tag, id, classes, attributes } = CustomBootstrap.parseSelector(selector);

        options = {
            ...(options || {}),
            id,
            classes,
            attributes
        }

        const element = this.#elements[tag];

        if (!element) {
            throw new Error(`Element ${tag} does not exist`);
        }

        return new element(options);
    }

    /**
     * Creates an element from an html string
     *
     * @param {string} text
     * @returns {(ChildNode|null)}
     */
    createElementFromText(text: string): ChildNode|null {
        const div = document.createElement('div');
        div.innerHTML = text;
        return div.firstChild;
    }



    /**
     * Replacement for alert() that uses modals
     * Returns a promise that resolves when the modal is closed
     *
     * @async
     * @param {*} message
     * @returns {Promise<void>}
     */
    async alert(message: any): Promise<void> {
        return new Promise((res, rej) => {
            const ok = new CBS_Button({
                color: 'primary'
            });

            ok.content = 'Okay';

            const modal = new CBS_Modal({
                buttons: [
                    ok
                ]
            });

            modal.title = 'Alert';

            modal.subcomponents.body.append(message);

            modal.subcomponents.footer.append(ok);

            ok.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res();
            });

            modal.on('hidden.bs.modal', () => res());
            modal.on('destroyed', () => res());
            modal.show();
        });
    }

    /**
     * Replacement for confirm() that uses modals
     * Returns a promise that resolves to true if the user clicks Okay, false if the user clicks Cancel
     *
     * @async
     * @param {*} message
     * @returns {Promise<boolean>}
     */
    async confirm(message: any): Promise<boolean> {
        return new Promise((res, rej) => {
            const yes = new CBS_Button({
                color: 'primary'
            });

            yes.content = 'Okay';

            const no = new CBS_Button({
                color: 'secondary'
            });

            no.content = 'Cancel';

            const modal = new CBS_Modal({
                buttons: [
                    yes,
                    no
                ]
            });

            modal.title = 'Confirm';

            modal.subcomponents.body.append(message);

            yes.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(true);
            });

            no.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(false);
            });

            modal.footer.append(yes, no);

            modal.on('hidden.bs.modal', () => res(false));
            modal.on('destroyed', () => res(false));
            modal.show();
        });
    }

    /**
     * Returns a promise that resolves to the value of the form input if the user clicks Submit, null if the user clicks Cancel
     *
     * @async
     * @param {CBS_Form} form
     * @returns {Promise<any>}
     */
    async modalForm(form: CBS_Form): Promise<any> {
        return new Promise((res, rej) => {
            const submit = new CBS_Button({
                color: 'primary'
            });

            submit.content = 'Submit';

            const modal = new CBS_Modal({
                buttons: [
                    submit
                ]
            });

            modal.title = 'Fill out form';

            modal.subcomponents.body.append(form);
            modal.subcomponents.footer.append(submit);

            submit.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(form.value);
            });

            form.on('submit', (e) => {
                e.preventDefault();
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(form.value);
            });

            modal.on('hidden.bs.modal', () => res(null));
            modal.on('destroyed', () => res(null));
            modal.show();
        });
    }


    /**
     * Replacement for prompt() that uses modals
     * Returns a promise that resolves to the value of the input if the user clicks Okay, null if the user clicks Cancel
     *
     * @async
     * @param {?*} [message]
     * @returns {Promise<string|null>}
     */
    async prompt(message?: any): Promise<string|null> {
        return new Promise((res, rej) => {
            const ok = new CBS_Button({
                color: 'primary'
            });

            ok.content = 'Okay';

            const modal = new CBS_Modal({
                buttons: [
                    ok
                ]
            });

            modal.title = 'Prompt';
    
            const input = new CBS_TextInput();

            modal.subcomponents.body.append(message);
            modal.subcomponents.body.append(input);

            input.on('keydown', (e) => {
                if ((e as KeyboardEvent).key === 'Enter') {
                    ok.el.click();
                }
            })

            ok.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(input.value);
            });

            modal.subcomponents.footer.append(ok);

            modal.on('hidden.bs.modal', () => res(null));
            modal.on('destroyed', () => res(null));
            modal.show();
        });
    }
}


/**
 * The global CustomBootstrap instance
 *
 * @type {CustomBootstrap}
 */
const CBS = new CustomBootstrap();