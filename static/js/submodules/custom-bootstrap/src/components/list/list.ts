/**
 * Options for the CBS_List component
 *
 * @typedef {CBS_ListOptions}
 */
type CBS_ListOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    ordered?: boolean;
}


/**
 * <ul> or <ol> element as a component
 *
 * @class CBS_List
 * @typedef {CBS_List}
 * @extends {CBS_Component}
 */
class CBS_List extends CBS_Component {
    /**
     * Creates an instance of CBS_List
     *
     * @constructor
     * @param {?CBS_ListOptions} [options]
     */
    constructor(options?: CBS_ListOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'list-group'
            ],
            attributes: {
                ...options?.attributes,
                type: 'list'
            }
        };

        if (this.options.ordered) {
            this.el = document.createElement('ol');
        } else {
            this.el = document.createElement('ul');
        }
    }

    /**
     * Sets the options for the CBS_List component
     * Calls the super method and then sets the element to either an <ol> or <ul> element
     *
     * @type {CBS_ListOptions}
     */
    set options(options: CBS_ListOptions) {
        super.options = options;

        if (this.options.ordered) {
            this.el = document.createElement('ol');
        } else {
            this.el = document.createElement('ul');
        }
    }

    /**
     * Changes element to an <ol> element or <ul> element
     *
     * @type {boolean}
     */
    set ordered(ordered: boolean) {
        this.options = {
            ...this.options,
            ordered
        };
    }

    /**
     * Returns whether the element is an <ol> element or <ul> element
     *
     * @type {boolean}
     */
    get ordered(): boolean {
        return this.options?.ordered || false;
    }
}


CBS.addElement('list', CBS_List);