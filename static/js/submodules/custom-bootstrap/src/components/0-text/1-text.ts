/**
 * Description placeholder
 *
 * @typedef {CBS_TextOptions}
 */
type CBS_TextOptions = {
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
 * @class CBS_Text
 * @typedef {CBS_Component}
 * @extends {CBS_Element}
 */
class CBS_Text extends CBS_Element {
    __color?: CBS_Color;
    __size?: CBS_Size;
    __weight?: CBS_Weight;
    __align?: CBS_Align;
    /**
     * Creates an instance of CBS_Text.
     *
     * @constructor
     * @param {?CBS_TextOptions} [options]
     */
    constructor(options?: CBS_TextOptions) {
        super(options);
    }

    set text(text: string) {
        this.el.innerText = text;
    }

    get text(): string {
        return this.el.innerText;
    }

    set html(html: string) {
        this.el.innerHTML = html;
    }

    get html(): string {
        return this.el.innerHTML;
    }

    set color(color: CBS_Color|undefined) {
        if (this.color) this.removeClass(`text-${this.color}`); 
        this.__color = color;
        if (color) this.addClass(`text-${color}`);
    }

    get color(): CBS_Color|undefined {
        return this.__color;
    }

    set size(size: CBS_Size|undefined) {
        if (this.size) this.removeClass(`text-${this.size}`);
        this.__size = size;
        if (size) this.addClass(`text-${size}`);
    }

    get size(): CBS_Size|undefined {
        return this.__size;
    }

    set weight(weight: CBS_Weight|undefined) {
        if (this.weight) this.removeClass(`font-${this.weight}`);
        this.__weight = weight;
        if (weight) this.addClass(`font-${weight}`);
    }

    get weight(): CBS_Weight|undefined {
        return this.__weight;
    }

    set align(align: CBS_Align|undefined) {
        if (this.align) this.removeClass(`text-${this.align}`);
        this.__align = align;
        if (align) this.addClass(`text-${align}`);
    }

    get align(): CBS_Align|undefined {
        return this.__align;
    }
}


CBS.addElement('text', CBS_Component);