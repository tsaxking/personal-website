var ThreeDPoint = /** @class */ (function () {
    function ThreeDPoint(point) {
        if (point.x < 0)
            point.x = 0;
        if (point.x > 1)
            point.x = 1;
        if (point.y < 0)
            point.y = 0;
        if (point.y > 1)
            point.y = 1;
        if (point.z === undefined)
            point.z = 0;
        this.x = point.x;
        this.y = point.y;
        this.z = point.z;
    }
    return ThreeDPoint;
}());
