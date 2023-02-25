class Page {
    constructor(link, main = async() => {
        console.log('No main function defined for this page');
        return async() => {
            console.log('No leave function defined for this page');
        };
    }) {
        if (typeof main === 'function') {
            /**
             * @type {Function} main
             * @returns {Function} leave
             */
            this.main = main;
        } else throw new Error('main must be a function');

        // main must be async
        if (!this.main.constructor.name === 'AsyncFunction') throw new Error('main must be async');

        // set all object properties from link
        Object.keys(link).forEach(key => {
            this[key] = link[key];
        });

        // offcanvas link
        /**
         * @type {HTMLAnchorElement} link
         */
        this.link = document.querySelector(`.nav-link[href="${this.pathname}"]`);

        // sets link click event
        this.link.addEventListener('click', async(e) => {
            e.preventDefault();
            this.load();
        });

        /**
         * @type {HTMLElement} html
         */
        this.html = document.querySelector(`.page#${this.pathname.replace('/', '').replace(new RegExp('/', 'g'), '--')}`);

        /**
         * @type {Function} querySelector
         * @param {String} selector
         * @returns {HTMLElement}
         */
        this.querySelector = this.html.querySelector.bind(this.html);

        /**
         * @type {Function} querySelectorAll
         * @param {String} selector
         * @returns {NodeList}
         */
        this.querySelectorAll = this.html.querySelectorAll.bind(this.html);

        /**
         * @type {Function} addEventListener
         * @param {String} type
         * @param {Function} listener
         * @param {Boolean} options
         */
        this.addEventListener = this.html.addEventListener.bind(this.html);

        /**
         * @type {Function} removeEventListener
         * @param {String} type
         * @param {Function} listener
         * @param {Boolean} options
         * @returns {Boolean}
         */
        this.removeEventListener = this.html.removeEventListener.bind(this.html);

        /**
         * @type {Function} dispatchEvent
         * @param {Event} event
         * @returns {Boolean}
         */
        this.dispatchEvent = this.html.dispatchEvent.bind(this.html);

        /**
         * @type {Object} parameters
         * @private
         */
        this.parameters = {};
    }

    async load(pushState = true) {
        if (currentPage) currentPage.leave({
            page: currentPage,
            html: currentPage.html
        });
        this.setInfo(); // sets page info
        this.open(); // opens page and sets link to active
        window.scrollTo(0, 0); // scrolls to top
        navigateTo(
            this.link.href + Object.keys(this.parameters).length ?
            this.parameterString :
            '',
            pushState,
            false
        ); // adds page to history
        currentPage = this;
        const leave = await this.main(this); // runs main function

        if (typeof leave === 'function') {
            /**
             * @type {Function} function to run when leaving this page
             */
            this.leave = leave;
        } else this.leave = async() => {
            console.log('No leave function defined for this page');
        }
    }

    setInfo() {
        const { name, keywords, description, screenInfo } = this;

        // sets background color
        if (previousMainColor) document.querySelector('body').classList.remove(`bg-${previousMainColor}`)
        document.querySelector('body').classList.add(`bg-${screenInfo.color}`);
        previousMainColor = screenInfo.color;

        // sets page information
        document.title = 'Team Tators: ' + name;
        document.querySelector('[name="keywords"]').setAttribute('content', keywords.toString());
        document.querySelector('[name="description"]').setAttribute('content', description);
    }

    open() {
        // hide all pages
        document.querySelectorAll('.page').forEach(el => {
            hideElement(el);
        });

        showElement(this.html);

        // deactivate all links
        document.querySelectorAll('.nav-link').forEach(_l => {
            _l.classList.remove('active');
        });

        // activate this link
        this.link.classList.add('active');

        // if mobile, close sidebar
        $('#side-bar-nav').offcanvas('hide');

        // scroll to top
        window.scrollTo(0, 0);
    }

    /**
     * @type {String} parameterString
     * @private
     */
    get parameterString() {
        return '?' + Object.keys(this.parameters).map(key => key + '=' + this.parameters[key]).join('&');
    }

    /**
     * @type {Object} parameters
     * @public
     */
    clearParameters() {
        this.parameters = {};
    }

    /**
     * 
     * @param {String} key 
     * @param {String} value
     * @public 
     */
    setParameter(key, value) {
        if (typeof key !== 'string' && typeof value !== 'string') throw new Error('key and value must be strings. Received ' + typeof key + ' and ' + typeof value + ' respectively');
        this.parameters[key] = value;
    }
}

function navigateTo(url, pushState, reload) {
    if (url == location.pathname && !reload) return; // if already on page or reloading, do nothing
    if (pushState) history.pushState({}, '', url); // add page to history
}
window.addEventListener('popstate', (e) => {
    e.preventDefault();
    openPage(location.pathname, false); // open page from history
});

function openPage(url, pushState = true) {
    const page = pageList.find(p => p.pathname == url);
    if (page) page.load(pushState);
}
window.scrollTo(0, 0);

let pageList,
    allPages = {};
let previousMainColor;
document.addEventListener('DOMContentLoaded', async() => {
    const year = new Date().getFullYear();
    currentYearObject = yearObjects[year];
    await getTatorEvents(year);

    const links = await requestFromServer({
        url: '/get-links',
        method: 'POST'
    });

    pageList = links.map(l => {
        const p = new Page(l, mainFunctions[l.name]);
        allPages[p.pathname.replace(new RegExp('/', 'g'), '-').split('-').join('')] = p;
        return p;
    });

    const page = pageList.find(p => p.pathname == location.pathname);

    if (page) page.load();
    else pageList[0].load();

    try { // if no loading screen, don't do this
        // loading screen
        const loadingScreen = document.querySelector('#loading-page');
        // add animations
        loadingScreen.classList.add('animate__animated');
        loadingScreen.classList.add('animate__fadeOut');

        // remove loading screen after animation
        loadingScreen.addEventListener('animationend', () => {
            loadingScreen.remove();
        });
    } catch {}
});