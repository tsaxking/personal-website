/**
 * Description placeholder
 *
 * @class CBS_CardHeader
 * @typedef {CBS_CardHeader}
 * @extends {CBS_Element}
 */
class CBS_CardHeader extends CBS_Element {
    /**
     * Creates an instance of CBS_CardHeader.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this._el = document.createElement('div');
        this._el.classList.add('card-header');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_CardBody
 * @typedef {CBS_CardBody}
 * @extends {CBS_Element}
 */
class CBS_CardBody extends CBS_Element {
    /**
     * Creates an instance of CBS_CardBody.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this._el = document.createElement('div');
        this._el.classList.add('card-body');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_CardFooter
 * @typedef {CBS_CardFooter}
 * @extends {CBS_Element}
 */
class CBS_CardFooter extends CBS_Element {
    /**
     * Creates an instance of CBS_CardFooter.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this._el = document.createElement('div');
        this._el.classList.add('card-footer');
    }
}

/**
 * Description placeholder
 *
 * @typedef {CBS_CardOptions}
 */
type CBS_CardOptions = {
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
 * @class CBS_Card
 * @typedef {CBS_Card}
 * @extends {CBS_Component}
 */
class CBS_Card extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        header: new CBS_CardHeader(),
        body: new CBS_CardBody(),
        footer: new CBS_CardFooter()
    }

    /**
     * Creates an instance of CBS_Card.
     *
     * @constructor
     * @param {?CBS_CardOptions} [options]
     */
    constructor(options?: CBS_CardOptions) {
        super(options);

        this._el = document.createElement('div');
        this._el.classList.add('card');

        this.append(
            this.subcomponents.header,
            this.subcomponents.body,
            this.subcomponents.footer
        );
    }
}



CBS.addElement('card', CBS_Card);
