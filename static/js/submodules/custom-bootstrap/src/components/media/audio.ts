/**
 * Description placeholder
 *
 * @typedef {CBS_AudioOptions}
 */
type CBS_AudioOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    fadeTime?: number;
}

/**
 * Description placeholder
 *
 * @class CBS_AudioSource
 * @typedef {CBS_AudioSource}
 * @extends {CBS_Element}
 */
class CBS_AudioSource extends CBS_Element {
    /**
     * Creates an instance of CBS_AudioSource.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.el = document.createElement('source') as HTMLSourceElement;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set src(src: string) {
        (this.el as HTMLSourceElement).src = src;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get src(): string {
        return (this.el as HTMLSourceElement).src;
    }
}

/**
 * Description placeholder
 *
 * @class CBS_AudioElement
 * @typedef {CBS_AudioElement}
 * @extends {CBS_Component}
 */
class CBS_AudioElement extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        source: new CBS_AudioSource()
    }

    /**
     * Creates an instance of CBS_AudioElement.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.el = document.createElement('audio');
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {number}
     */
    get fadeTime(): number{
        return (this.options as CBS_AudioOptions)?.fadeTime || 100;
    }

    /**
     * Description placeholder
     *
     * @async
     * @returns {*}
     */
    async play() {
        this.volume = 0;
        (this.el as HTMLAudioElement).play();
        this.fadeIn(100).catch(() => {});
    }

    /**
     * Description placeholder
     *
     * @async
     * @returns {*}
     */
    async pause() {
        await this.fadeOut(100).catch(() => {});
        (this.el as HTMLAudioElement).pause();
    }

    /**
     * Description placeholder
     *
     * @async
     * @returns {*}
     */
    async stop() {
        await this.pause();
        this.currentTime = 0;
    }

    /**
     * Description placeholder
     *
     * @async
     * @param {number} duration
     * @returns {Promise<void>}
     */
    async fadeIn(duration: number): Promise<void> {
        return new Promise((resolve, reject) => {
            let volume: number = 0;
            let interval: number = duration / this.fadeTime;
            let increment: number = 1 / this.fadeTime;

            let fadeInInterval = setInterval(() => {
                if (volume >= 1) {
                    clearInterval(fadeInInterval);
                    resolve();
                } else {
                    volume += increment;
                    this.volume = volume;
                }
            }, interval);
        });
    }

    /**
     * Description placeholder
     *
     * @async
     * @param {number} duration
     * @returns {Promise<void>}
     */
    async fadeOut(duration: number): Promise<void> {
        return new Promise((res, rej) => {
            let interval: number = duration / this.fadeTime;
            let increment: number = 1 / this.fadeTime;
            
            let fadeOutInterval = setInterval(() => {
                if (this.volume <= 0) {
                    clearInterval(fadeOutInterval);
                    res();
                } else {
                    this.volume -= increment;
                }
            }, interval);
        });
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set volume(volume: number) {
        (this.el as HTMLAudioElement).volume = volume;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    get volume(): number {
        return (this.el as HTMLAudioElement).volume;
    }


    /**
     * Description placeholder
     *
     * @type {string}
     */
    set src(src: string) {
        (this.subcomponents.source as CBS_AudioSource).src = src;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get src(): string {
        return (this.subcomponents.source as CBS_AudioSource).src;
    }

    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    set controls(controls: boolean) {
        (this.el as HTMLAudioElement).controls = controls;
    }

    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    get controls(): boolean {
        return (this.el as HTMLAudioElement).controls;
    }

    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    set autoplay(autoplay: boolean) {
        (this.el as HTMLAudioElement).autoplay = autoplay;
    }

    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    get autoplay(): boolean {
        return (this.el as HTMLAudioElement).autoplay;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    #duration: number = 0;

    /**
     * Description placeholder
     *
     * @readonly
     * @type {Promise<number>}
     */
    get duration(): Promise<number> {
        return new Promise((res, rej) => {
            if (this.#duration) {
                res(this.#duration);
            } else {
                this.on('loadedmetadata', () => {
                    this.#duration = (this.el as HTMLAudioElement).duration;
                    res(this.#duration);
                });
            }
        });
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    get currentTime(): number {
        return (this.el as HTMLAudioElement).currentTime;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set currentTime(currentTime: number) {
        (this.el as HTMLAudioElement).currentTime = currentTime;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get paused(): boolean {
        return (this.el as HTMLAudioElement).paused;
    }
}

/**
 * Description placeholder
 *
 * @class CBS_AudioPlayhead
 * @typedef {CBS_AudioPlayhead}
 * @extends {CBS_Element}
 */
class CBS_AudioPlayhead extends CBS_Element {
    /**
     * Creates an instance of CBS_AudioPlayhead.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.options = {
            ...this.options,
            classes: [
                ...(this.options?.classes || [])
            ],
            style: {
                ...this.options?.style,
                width: '8px',
                height: '8px',
                '-webkit-border-radius': '50%',
                'border-radius': '50%',
                background: 'black',
                cursor: 'pointer',
                'margin-top': '-3px'
            }
        }

        this.el = document.createElement('div');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_AudioTimeline
 * @typedef {CBS_AudioTimeline}
 * @extends {CBS_Component}
 */
class CBS_AudioTimeline extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        playhead: new CBS_AudioPlayhead()
    }

    /**
     * Creates an instance of CBS_AudioTimeline.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.options = {
            ...this.options,
            classes: [
                ...(this.options?.classes || []),
                'mt-2',
                'ms-1',
                'rounded'
            ],
            style: {
                ...this.options?.style,
                width: '90%',
                height: '2px',
                float: 'left',
                background: 'rgba(0, 0, 0, 0.3)',
            }
        }

        this.el = document.createElement('div');
    }

    /**
     * Description placeholder
     *
     * @async
     * @param {CBS_AudioElement} audio
     * @returns {*}
     */
    async update(audio: CBS_AudioElement) {
        let playhead: CBS_AudioPlayhead = this.subcomponents.playhead as CBS_AudioPlayhead;
        let percentage: number = audio.currentTime / (await audio.duration) * 100;
        playhead.el.style.left = `${percentage}%`;
    }

    /**
     * Description placeholder
     *
     * @param {number} clientX
     * @returns {number}
     */
    getProgress(clientX: number): number {
        let playhead: CBS_AudioPlayhead = this.subcomponents.playhead as CBS_AudioPlayhead;
        return (clientX - this.el.offsetLeft) / (this.el.offsetWidth - playhead.el.offsetWidth);
    }
}

CBS_AudioTimeline.addCustomEvent('playhead.move');


/**
 * Description placeholder
 *
 * @class CBS_AudioButton
 * @typedef {CBS_AudioButton}
 * @extends {CBS_Element}
 */
class CBS_AudioButton extends CBS_Component {
    /**
     * Creates an instance of CBS_AudioButton.
     *
     * @constructor
     * @param {string} type
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(type: string, options?: CBS_AudioOptions) {
        super(options);

        this.options = {
            ...this.options,
            classes: ['material-icons'],
            style: {
                ...this.options?.style,
                cursor: 'pointer',
                float: 'left',
                'margin-top': '12px'
            }
        }

        this.el = document.createElement('i');


        switch (type) {
            case 'toggle':
                this.el.innerHTML = 'play_arrow';
                break;
            case 'stop':
                this.el.innerHTML = 'stop';
                break;
        }
    }
}

/**
 * Description placeholder
 *
 * @class CBS_AudioPlayer
 * @typedef {CBS_AudioPlayer}
 * @extends {CBS_Component}
 */
class CBS_AudioPlayer extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        audio: new CBS_AudioElement(),
        toggleButton: new CBS_AudioButton('toggle'),
        stopButton: new CBS_AudioButton('stop'),
        timeline: new CBS_AudioTimeline()
    }

    /**
     * Creates an instance of CBS_AudioPlayer.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.el = document.createElement('div');


        const {
            audio,
            toggleButton,
            stopButton,
            timeline
        } = this.subcomponents;


        this.append(
            audio,
            toggleButton,
            stopButton,
            timeline
        );
        const toggleButtonContent = (toggleButton as CBS_AudioButton).subcomponents.content as CBS_MaterialIcon;

        const pause = () => {
            toggleButtonContent.icon = 'play_arrow';
            toggleButtonContent.off('click', pause);
            toggleButtonContent.on('click', play);
            (audio as CBS_AudioElement).pause();
        }

        const play = () => {
            toggleButtonContent.icon = 'pause';
            toggleButtonContent.off('click', play);
            toggleButtonContent.on('click', pause);
            (audio as CBS_AudioElement).play();
        }

        const stop = () => {
            (audio as CBS_AudioElement).stop();
            pause();
        }


        audio.on('timeupdate', () => {
            (timeline as CBS_AudioTimeline).update(audio as CBS_AudioElement);
        });

        timeline.on('click', async (e) => {
            const progress = (timeline as CBS_AudioTimeline).getProgress((e as MouseEvent).clientX);

            (audio as CBS_AudioElement).currentTime = progress * (await (audio as CBS_AudioElement).duration);
        });

        const playhead  = (timeline as CBS_AudioTimeline).subcomponents.playhead as CBS_AudioPlayhead;

        playhead.on('mousedown', async(e) => {
            (audio as CBS_AudioElement).pause();
            playhead.on('mousemove', async(e) => {
                const progress = (timeline as CBS_AudioTimeline).getProgress((e as MouseEvent).clientX);

                (audio as CBS_AudioElement).currentTime = progress * (await (audio as CBS_AudioElement).duration);
                (timeline as CBS_AudioTimeline).update(audio as CBS_AudioElement);
            });

            playhead.on('mouseup', async(e) => {
                playhead.off('mousemove');
                (audio as CBS_AudioElement).play();
            });
        });


        toggleButton.on('click', play);
        stopButton.on('click', stop);
    }
}


/**
 * Description placeholder
 *
 * @class CBS_AudioCardBody
 * @typedef {CBS_AudioCardBody}
 * @extends {CBS_CardBody}
 */
class CBS_AudioCardBody extends CBS_CardBody {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        title: new CBS_H5(),
        subtitle: new CBS_Component(),
        player: new CBS_AudioPlayer()
    }

    /**
     * Creates an instance of CBS_AudioCardBody.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.el = document.createElement('div');

        this.append(
            this.subcomponents.title,
            this.subcomponents.subtitle,
            this.subcomponents.player
        );
    }
}


/**
 * Description placeholder
 *
 * @class CBS_AudioCard
 * @typedef {CBS_AudioCard}
 * @extends {CBS_Card}
 */
class CBS_AudioCard extends CBS_Card {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        image: new CBS_Image(),
        body: new CBS_AudioCardBody()
    }

    /**
     * Creates an instance of CBS_AudioCard.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.el = document.createElement('div');

        this.append(
            this.subcomponents.image,
            this.subcomponents.body
        );
    }
}




CBS.addElement('audio-card', CBS_AudioCard);
CBS.addElement('audio', CBS_AudioElement);