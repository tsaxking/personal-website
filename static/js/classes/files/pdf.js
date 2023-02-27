class PDF {
    /**
     * 
     * @param {String} filename 
     */
    constructor(filename) {
        /**
         * @type {String} filename (without extension)
         */
        this.filename = filename;
    }

    async load() {
        this.loadingTask = pdfjsLib.getDocument('../uploads' + this.filename);

        this.pdf = await this.loadingTask.promise;

        this.pages = new Array(this.pdf.numPages).fill(0).map((_, i) => new PDFPage(this.filename, i + 1, this));
    }

    async renderPages() {
        return await Promise.all(this.pages.map(page => page.render()));
    }

    async draw(canvas, options) {
        this.currentPageIndex = 0;
        this.currentPage = this.pages[this.currentPageIndex];

        await this.currentPage.render(canvas);

        const [prev, next] = new Array(2).fill(0).map((_, i) => {
            const color = Color.fromBoostrap('primary').rgba.setAlpha(.5).toString('hex');

            return new CanvasButton({
                onclick: () => {
                    if (i) {
                        this.currentPageIndex++;
                    } else {
                        this.currentPageIndex--;
                    }

                    this.currentPage = this.pages[this.currentPageIndex];

                    this.currentPage.render(canvas);
                },
                onenter: () => {},
                onleave: () => {}
            }, {
                x: i ? 0.05 : 0.9,
                y: 0.4,
                width: 0.1,
                height: 0.2,
                options: {
                    color: color,
                    borderColor: color.analagous()[0].toString('hex'),
                    border: 1
                },
                text: i ? '<' : '>'
            })
        });
    }
}