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
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(position, size) {
        var _this = _super.call(this, position) || this;
        _this.size = size;
        return _this;
    }
    Rectangle.prototype.draw = function (canvas) {
        // draw this element
        canvas.context.beginPath();
        canvas.context.rect(this.position.x, this.position.y, this.size.width, this.size.height);
        canvas.context.stroke();
    };
    Rectangle.prototype.isIn = function (point) {
        var x = this.position.x;
        var y = this.position.y;
        var w = this.size.width;
        var h = this.size.height;
        return point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h;
    };
    Rectangle.prototype.isOut = function (point) {
        return !this.isIn(point);
    };
    return Rectangle;
}(CanvasElement));
