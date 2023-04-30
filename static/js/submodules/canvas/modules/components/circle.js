var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(position, radius) {
        var _this = _super.call(this, position) || this;
        _this.radius = radius;
        return _this;
    }
    Circle.prototype.draw = function (canvas) {
        // draw this element
        canvas.context.beginPath();
        canvas.context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        canvas.context.stroke();
    };
    Circle.prototype.isIn = function (point) {
        var dist = Math.sqrt(Math.pow((point.x - this.position.x), 2) + Math.pow((point.y - this.position.y), 2));
        return dist <= this.radius;
    };
    Circle.prototype.isOut = function (point) {
        return !this.isIn(point);
    };
    return Circle;
}(CanvasElement));
