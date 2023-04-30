var Container = /** @class */ (function () {
    function Container() {
        this.elements = [];
    }
    Container.prototype.addElement = function (element) {
        this.elements.push(element);
    };
    Container.prototype.removeElement = function (element) {
        var index = this.elements.indexOf(element);
        if (index > -1)
            this.elements.splice(index, 1);
    };
    Container.prototype.draw = function (canvas) {
        var _this = this;
        this.sort();
        this.elements.forEach(function (e, i) {
            if (e instanceof CanvasImage && !e.image && !canvas.animating && i !== _this.elements.length - 1) {
                console.warn('Image has not loaded, and animation is not running. This may cause the image to render over other elements');
            }
            canvas.context.save();
            e.draw(canvas);
            canvas.context.restore();
        });
    };
    Container.prototype.sort = function () {
        // sort elements by z-index
        this.elements.sort(function (a, b) {
            var aPos = a.position;
            var bPos = b.position;
            return aPos.z - bPos.z;
        });
    };
    return Container;
}());
