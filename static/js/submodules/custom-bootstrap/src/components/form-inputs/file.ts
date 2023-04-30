
/**
 * Description placeholder
 *
 * @typedef {CBS_FileInputOptions}
 */
type CBS_FileInputOptions = {
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
 * @class CBS_FileInput
 * @typedef {CBS_FileInput}
 * @extends {CBS_Input}
 */
class CBS_FileInput extends CBS_Input {
    /**
     * Creates an instance of CBS_FileInput.
     *
     * @constructor
     * @param {?CBS_FileInputOptions} [options]
     */
    constructor(options?: CBS_FileInputOptions) {
        super(options);

        this.addClass('form-control');
        this.setAttribute('type', 'file');
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {FileList}
     */
    get value(): FileList {
        return (this.el as HTMLInputElement).files as FileList;
    }

    /**
     * Description placeholder
     */
    clearFiles() {
        // clear all files from input
        try { 
            (this.el as HTMLInputElement).value = '';
        } catch (e) {
            console.warn('You must be using an older browser, attempting to clear files again...');
            this.setAttribute('type', 'text');
            this.setAttribute('type', 'file');
        }
    }

    /**
     * Description placeholder
     *
     * @async
     * @returns {Promise<ReadableStream[]>}
     */
    async getFileStreams(): Promise<ReadableStream[]> {
        return new Promise((res, rej) => {
            const files = this.value;
            const streams: ReadableStream[] = Array.from(files).map((f) => {
                return f.stream();
            });

            res(streams);
        });
    }
}


CBS.addElement('input-file', CBS_FileInput);