

/**
 * Options for CBS_ListItem
 *
 * @typedef {CBS_ListItemOptions}
 */
type CBS_ListItemOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}


/**
 * Item for CBS_List
 *
 * @class CBS_ListItem
 * @typedef {CBS_ListItem}
 * @extends {CBS_Component}
 */
class CBS_ListItem extends CBS_Component {
    /**
     * Creates an instance of CBS_ListItem
     *
     * @constructor
     * @param {?CBS_ListItemOptions} [options]
     */
    constructor(options?: CBS_ListItemOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'list-group-item'
            ],
            attributes: {
                ...options?.attributes,
                type: 'list-item'
            }
        }

        this.el = document.createElement('li');
    }
}


CBS.addElement('list-item', CBS_ListItem);