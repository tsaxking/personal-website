var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CanvasElement_position, _CanvasElement_visible;
var CanvasElement = /** @class */ (function () {
    function CanvasElement(position) {
        _CanvasElement_position.set(this, { x: 0, y: 0, z: 0 });
        _CanvasElement_visible.set(this, void 0);
        this.position = position;
        __classPrivateFieldSet(this, _CanvasElement_visible, true, "f");
    }
    Object.defineProperty(CanvasElement.prototype, "position", {
        get: function () {
            return __classPrivateFieldGet(this, _CanvasElement_position, "f");
        },
        set: function (value) {
            value = new ThreeDPoint(value);
            __classPrivateFieldSet(this, _CanvasElement_position, value, "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasElement.prototype, "visible", {
        get: function () {
            return __classPrivateFieldGet(this, _CanvasElement_visible, "f");
        },
        set: function (value) {
            if (value)
                this.show();
            else
                this.hide();
        },
        enumerable: false,
        configurable: true
    });
    CanvasElement.prototype.hide = function () {
        __classPrivateFieldSet(this, _CanvasElement_visible, false, "f");
    };
    CanvasElement.prototype.show = function () {
        __classPrivateFieldSet(this, _CanvasElement_visible, true, "f");
    };
    CanvasElement.prototype.draw = function (canvas) {
        // draw this element
    };
    CanvasElement.prototype.moveTo = function (point) {
        this.position = point;
    };
    return CanvasElement;
}());
_CanvasElement_position = new WeakMap(), _CanvasElement_visible = new WeakMap();
