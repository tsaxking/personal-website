class PDFPage {
    constructor(filename, pagenum, pdf) {
        /**
         * @type {String} filename
         */
        this.filename = filename;

        /**
         * @type {Number} pagenum
         */
        this.pagenum = pagenum;
        /**
         * @type {PDF} pdf
         */
        this.pdf = pdf;

        /**
         * @type {Boolean} rendered
         */
        this.rendered = false;
    }

    /**
     * @param {Canvas} canvas (optional) canvas object
     * @param {Object} options (optional) options for the CanvasImage
     * @returns {Promise} resolves to a dataURL of the page
     */
    render(canvas, options) {
        return new Promise(async(resolve, reject) => {
            const page = await this.pdf.pdf.getPage(this.pagenum);

            const viewport = page.getViewport({ scale: 1 });

            const tempCanvas = document.createElement('canvas');
            const context = tempCanvas.getContext('2d');
            tempCanvas.height = viewport.height;
            tempCanvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;

            this.dataURL = tempCanvas.toDataURL();

            if (canvas) {
                const img = new CanvasImage(this.dataURL, options);
                await img.render();
                img.draw(canvas);
            }

            this.rendered = true;

            resolve(this.dataURL);
        });
    }

    /**
     * 
     * @param {Object} options options for the Bootstrap.Card 
     * @returns {Bootstrap.Card} a Bootstrap.Card with the page as an image
     */
    displayCard(options) {
        if (!this.rendered) throw new Error('Page not rendered');
        return new Bootstrap.Card({
            title: `Page ${this.pagenum}`,
            body: `<img src="${this.dataURL}" class="img-fluid" />`,
            ...options
        });
    }
}