/**
 * Description placeholder
 *
 * @typedef {CBS_ProgressBarOptions}
 */
type CBS_ProgressBarOptions = {
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
 * @class CBS_ProgressBar
 * @typedef {CBS_ProgressBar}
 * @extends {CBS_Component}
 */
class CBS_ProgressBar extends CBS_Component {
    /**
     * Creates an instance of CBS_ProgressBar.
     *
     * @constructor
     * @param {?CBS_ProgressBarOptions} [options]
     */
    constructor(options?: CBS_ProgressBarOptions) {
        super(options);
        this.el = document.createElement('div');

        this.addClass('progress-bar', 'rounded', 'shadow');
        this.setAttribute('aria-valuenow', '0');
        this.setAttribute('aria-valuemin', '0');
        this.setAttribute('aria-valuemax', '100');
        this.style = {
            width: '0%',
            height: '24px'
        }
    }
}

/**
 * Description placeholder
 *
 * @class CBS_Progress
 * @typedef {CBS_Progress}
 * @extends {CBS_Component}
 */
class CBS_Progress extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        text: new CBS_Component({
            classes: [
                'm-2'
            ]
        }),
        bar: new CBS_ProgressBar()
    }



    /**
     * Creates an instance of CBS_Progress.
     *
     * @constructor
     * @param {?CBS_ProgressBarOptions} [options]
     */
    constructor(options?: CBS_ProgressBarOptions) {
        super(options);

        this.el = document.createElement('div');

        this.options = {
            ...this.options,
            classes: [
                ...(this.options.classes || []),
                'd-flex',
                'justify-content-between',
                'align-items-center',
                'mb-3',
                'w-100',
                'p-2',
                'position-fixed',
                'bg-secondary',
                'rounded',
                'text-light',


                // To be used with animate.css
                'animate__animated',
                'animate__fadeInDown'
            ],
            style: {
                ...this.options.style,
                opacity: '0.9'
            }
        }

        this.append(
            this.subcomponents.text,
            this.subcomponents.bar
        );

        this.subcomponents.text.el.innerHTML = 'Loading... {{progress}}%';

        this.parameters = {
            progress: 0
        }
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set progress(progress: number) {
        this.parameters = {
            ...this.parameters,
            progress
        }

        this.subcomponents.bar.options = {
            ...this.subcomponents.bar.options,
            style: {
                ...this.subcomponents.bar.options.style,
                width: `${progress}%`
            },
            attributes: {
                ...this.subcomponents.bar.options.attributes,
                'aria-valuenow': `${progress}`
            }
        }
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    get progress() {
        return this.parameters.progress as number;
    }

    /**
     * Description placeholder
     */
    destroy(): void {
        setTimeout(super.destroy, 1000); // in case the animation doesn't work

        this.el.classList.add('animate__fadeOutUp');
        this.el.classList.remove('animate__fadeInDown');

        this.on('animationend', () => {
            super.destroy();
        });
    }
}




CBS.addElement('progress-bar', CBS_Progress);