window.HF = window.HF || {};

HF.hex = function (q, r, s) {
    var hex = HF.hex;
    return {
        q: q,
        r: r,
        s: s,

        add: function(otherHex) {
            return hex(this.q + otherHex.q, this.r + otherHex.r, this.s + otherHex.s);
        },

        subtract: function(otherHex) {
            return this.add(otherHex.scale(-1));
        },

        scale: function(k) {
            return hex(this.q * k, this.r * k, this.s * k);
        },

        neighbor: function(directionIndex) {
            return this.add(HF.hexDirection(directionIndex));
        },

        diagonalNeighbor: function(diagonalIndex) {
            return this.add(HF.hexDiagonal(diagonalIndex));
        },

        length: function() {
            return Math.floor((Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2);
        },

        distance: function(otherHex) {
            return this.subtract(otherHex).length();
        },

        round: function() {
            var roundedQ = Math.floor(Math.round(this.q));
            var roundedR = Math.floor(Math.round(this.r));
            var roundedS = Math.floor(Math.round(this.s));
            var qDiff = Math.abs(roundedQ - this.q);
            var rDiff = Math.abs(roundedR - this.r);
            var sDiff = Math.abs(roundedS - this.s);
            if (qDiff > rDiff && qDiff > sDiff)
            {
                roundedQ = -roundedR - roundedS;
            } else if (rDiff > sDiff)
            {
                roundedR = -roundedQ - roundedS;
            } else
            {
                roundedS = -roundedQ - roundedR;
            }
            return hex(roundedQ, roundedR, roundedS);
        },

        lerp: function(otherHex, t) {
            return hex(this.q + (otherHex.q - this.q) * t, this.r + (otherHex.r - this.r) * t, this.s + (otherHex.s - this.s) * t);
        },

        linedraw: function(otherHex) {
            var n = this.distance(otherHex);
            var results = [];
            var step = 1.0 / Math.max(n, 1);
            for (var i = 0; i <= n; i++)
            {
                results.push(this.lerp(otherHex, step * i).round());
            }
            return results;
        }
    };
};
HF.hexDirections = [
    HF.hex(1, 0, -1),
    HF.hex(1, -1, 0),
    HF.hex(0, -1, 1),
    HF.hex(-1, 0, 1),
    HF.hex(-1, 1, 0),
    HF.hex(0, 1, -1)
];

HF.hexDirection = function (directionIndex) {
    return HF.hexDirections[directionIndex];
};

HF.nullDirection = HF.hex(0, 0, 0);

HF.hexDiagonals = [
    HF.hex(2, -1, -1),
    HF.hex(1, -2, 1),
    HF.hex(-1, -1, 2),
    HF.hex(-2, 1, 1),
    HF.hex(-1, 2, -1),
    HF.hex(1, 1, -2)
];

HF.hexDiagonal = function (diagonalIndex) {
    return HF.hexDiagonals[diagonalIndex];
};