/**
 * Description placeholder
 *
 * @typedef {CBS_ModalOptions}
 */
type CBS_ModalOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
    buttons?: CBS_Button[];
}



/**
 * Description placeholder
 *
 * @class CBS_ModalTitle
 * @typedef {CBS_ModalHeader}
 * @extends {CBS_Element}
 */
class CBS_ModalHeader extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        title: new CBS_H5()
    }

    /**
     * Creates an instance of CBS_ModalTitle.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this.addClass('modal-header');
        this.prepend(
            this.subcomponents.title
        );
    }

    get text() {
        return (this.subcomponents.title as CBS_Text).text;
    }

    set text(text: string|null) {
        (this.subcomponents.title as CBS_Text).text = text || '';
    }
}


/**
 * Description placeholder
 *
 * @class CBS_ModalBody
 * @typedef {CBS_ModalBody}
 * @extends {CBS_Element}
 */
class CBS_ModalBody extends CBS_Element {
    /**
     * Creates an instance of CBS_ModalBody.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this.addClass('modal-body');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_ModalFooter
 * @typedef {CBS_ModalFooter}
 * @extends {CBS_Element}
 */
class CBS_ModalFooter extends CBS_Element {
    /**
     * Creates an instance of CBS_ModalFooter.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this.addClass('modal-footer');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_ModalDialog
 * @typedef {CBS_ModalDialog}
 * @extends {CBS_Component}
 */
class CBS_ModalDialog extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;


    /**
     * Creates an instance of CBS_ModalDialog.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);


        this.el = document.createElement('div');
        this.addClass('modal-dialog');
        this.setAttribute('role', 'document');


        const content = new CBS_ModalContent();

        this.subcomponents = {
            content: content,
            title: content.subcomponents.header,
            body: content.subcomponents.body,
            footer: content.subcomponents.footer
        }

        content.append(
            this.subcomponents.title,
            this.subcomponents.body,
            this.subcomponents.footer
        )


        this.append(
            content
        );

        this.subcomponents.title.append(CBS_Button.fromTemplate('modal-close'));
    }
}



class CBS_ModalContent extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        header: new CBS_ModalHeader(),
        body: new CBS_ModalBody(),
        footer: new CBS_ModalFooter()
    }

    constructor(options?: CBS_Options) {
        super(options);

        this.addClass('modal-content');
    }
}



/**
 * Description placeholder
 *
 * @class CBS_Modal
 * @typedef {CBS_Modal}
 * @extends {CBS_Component}
 */
class CBS_Modal extends CBS_Component {
    /**
     * Creates an instance of CBS_Modal.
     *
     * @constructor
     * @param {?CBS_ModalOptions} [options]
     */
    constructor(options?: CBS_ModalOptions) {
        super(options);

        this.addClass('modal','fade');
        this.setAttribute('tabindex', '-1');
        this.setAttribute('role', 'dialog');
        this.setAttribute('aria-hidden', 'true');
        this.setAttribute('aria-labelledby', 'modal-title');
        
        const dialog = new CBS_ModalDialog();

        this.subcomponents = {
            dialog,
            body: dialog.subcomponents.body,
            title: dialog.subcomponents.title,
            footer: dialog.subcomponents.footer
        }

        this.append(
            this.subcomponents.dialog
        );
    }

    get title() {
        return ((this.subcomponents.title as CBS_ModalHeader).subcomponents.title as CBS_Text).text;
    }

    set title(title: string) {
        ((this.subcomponents.title as CBS_ModalHeader).subcomponents.title as CBS_Text).text = title;
    }

    get body() {
        return this.subcomponents.body;
    }

    set body(body: CBS_Element) {
        this.subcomponents.body = body;
    }

    get footer() {
        return this.subcomponents.footer;
    }

    set footer(footer: CBS_Element) {
        this.subcomponents.footer = footer;
    }


    /**
     * Description placeholder
     *
     * @type {CBS_ModalOptions}
     */
    set options(options: CBS_ModalOptions) {
        super.options = options;

        if (options.buttons) {
            (this.subcomponents.dialog as CBS_ModalDialog).subcomponents.footer.append(
                ...options.buttons
            );
        }
    }

    /**
     * Description placeholder
     */
    show() {
        $(this._el).modal('show');
    }

    /**
     * Description placeholder
     */
    hide() {
        $(this._el).modal('hide');
    }
}


CBS.addElement('modal', CBS_Modal);