class CanvasButton {
    /**
     * @param {Object} functions Parameters for the button
     */
    constructor({
        onclick = () => {},
        onstart = () => {},
        onend = () => {},
        onmove = () => {}
    }, {
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        options: {
            color = "white",
            borderColor = "black",
            border = 1
        },
        text = ''
    }, customParameters = {}) {
        Object.assign(this, {
            onclick,
            onstart,
            onend,
            onmove
        });

        /**
         * @type {Object} properties The properties of the button
         */
        this.properties = {
            x,
            y,
            width,
            height,
            options: {
                color,
                borderColor,
                border
            },
            text
        };

        /**
         * @type {Object} customParameters The custom parameters of the button
         */
        this.customParameters = customParameters;
    }

    /**
     * 
     * @param {Canvas} canvas the custom canvas class 
     */
    draw(canvas) {
        const {
            context,
            canvas: {
                width: cWidth,
                height: cHeight
            }
        } = canvas;
        const {
            x,
            y,
            width,
            height,
            options,
            text
        } = this.properties;

        context.save();

        if (options) {
            if (options.color) context.fillStyle = options.color;
            if (options.borderColor) context.strokeStyle = options.borderColor;
            if (options.border) context.lineWidth = options.border;
        }

        if (text) {
            const dimension = Math.min(width, height);

            const t = new CanvasText(
                x + width / 2,
                y + height / 2,
                text, {
                    fillStyle: options.borderColor,
                    font: `${dimension * 0.8}px Arial`,
                    textAlign: 'center',
                    textBaseline: 'middle'
                }
            );

            t.draw(canvas);
        }

        context.fillRect(x * cWidth, y * cHeight, width * cWidth, height * cHeight);
        context.strokeRect(x * cWidth, y * cHeight, width * cWidth, height * cHeight);

        context.restore();
    }

    isIn(x, y) {
        const { x: bx, y: by, width, height } = this.properties;

        return x >= bx && x <= bx + width && y >= by && y <= by + height;
    }
};