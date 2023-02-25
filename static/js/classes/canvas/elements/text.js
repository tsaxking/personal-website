class CanvasText {
    constructor(x, y, text, options) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.options = options;
    }

    /**
     * 
     * @param {Canvas} canvas the custom canvas class
     *
     */
    draw(canvas) {
        const { context } = canvas;
        const { x, y, text, options } = this;

        context.save();

        if (options) {
            if (options.fillStyle) context.fillStyle = options.color;
            if (options.font) context.font = options.font;
            if (options.textAlign) context.textAlign = options.textAlign;
            if (options.textBaseline) context.textBaseline = options.textBaseline;
        }

        context.fillText(text, x, y);

        context.restore();
    }

    isIn(x, y) {
        const { x: bx, y: by, width, height } = this;

        return x >= bx && x <= bx + width && y >= by && y <= by + height;
    }
}