class FIRSTField {
    /**
     * An image of the field
     * @param {Number} year The year you are in
     */
    constructor(year) {
        this.year = year;
        this.src = `../static/pictures/${year}/field.png`;
    }

    /**
     * Draws the field onto a canvas
     * @param {Canvas} canvas The canvas to draw this on (NOT THE CONTEXT!!!)
     * @param {Function} onImageLoad Runs after the image is displayed on the canvas for layering purposes (Put all of you draw things inside of this function because it loads the image asynchronously which causes layering stuff to be weird)
     */
    draw({ context, canvas }, onImageLoad) {
        if (!context) throw new Error("No Canvas Found");
        // Once all draw functions take in Canvas class
        const tempImg = new Image()
        tempImg.src = this.src;
        tempImg.onload = () => {
            context.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
            if (onImageLoad) onImageLoad();
        };
    }
}