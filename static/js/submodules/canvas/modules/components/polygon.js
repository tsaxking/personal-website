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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Polygon_points;
var Polygon = /** @class */ (function (_super) {
    __extends(Polygon, _super);
    function Polygon(position, points) {
        var _this = _super.call(this, position) || this;
        _Polygon_points.set(_this, []);
        _this.points = points;
        return _this;
    }
    Object.defineProperty(Polygon.prototype, "points", {
        get: function () {
            return __classPrivateFieldGet(this, _Polygon_points, "f");
        },
        set: function (value) {
            if (!Array.isArray(value))
                throw new Error('Points must be an array of XYPoints.');
            value = value.map(function (p) { return new TwoDPoint(p); });
            __classPrivateFieldSet(this, _Polygon_points, value, "f");
        },
        enumerable: false,
        configurable: true
    });
    Polygon.prototype.draw = function (canvas) {
        // draw this element
        var point1 = this.points[0];
        canvas.context.beginPath();
        canvas.context.moveTo(point1.x, point1.y);
        this.points.forEach(function (p, i) {
            if (!i)
                return;
            canvas.context.lineTo(p.x, p.y);
        });
        canvas.context.lineTo(point1.x, point1.y);
        canvas.context.closePath();
        canvas.context.stroke();
    };
    Polygon.prototype.isIn = function (point) {
        // test if point is inside the box using ray casting
        var inside = false;
        for (var i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            var x1 = this.points[i].x;
            var y1 = this.points[i].y;
            var x2 = this.points[j].x;
            var y2 = this.points[j].y;
            var intersect = ((y1 > point.y) != (y2 > point.y)) && (point.x < (x2 - x1) * (point.y - y1) / (y2 - y1) + x1);
            if (intersect)
                inside = !inside;
        }
        // inside && !this.entered && this.onEnter();
        // !inside && this.entered && this.onExit();
        // this.entered = inside;
        return inside;
    };
    Polygon.prototype.isOut = function (point) {
        return !this.isIn(point);
    };
    return Polygon;
}(CanvasElement));
_Polygon_points = new WeakMap();
