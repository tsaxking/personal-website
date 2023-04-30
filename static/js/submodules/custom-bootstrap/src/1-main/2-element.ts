/**
 * Generic Node
 *
 * @typedef {CBS_Node}
 */
type CBS_Node = CBS_Element|Node|string;

// used in CBS_Element.components
/**
 * Generic NodeMap
 *
 * @typedef {CBS_NodeMap}
 */
type CBS_NodeMap = CBS_Node[];

// Passed into every CBS_Element constructor
/**
 * Generic options object
 *
 * @class CBS_Options
 * @typedef {CBS_Options}
 */
type CBS_Options = {
    /**
     * Classes to be added to the element
     *
     * @type {?string[]}
     */
    classes?: string[];
    /**
     * Id to be added to the element
     *
     * @type {?string}
     */
    id?: string;
    /**
     * Style to be added to the element
     *
     * @type {?object}
     */
    style?: object;
    /**
     * Attributes to be added to the element
     *
     * @type {?object}
     */
    attributes?: {
        [key: string]: string;
    }
}

/**
 * Description placeholder
 *
 * @typedef {CBS_PropertyMap}
 */
type CBS_PropertyMap = {
    [key: string]: number|undefined;
}

/**
 * Description placeholder
 *
 * @typedef {CBS_Properties}
 */
type CBS_Properties = {
    padding: CBS_PropertyMap;
    margin: CBS_PropertyMap;
}


/**
 * Element container
 *
 * @class CBS_Element
 * @typedef {CBS_Element}
 * @extends {CustomBootstrap}
 */
class CBS_Element extends CustomBootstrap {
    /**
     * All templates for this class
     *
     * @static
     * @type {{ [key: string]: CBS_Element }}
     */
    static _templates: { [key: string]: CBS_Element } = {
        'default': new CBS_Element()
    };


    /**
     * Generates a class from the template
     * @deprecated
     * This is currently in progress and is not ready for use
     *
     * @todo // TODO: Finish this
     * 
     * @static
     * @param {string} type
     * @returns {new () => CBS_Element}
     */
    static classFromTemplate(type: string): new () => CBS_Element {
        const template = this.templates[type] || this.templates['default'];

        const constructor = template.constructor as new () => CBS_Element;

        const c = class extends constructor {
            constructor(...args: []) {
                super(...args);
            }
        }

        c.prototype.options = template.options;
        c.prototype.listeners = template.listeners;
        (c.prototype as CBS_Component).subcomponents = (template as CBS_Component).subcomponents;
        c.prototype.parameters = template.parameters;
        c.prototype._el = template._el.cloneNode(true) as HTMLElement;
        c.prototype._options = template._options;
        c.prototype._events = template._events;
        c.prototype._components = template._components;

        return c;
    }

    /**
     * Generates a premade template from a string
     *
     * @static
     * @param {string} type
     * @param {?CBS_Options} [options]
     * @returns {CBS_Element}
     */
    static fromTemplate(type: string, options?: CBS_Options): CBS_Element {
        const el = (this.templates[type] || this.templates['default']).clone(true);
        el.options = options || {};
        return el;
    }

    /**
     * All templates for this class
     *
     * @private
     * @static
     * @readonly
     * @type {{ [key: string]: CBS_Element }}
     */
    private static get templates(): { [key: string]: CBS_Element } {
        return this._templates;
    }

    /**
     * Adds a template to the class
     *
     * @public
     * @static
     * @param {string} type
     * @param {CBS_Element} template
     * @returns {boolean}
     */
    public static addTemplate(type: string, template: CBS_Element): boolean {
        if (template.constructor.name !== this.name) {
            throw new Error(`Template must be of type ${this.name}`);
        }


        if (this._templates[type]) return false;
        this._templates[type] = template;
        return true;
    }





    // default properties
    /**
     * Parameters (used in writing/reading)
     *
     * @type {CBS_Parameters}
     */
    _parameters: CBS_Parameters = {};
    /**
     * The element this class represents
     *
     * @type {HTMLElement}
     */
    _el: HTMLElement = document.createElement('div');
    /**
     * All listeners for this element
     *
     * @type {CBS_Listener[]}
     */
    listeners: CBS_Listener[] = [];
    /**
     * All events and their respective callbacks (used in dispatching)
     *
     * @type {{ [key: string]: CBS_ListenerCallback }}
     */
    _events: { [key: string]: CBS_ListenerCallback } = {};
    /**
     * All components
     *
     * @type {CBS_NodeMap}
     */
    _components: CBS_NodeMap = [];
    /**
     * All options for this element
     *
     * @type {CBS_Options}
     */
    _options: CBS_Options = {};


    /**
     * Description placeholder
     *
     * @readonly
     * @type {CBS_NodeMap}
     */
    get components(): CBS_NodeMap {
        return this._components;
    }











    // █▀▄ ▄▀▄ █▀▄ █▀▄ █ █▄ █ ▄▀     ▄▀▄ █▄ █ █▀▄    █▄ ▄█ ▄▀▄ █▀▄ ▄▀  █ █▄ █ 
    // █▀  █▀█ █▄▀ █▄▀ █ █ ▀█ ▀▄█    █▀█ █ ▀█ █▄▀    █ ▀ █ █▀█ █▀▄ ▀▄█ █ █ ▀█ 

    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    _padding: CBS_PropertyMap = {};
    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    _margin: CBS_PropertyMap = {};

    /**
     * Description placeholder
     *
     * @private
     * @param {string} paddingOrMargin
     * @param {string} key
     * @param {(number|undefined)} value
     */
    private setPaddingOrMargin(paddingOrMargin: string, key: string, value: number|undefined) {
        const properties = [
            's',
            'e',
            't',
            'b',

            'x',
            'y'
        ];

        const set = (property: CBS_PropertyMap, key: string, value: number|undefined) => {
            const abbr: string = paddingOrMargin[0];

            this.el.classList.remove(`${abbr}-${property.global}`); // removes glbal property

            if (key === 'global') {
                properties.forEach(p => {
                    this.el.classList.remove(`${abbr}${p}-${property[p]}`);

                    delete property[p];
                });

                property.global = value;
                this.el.classList.add(`${abbr}-${value}`);
            } else {
                delete property.global;
                this.el.classList.remove(`${abbr}${key}-${property[key]}`); // removes the current property
                property[key] = value;
                this.el.classList.add(`${abbr}${key}-${value}`);
            }
        }

        switch (paddingOrMargin) {
            case 'padding':
                set(this._padding, key, value);
                break;
            case 'margin':
                set(this._margin, key, value);
                break;
        }
    }

    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    set allPadding(padding: CBS_PropertyMap) {
        this._padding = padding;

        if (padding.s) this.paddingS = padding.s;
        if (padding.e) this.paddingE = padding.e;
        if (padding.t) this.paddingT = padding.t;
        if (padding.b) this.paddingB = padding.b;
        if (padding.x) this.paddingX = padding.x;
        if (padding.y) this.paddingY = padding.y;
        if (padding.global) this.padding = padding.global;
    }

    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    get allPadding(): CBS_PropertyMap {
        return this._padding;
    }

    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    set allMargin(margin: CBS_PropertyMap) {
        this._margin = margin;

        if (margin.s) this.marginS = margin.s;
        if (margin.e) this.marginE = margin.e;
        if (margin.t) this.marginT = margin.t;
        if (margin.b) this.marginB = margin.b;
        if (margin.x) this.marginX = margin.x;
        if (margin.y) this.marginY = margin.y;
        if (margin.global) this.margin = margin.global;
    }

    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    get allMargin(): CBS_PropertyMap {
        return this._margin;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set padding(value: number|undefined) {
        this.setPaddingOrMargin('padding', 'global', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingX(value: number|undefined) {
        this.setPaddingOrMargin('padding', 'x', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingY(value: number|undefined) {
        this.setPaddingOrMargin('padding', 'y', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingS(value: number|undefined) {
        this.setPaddingOrMargin('padding', 's', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingE(value: number|undefined) {
        this.setPaddingOrMargin('padding', 'e', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingT(value: number|undefined) {
        this.setPaddingOrMargin('padding', 't', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingB(value: number|undefined) {
        this.setPaddingOrMargin('padding', 'b', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set margin(value: number|undefined) {
        this.setPaddingOrMargin('margin', 'global', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginX(value: number|undefined) {
        this.setPaddingOrMargin('margin', 'x', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginY(value: number|undefined) {
        this.setPaddingOrMargin('margin', 'y', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginS(value: number|undefined) {
        this.setPaddingOrMargin('margin', 's', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginE(value: number|undefined) {
        this.setPaddingOrMargin('margin', 'e', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginT(value: number|undefined) {
        this.setPaddingOrMargin('margin', 't', value);
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginB(value: number|undefined) {
        this.setPaddingOrMargin('margin', 'b', value);
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get padding(): number|undefined {
        return this._padding.global;
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingX(): number|undefined {
        return this._padding.x;
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingY(): number|undefined {
        return this._padding.y;
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingS(): number|undefined {
        return this._padding.s;
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingE(): number|undefined {
        return this._padding.e;
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingT(): number|undefined {
        return this._padding.t;
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingB(): number|undefined {
        return this._padding.b;
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get margin(): number|undefined {
        return this._margin.global;
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginX(): number|undefined {
        return this._margin.x;
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginY(): number|undefined {
        return this._margin.y;
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginS(): number|undefined {
        return this._margin.s;
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginE(): number|undefined {
        return this._margin.e;
    }

    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginT(): number|undefined {
        return this._margin.t;
    }







    
    // ▄▀▀ █ █ ▄▀▀ ▀█▀ ▄▀▄ █▄ ▄█    ██▀ █ █ ██▀ █▄ █ ▀█▀ ▄▀▀ 
    // ▀▄▄ ▀▄█ ▄█▀  █  ▀▄▀ █ ▀ █    █▄▄ ▀▄▀ █▄▄ █ ▀█  █  ▄█▀ 

    // custom events on all elements
    /**
     * All custom events for this element
     *
     * @type {string[]}
     */
    static _customEvents: string[] = [
        // DOM Events
        'el:change',
        'el:append',
        'el:remove',
        'el:hide',
        'el:show',
        'el:clone',
        'el:destroy',

        // Parameter Events
        'param:write',
        'param:read',

        // Option events
        'options:change'
    ];


    /**
     * Gets all custom events for this element
     *
     * @static
     * @type {string[]}
     */
    static get customEvents(): string[] {
        return this._customEvents;
    }

    /**
     * Sets all custom events for this element
     *
     * @static
     * @type {{}}
     */
    static set customEvents(events: string[]) {
        this._customEvents = events;
    }

    /**
     * Adds a single custom event to the prototype
     *
     * @static
     * @param {string} event
     */
    static addCustomEvent(event: string) {
        this._customEvents.push(event);
    }

    /**
     * Removes a single custom event from the prototype
     *
     * @static
     * @param {string} event
     */
    static removeCustomEvent(event: string) {
        this._customEvents = this.customEvents.filter(e => e !== event);
    }

    /**
     * Adds multiple custom events to the prototype
     *
     * @static
     * @param {...string[]} events
     */
    static addCustomEvents(...events: string[]) {
        this._customEvents.push(...events);
    }

    /**
     * Removes multiple custom events from the prototype
     *
     * @static
     * @param {...string[]} events
     */
    static removeCustomEvents(...events: string[]) {
        this._customEvents = this.customEvents.filter(e => !events.includes(e));
    }

    /**
     * Creates an instance of CBS_Element
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super();

        this.__options = options || {};
    }

    set __options(options: CBS_Options) {
        if (!this._el) return;

        this._options = options;

        const { classes, id, style, attributes } = options;

        if (classes?.length) {
            this._el.classList.add(...classes);
        }

        if (id) {
            this._el.id = id;
        }

        if (style) {
            this._el.setAttribute('style', Object.entries(style).map(([key, val]) => {
                return `${key}: ${val};`;
            }).join() || '');
        }

        if (attributes) {
            Object.entries(attributes).forEach(([value, key]) => {
                this._el.setAttribute(key, value);
            });
        }
    }

    /**
     * Gets the options for this element
     *
     * @type {CBS_Options}
     */
    get options(): CBS_Options {
        return this._options;
    }

    /**
     * Sets the options for this element and renders
     *
     * @type {CBS_Options}
     */
    set options(options: CBS_Options) {
        if (!this._el) return;

        this._options = options;

        const { classes, id, style, attributes } = options;

        if (classes?.length) {
            this._el.classList.add(...classes);
        }

        if (id) {
            this._el.id = id;
        }

        if (style) {
            this._el.setAttribute('style', Object.entries(style).map(([key, val]) => {
                return `${key}: ${val};`;
            }).join() || '');
        }

        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                this._el.setAttribute(key, value);
            });
        }

        this.trigger('options:change');
    }

    /**
     * Gets the element this class represents
     *
     * @type {HTMLElement}
     */
    get el(): HTMLElement {
        return this._el;
    }

    /**
     * Sets the element this class represents
     * Also clears all elements
     * Also adds all events to the element
     * Also triggers the element:change event
     * Also renders the element
     * Also sets the padding and margin
     *
     * @type {HTMLElement}
     */
    set el(el: HTMLElement) {
        this.clearElements();

        this._el = el;
        this.__options = this._options;
        this.allPadding = this.allPadding;
        this.allMargin = this.allMargin;

        Object.entries(this._events).forEach(([event, callback]) => {
            this._el.addEventListener(event, callback);
        });

        this.trigger('element:change');
    }







    // ██▀ █   ██▀ █▄ ▄█ ██▀ █▄ █ ▀█▀ ▄▀▀ 
    // █▄▄ █▄▄ █▄▄ █ ▀ █ █▄▄ █ ▀█  █  ▄█▀ 


    /**
     * Appends an element to this element
     *
     * @param {...CBS_NodeMap} elements
     */
    append(...elements: CBS_NodeMap) {
        elements.forEach(el => {
            if (el instanceof CBS_Element) {
                this._el.appendChild(el._el);
            } else if (typeof el === 'string') {
                this._el.innerHTML += el;
            } else {
                this._el.appendChild(el);
            }
        });

        this._components.push(...elements);

        this.render();
    }

    /**
     * Removes an element from this element
     *
     * @param {...CBS_NodeMap} elements
     */
    removeElement(...elements: CBS_NodeMap) {
        elements.forEach(el => {
            if (el instanceof CBS_Element) {
                this._el.removeChild(el._el);
            } else if (typeof el === 'string') {
                this._el.innerHTML = this._el.innerHTML.replace(el, '');
            } else {
                this._el.removeChild(el);
            }
        });

        this._components = this._components.filter(e => !elements.includes(e));
    }

    /**
     * Appends an element at the start of this element
     *
     * @param {...CBS_NodeMap} elements
     */
    prepend(...elements: CBS_NodeMap) {
        elements.forEach(el => {
            if (el instanceof CBS_Element) {
                this._el.prepend(el._el);
            } else if (typeof el === 'string') {
                this._el.innerHTML = el + this._el.innerHTML;
            } else {
                this._el.prepend(el);
            }
        });

        this._components.unshift(...elements);

        this.render();
    }

    /**
     * Replace an element with another element
     *
     * @param {CBS_Node} nodeToReplace
     * @param {...CBS_NodeMap} elementsToAdd
     */
    replace(nodeToReplace: CBS_Node, ...elementsToAdd: CBS_NodeMap) {
        if (this._components.includes(nodeToReplace)) {
            const index = this._components.indexOf(nodeToReplace);
            this.insertAfter(nodeToReplace, ...elementsToAdd);
            this.removeElement(nodeToReplace);
        }

        this.render();
    }

    /**
     * Inserts an element before another element
     *
     * @param {CBS_Node} nodeToInsertBefore
     * @param {...CBS_NodeMap} elementsToAdd
     */
    insertBefore(nodeToInsertBefore: CBS_Node, ...elementsToAdd: CBS_NodeMap) {
        if (this._components.includes(nodeToInsertBefore)) {
            const index = this._components.indexOf(nodeToInsertBefore);
            this._components.splice(index, 0, ...elementsToAdd);

            let node: Node|null;

            // adds elements to components
            if (nodeToInsertBefore instanceof CBS_Element) {
                node = nodeToInsertBefore._el;
            } else if (typeof nodeToInsertBefore === 'string') { 
                node = this.createElementFromText(nodeToInsertBefore);
            } else {
                node = nodeToInsertBefore;
            }

            // adds elements to the DOM
            elementsToAdd.forEach((el, i) => {
                if (el instanceof CBS_Element) {
                    this._el.insertBefore(el._el, node);
                } else if (typeof el === 'string') {
                    const div = document.createElement('div');
                    div.innerHTML = el;
                    this._el.insertBefore(div, node);
                } else {
                    this._el.insertBefore(el, node);
                }
            });
        }

        this.render();
    }

    /**
     * Inserts an element after another element
     *
     * @param {CBS_Node} nodeToInsertAfter
     * @param {...CBS_NodeMap} elementsToAdd
     */
    insertAfter(nodeToInsertAfter: CBS_Node, ...elementsToAdd: CBS_NodeMap) {
        if (this._components.includes(nodeToInsertAfter)) {
            const index = this._components.indexOf(nodeToInsertAfter);
            const nextNode = this._components[index + 1];

            if (nextNode) {
                this.insertBefore(nextNode, ...elementsToAdd);
            } else {
                this.append(...elementsToAdd);
            }
        }
    }

    /**
     * Description placeholder
     */
    clearElements() {
        this._components = [];
        this._el.innerHTML = '';

        this.trigger('element:clear');
    }

    /**
     * Gets all children of this element as their repspective classes
     *
     * @readonly
     * @type {CBS_NodeMap}
     */
    get children(): CBS_NodeMap {
        return this._components;
    }

    /**
     * Gets the parent of this element
     *
     * @readonly
     * @type {(HTMLElement|null)}
     */
    get parent(): HTMLElement|null {
        return this._el.parentElement;
    }











    // █▀▄ ▄▀▄ █▀▄ ▄▀▄ █▄ ▄█ ██▀ ▀█▀ ██▀ █▀▄ ▄▀▀ 
    // █▀  █▀█ █▀▄ █▀█ █ ▀ █ █▄▄  █  █▄▄ █▀▄ ▄█▀ 

    /**
     * Creates all <span> and <div> to replace {{}} in the HTML
     */
    render() {
        const { parameters } = this;
        
        const isShallow = (el: Element): boolean => !el.children.length;

        if (this._el) {
            this._el.querySelectorAll('[data-cbs-replace]').forEach(e => {
                const replacement = document.createElement('div');
                replacement.dataset[`cbs-${this.constructor.name}`] = e.getAttribute('data-cbs-replace') || '';

                e.replaceWith(replacement);
            });

            const matches = Array.from(this._el.querySelectorAll('*')).filter(el => el.innerHTML.match(/{{.*}}/));

            matches.forEach(match => {
                if (isShallow(match)) {
                    const params = match.innerHTML.match(/{{.*}}/g);
                    params?.forEach(param => {
                        const key = param.replace(/[{}]/g, '');
                        const value = `<span data-cbs-${this.constructor.name}="${key}"></span>`;
                        match.innerHTML = match.innerHTML.replace(param, value);
                    });
                }
            });
        }

        this.writeAll();
    }
    
    /**
     * Writes a value to a parameter
     *
     * @param {string} key
     * @param {CBS_ParameterValue} value
     * @param {boolean} [trigger=true]
     */
    write(key: string, value: CBS_ParameterValue, trigger: boolean = true) {
        if (this._el) {
            this._el.querySelectorAll(`[data-cbs-${this.constructor.name}="${key}"]`).forEach(el => {
                if (typeof value === 'string' || typeof value === 'number') {
                    el.innerHTML = value.toString();
                } else if (typeof value === 'boolean') {
                    el.innerHTML = value ? 'true' : 'false';
                } else if (typeof value === 'undefined') {
                    el.innerHTML = '';
                } else if (value instanceof HTMLElement) {
                    while (el.firstChild) {
                        el.removeChild(el.firstChild);
                    }
                    el.appendChild(value);
                } else {
                    console.error('Invalid value type', value);
                }
            });

            this.parameters[key] = value;

            this.trigger(`parameter.write:${key}`);
            if (trigger) this.trigger('parameters.write');
        }
    }

    /**
     * Reads a parameter
     * @deprecated
     * I don't think this is useful at all
     *
     * @param {string} param
     * @param {boolean} [asHTML=false]
     * @returns {CBS_ParameterValue[]}
     */
    read(param: string, asHTML:boolean = false): CBS_ParameterValue[] {
        if (this._el) {
            this.trigger('param:read');

            const arr = Array.from(this._el.querySelectorAll(`[data-cbs-${this.constructor.name}="${param}"]`));
            if (asHTML) return arr.map(el => el.children[0] || el);
            return arr.map(el => el.innerHTML);
        }
        return [];
    }

    /**
     * Gets all parameters
     *
     * @type {CBS_Parameters}
     */
    get parameters(): CBS_Parameters {
        return this._parameters;
    }

    /**
     * Sets all parameters and writs them to the element
     *
     * @type {CBS_Parameters}
     */
    set parameters(params: CBS_Parameters) {
        this._parameters = params;
    }

    /**
     * Writes all parameters to the element
     */
    writeAll() {
        Object.entries(this.parameters).forEach(([key, value]) => {
            this.write(key, value, false);
        });

        this.trigger('parameters.write');
    }



















    // █   █ ▄▀▀ ▀█▀ ██▀ █▄ █ ██▀ █▀▄ ▄▀▀ 
    // █▄▄ █ ▄█▀  █  █▄▄ █ ▀█ █▄▄ █▀▄ ▄█▀ 

    /**
     * Adds a listener to the element
     *
     * @param {string} event
     * @param {CBS_ListenerCallback} callback
     * @param {boolean} [isAsync=false]
     */
    on(event: string, callback: CBS_ListenerCallback, isAsync: boolean = false) {
        if (!this._el) throw new Error('No element to add listener to');
        if (typeof event !== 'string') throw new Error('Event must be a string');
        if (typeof callback !== 'function') throw new Error('Callback must be a function');
        // if (options && typeof options !== 'object') throw new Error('Options must be an object');

        const errCallback = async(e: Event): Promise<boolean> => {
            return new Promise((res,rej) => {
                let success = true;
                const listeners = this.listeners.filter(l => l.event === event);

                listeners.filter(l => l.isAsync).forEach(async l => l.callback(e));

                for (const listener of listeners.filter(l => !l.isAsync)) {
                    try {
                        listener.callback(e);
                    } catch (err) {
                        success = false;
                        console.error(err);
                    }
                }

                return res(success);
            });
        }

        this.listeners.push(new CBS_Listener(event, callback, isAsync));

        if (!this.has(event)) {
            this._events[event] = errCallback;
            this._el.addEventListener(event, errCallback);
        }

    }

    /**
     * If the element has a listener for the event
     *
     * @param {string} event
     * @returns {boolean}
     */
    has(event: string): boolean {
        return !!this._events[event];
    }

    /**
     * Removes a listener from the element
     *
     * @param {?string} [event]
     * @param {?CBS_ListenerCallback} [callback]
     */
    off(event?: string, callback?: CBS_ListenerCallback) {
        if (!this._el) throw new Error('No element to remove event listener from');

        if (!event) {
            this.listeners = [];
            Object.entries(this._events).forEach(([event, cb]) => {
                this._el.removeEventListener(event, cb);
            });
            this._events = {};
            return;
        }

        if (typeof event !== 'string') throw new Error('event must be a string, received ' + typeof event);

        if (!callback) {
            this.listeners = this.listeners.filter(listener => listener.event !== event);
            return;
        }

        if (typeof callback !== 'function') throw new Error('callback must be a function, received ' + typeof callback);

        // if (!options) {
            this.listeners = this.listeners.filter(listener => listener.event !== event || listener.callback !== callback);
            // return;
        // }

        // if (typeof options !== 'object') throw new Error('options must be an object, received ' + typeof options);

        // this.el.removeEventListener(event, callback, options);
        // this.listeners = this.listeners.filter(listener => listener.event !== event || listener.callback !== callback);

        if (!this.listeners.filter(listener => listener.event === event).length) {
            this._el.removeEventListener(event, this._events[event]);
            delete this._events[event];
        }
    }

    /**
     * Triggers an event on the element (same as dispatch event)
     *
     * @async
     * @param {string} event
     * @param {?EventInit} [options]
     * @returns {Promise<boolean>}
     */
    async trigger(event: string, options?: EventInit): Promise<boolean> {
        return new Promise((res,rej) => {
            if (!this._el) throw new Error('No element to trigger event on');

            if (typeof event !== 'string') throw new Error('event must be a string, received ' + typeof event);

            if (this.constructor.prototype._customEvents?.includes(event)) {
                const e = new CustomEvent(event, {
                    ...(options || {}),
                    detail: {
                        name: this.constructor.name + ':' + event,
                        element: this.el
                    }
                });
                return this.el.dispatchEvent(e);
            } else {
                const e = new Event(event, options);
                return this.el.dispatchEvent(e);
            }
        });
    }



        
    // ▄▀  ██▀ █▄ █ ██▀ █▀▄ ▄▀▄ █      █▄ ▄█ ██▀ ▀█▀ █▄█ ▄▀▄ █▀▄ ▄▀▀ 
    // ▀▄█ █▄▄ █ ▀█ █▄▄ █▀▄ █▀█ █▄▄    █ ▀ █ █▄▄  █  █ █ ▀▄▀ █▄▀ ▄█▀ 


    /**
     * Hides the element (adds d-none class)
     */
    hide() {
        this._el.classList.add('d-none');

        this.trigger('el:hide');
    }

    /**
     * Shows the element (removes d-none class)
     */
    show() {
        this._el.classList.remove('d-none');

        this.trigger('el:show');
    }

    /**
     * Tests if the element is hidden (has the d-none class)
     */
    get isHidden() {
        return this._el.classList.contains('d-none');
    }

    /**
     * Toggles the d-none class
     */
    toggleHide() {
        this._el.classList.toggle('d-none');
    }

    /**
     * Description placeholder
     */
    destroy() {
        this.trigger('el:destroy');

        this.off();
        this._components.forEach(c => {
            if (c instanceof CBS_Element) c.destroy();
        });
        this._el.remove();
    }




    /**
     * Clones this 
     * @param {Boolean} listeners Whether or not to clone all listeners (default: true)
     * @returns {CBS_Element} A clone of this
     */
    clone(listeners: boolean = true): CBS_Element {
        // this will probably need to be changed for every extension of this class

        const constructor = this.constructor as new (options?: CBS_Options) => CBS_Element;

        const clone = new constructor(this.options);

        clone._el = this._el.cloneNode(true) as HTMLElement;

        // clones all listeners too
        if (listeners) this.listeners.forEach(listener => {
            clone.on(listener.event, listener.callback);
        });

        this.trigger('el:clone');

        return clone;
    }



















    // ▄▀▀ █   ▄▀▄ ▄▀▀ ▄▀▀ ██▀ ▄▀▀ 
    // ▀▄▄ █▄▄ █▀█ ▄█▀ ▄█▀ █▄▄ ▄█▀ 

    /**
     * Description placeholder
     *
     * @param {...string[]} classes
     */
    addClass(...classes: string[]) {
        this.options = {
            ...this.options,
            classes: [
                ...(this.options?.classes || []),
                ...classes
            ]
        }
    }

    /**
     * Description placeholder
     *
     * @param {...string[]} classes
     */
    removeClass(...classes: string[]) {
        const newClasses = this.options?.classes?.filter(c => !classes.includes(c)) || [];
        this.options = {
            ...this.options,
            classes: newClasses
        }
    }

    /**
     * Description placeholder
     *
     * @param {...string[]} classes
     */
    toggleClass(...classes: string[]) {
        this.options = {
            ...this.options,
            classes: this.options.classes?.map(c => {
                return classes.includes(c) ? c : null;
            }).filter(c => !!c) as string[]
        }
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {{}}
     */
    get classes() {
        return this.options.classes || [];
    }

    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {*}
     */
    hasClass(name: string): any {
        return this.classes.includes(name);
    }




    // ▄▀▀ ▀█▀ ▀▄▀ █   ██▀ 
    // ▄█▀  █   █  █▄▄ █▄▄ 


    get style() {
        return this.options.style || {};
    }

    set style(style: object) {
        this.options = {
            ...this.options,
            style: {
                ...(this.options.style || {}),
                ...style
            }
        }
    }





    // ▄▀▄ ▀█▀ ▀█▀ █▀▄ █ ██▄ █ █ ▀█▀ ██▀ ▄▀▀ 
    // █▀█  █   █  █▀▄ █ █▄█ ▀▄█  █  █▄▄ ▄█▀ 

    /**
     * Description placeholder
     *
     * @param {string} name
     * @param {string} value
     */
    setAttribute(name: string, value: string) {
        this.options = {
            ...this.options,
            attributes: {
                ...(this.options?.attributes || {}),
                [name]: value
            }
        }
    }

    /**
     * Description placeholder
     *
     * @param {string} name
     */
    removeAttribute(name: string) {
        if (this.options.attributes) {
            delete this.options.attributes[name];
        }

        this.options = this.options;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {{ [key: string]: string; }}
     */
    get attributes() {
        return this.options.attributes || {};
    }

    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {string}
     */
    getAttribute(name: string) {
        return this.attributes[name];
    }








    // ██▀ █ █ ██▀ █▄ █ ▀█▀ ▄▀▀ 
    // █▄▄ ▀▄▀ █▄▄ █ ▀█  █  ▄█▀ 

    /**
     * Description placeholder
     *
     * @param {(MouseEvent|TouchEvent)} e
     * @returns {{ x: any; y: any; }}
     */
    getXY(e: MouseEvent|TouchEvent) {
        if ((e as TouchEvent).touches) {
            return {
                x: (e as TouchEvent).touches[0].clientX,
                y: (e as TouchEvent).touches[0].clientY
            }
        } else {
            return {
                x: (e as MouseEvent).clientX,
                y: (e as MouseEvent).clientY
            }
        }
    }

    /**
     * Description placeholder
     *
     * @param {TouchEvent} e
     * @returns {*}
     */
    getXYList(e: TouchEvent) {
        return Array.from((e as TouchEvent).touches).map(t => {
            return {
                x: t.clientX,
                y: t.clientY
            }
        });
    }







    // ▄▀▀ ▄▀▄ █   ▄▀▄ █▀▄ 
    // ▀▄▄ ▀▄▀ █▄▄ ▀▄▀ █▀▄ 

    /**
     * Description placeholder
     *
     * @type {(CBS_Color|undefined)}
     */
    _background: CBS_Color|undefined;

    /**
     * Description placeholder
     *
     * @type {*}
     */
    set background(color: CBS_Color|undefined) {
        if (this.background) this.removeClass(`bg-${this.background}`);
        this._background = color;
        if (color) this.addClass(`bg-${color}`);
    }

    /**
     * Description placeholder
     *
     * @type {(CBS_Color|undefined)}
     */
    get background(): CBS_Color|undefined {
        return this._background;
    }

    get html() {
        return this.el.innerHTML;
    }

    set html(text: string) {
        this.el.innerHTML = text;
    }

    get content() {
        return this.components;
    }

    set content(content: CBS_Node|CBS_NodeMap) {
        this.clearElements();
        if (Array.isArray(content)) this.append(...content);
        else this.append(content);
    }
};