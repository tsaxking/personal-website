var SubCanvas = /** @class */ (function () {
    function SubCanvas(element, container) {
        this.element = element;
        this.container = container;
    }
    Object.defineProperty(SubCanvas.prototype, "position", {
        get: function () {
            return this.element.position;
        },
        set: function (value) {
            var _this = this;
            this.element.position = value;
            this.container.elements.forEach(function (e) {
                e.position = {
                    x: _this.position.x + e.position.x,
                    y: _this.position.y + e.position.y,
                    z: _this.position.z + e.position.z
                };
            });
        },
        enumerable: false,
        configurable: true
    });
    SubCanvas.prototype.moveTo = function (point) {
        this.position = point;
    };
    Object.defineProperty(SubCanvas.prototype, "visible", {
        get: function () {
            return this.element.visible;
        },
        set: function (value) {
            this.element.visible = value;
        },
        enumerable: false,
        configurable: true
    });
    SubCanvas.prototype.hide = function () {
        this.element.hide();
        this.container.elements.forEach(function (e) {
            e.hide();
        });
    };
    SubCanvas.prototype.show = function () {
        this.element.show();
        this.container.elements.forEach(function (e) {
            e.show();
        });
    };
    SubCanvas.prototype.draw = function (canvas) {
        this.element.draw(canvas);
        this.container.draw(canvas);
    };
    SubCanvas.prototype.addElement = function (element) {
        element.position = {
            x: this.position.x + element.position.x,
            y: this.position.y + element.position.y,
            z: this.position.z + element.position.z
        };
        this.container.addElement(element);
    };
    SubCanvas.prototype.removeElement = function (element) {
        this.container.removeElement(element);
        element.position = {
            x: element.position.x - this.position.x,
            y: element.position.y - this.position.y,
            z: element.position.z - this.position.z
        };
    };
    return SubCanvas;
}());
