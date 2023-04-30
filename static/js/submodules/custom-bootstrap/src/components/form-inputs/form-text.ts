/**
 * Description placeholder
 *
 * @class CBS_FormText
 * @typedef {CBS_FormText}
 * @extends {CBS_Element}
 */
class CBS_FormText extends CBS_Element {
    /**
     * Creates an instance of CBS_FormText.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('small');

        this.addClass('form-text');
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set content(content: string) {
        this.el.innerHTML = content;

        if (content) this.show();
        else this.hide();
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get content() {
        return this.el.innerHTML;
    }
}