var TwoDPoint = /** @class */ (function () {
    function TwoDPoint(point) {
        if (point.x < 0)
            point.x = 0;
        if (point.x > 1)
            point.x = 1;
        if (point.y < 0)
            point.y = 0;
        if (point.y > 1)
            point.y = 1;
        this.x = point.x;
        this.y = point.y;
    }
    return TwoDPoint;
}());
