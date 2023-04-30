/**
 * Description placeholder
 *
 * @typedef {CBS_ListenerCallback}
 */
type CBS_ListenerCallback = (event: Event) => Promise<boolean|void>|void;

/**
 * Description placeholder
 *
 * @class CBS_Listener
 * @typedef {CBS_Listener}
 */
class CBS_Listener {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    event: string;
    /**
     * Description placeholder
     *
     * @type {CBS_ListenerCallback}
     */
    callback: CBS_ListenerCallback;
    // options?: AddEventListenerOptions;
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    isAsync: boolean = true;

    /**
     * Creates an instance of CBS_Listener.
     *
     * @constructor
     * @param {string} event
     * @param {CBS_ListenerCallback} callback
     * @param {boolean} [isAsync=true]
     */
    constructor(event: string, callback: CBS_ListenerCallback, isAsync: boolean = true) {
        this.event = event;
        this.callback = callback;
        this.isAsync = isAsync;
    }
}

/**
 * Description placeholder
 *
 * @typedef {CBS_Event}
 */
type CBS_Event = {
    event: string;
    callback: CBS_ListenerCallback;
    // options?: AddEventListenerOptions;
    isAsync: boolean;
}