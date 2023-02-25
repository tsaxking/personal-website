class Curve {
    constructor(points) {
        this.points = points;
    }

    static linear(frames, from, to) {
        return new Curve(new Array(frames).fill(0).map((_, i) => {
            return {
                x: i,
                y: from + (to - from) / frames * i
            }
        }));
    }

    static polynomial(frames, from, to, ...coefficients) {
        const maxPower = coefficients.length - 1;
        return new Curve(new Array(frames).fill().map((_, i) => {
            // create a polynomial function
            const polynomial = coefficients.reduce((acc, coeff, power) => {
                return acc + coeff * Math.pow(i / frames, power);
            }, 0);

            return {
                x: i,
                y: from + (to - from) * polynomial
            }
        }));
    }

    static exponential(frames, from, to, base) {
        return new Curve(new Array(frames).fill().map((_, i) => {
            return {
                x: i,
                y: from + (to - from) * Math.pow(base, i / frames)
            }
        }));
    }

    static logarithmic(frames, from, to, base) {
        return new Curve(new Array(frames).fill().map((_, i) => {
            return {
                x: i,
                y: from + (to - from) * Math.log(i / frames) / Math.log(base)
            }
        }));
    }

    static sinusoidal(frames, from, to) {
        return new Curve(new Array(frames).fill().map((_, i) => {
            return {
                x: i,
                y: from + (to - from) * Math.sin(i / frames * Math.PI)
            }
        }));
    }

    static circular(frames, from, to) {
        return new Curve(new Array(frames).fill().map((_, i) => {
            return {
                x: i,
                y: from + (to - from) * (1 - Math.sqrt(1 - Math.pow(i / frames, 2)))
            }
        }));
    }
}