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
var Canvas = /** @class */ (function (_super) {
    __extends(Canvas, _super);
    function Canvas(canvas, options) {
        var _this = _super.call(this) || this;
        _this.animating = false;
        _this.frames = 0;
        _this.fps = 0;
        _this.startDate = 0;
        _this.canvas = canvas;
        _this.size = options.size;
        _this.context = canvas.getContext('2d') || new CanvasRenderingContext2D();
        return _this;
    }
    Object.defineProperty(Canvas.prototype, "size", {
        get: function () {
            return { width: this.canvas.width, height: this.canvas.height };
        },
        set: function (value) {
            this.canvas.width = value.width;
            this.canvas.height = value.height;
        },
        enumerable: false,
        configurable: true
    });
    Canvas.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () {
            _this.draw(_this);
            _this.frames++;
            _this.fps = Math.round(_this.frames / ((Date.now() - _this.startDate) / 1000));
            if (_this.animating)
                _this.animate();
        });
    };
    Canvas.prototype.start = function () {
        this.startDate = Date.now();
        this.animating = true;
        this.animate();
    };
    Canvas.prototype.stop = function () {
        this.animating = false;
    };
    return Canvas;
}(Container));
