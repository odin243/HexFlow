//HF Namespace
window.HF = window.HF || {};

HF.hexPoint = function(q, r, s)
{
    if ((q != undefined && isNaN(q)) ||
    (r != undefined && isNaN(r)) ||
    (s != undefined && isNaN(s)))
    {
        console.error('HF.hexPoint - invalid arguments - returning null');
        return null;
    }

    var hexPoint = {
        addCoordinates: function(q, r, s)
        {
            if ((q == undefined || isNaN(q)) || (r == undefined || isNaN(r)) || (s == undefined || isNaN(s)))
            {
                console.error('HF.hexPoint.addCoordinates - invalid arguments - returning null');
                return null;
            }

            return HF.hexPoint(this.q + q, this.r + r, this.s + s);
        },

        add: function(otherPoint)
        {
            if (otherPoint == undefined)
            {
                console.error('HF.hexPoint.add - invalid argument - returning null');
                return null;
            }

            return this.addCoordinates(otherPoint.q, otherPoint.r, otherPoint.s);
        },

        scale: function(scalar)
        {
            if (scalar == undefined || isNaN(scalar))
            {
                console.error('HF.hexPoint.scale - invalid argument - returning null');
                return null;
            }

            return HF.hexPoint(this.q * scalar, this.r * scalar, this.s * scalar);
        },

        subtract: function(otherPoint)
        {
            if (otherPoint == undefined)
            {
                console.error('HF.hexPoint.subtract - invalid argument - returning null');
                return null;
            }

            return this.add(otherPoint.invert());
        },

        invert: function()
        {
            return this.scale(-1);
        },

        length: function()
        {
            return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
        },

        //This method returns the point on the unit circle which intersects the path from the origin.
        //I.e. the end of the unit direction vector towards this point
        toUnit: function()
        {
            var magnitude = this.length();
            var direction = magnitude !== 0 ? this.scale(1 / magnitude) : HF.hexPoint();
            direction = direction.validate();
            return direction;
        },

        validate: function()
        {
            //Nothing to validate if all are 0
            if (this.q === 0 && this.r === 0 && this.s === 0)
                return this;

            var coords = { q: this.q, r: this.r, s: this.s };

            var largestCoord;
            var smallestCoord;
            var largestValue = 0;
            var smallestValue = 1;
            for (var coord in coords)
            {
                var value = Math.abs(coords[coord]);
                if (value > largestValue)
                    largestCoord = coord;
                if (value < smallestValue)
                    smallestCoord = coord;
            }

            var middleCoord;
            for (var coord in coords)
            {
                middleCoord = coord != largestCoord && coord != smallestCoord ? coord : middleCoord;
            }

            var newCoords = {};
            newCoords[largestCoord] = this[largestCoord] > 0 ? 1 : -1;
            newCoords[middleCoord] = this[middleCoord];
            newCoords[smallestCoord] = -this[largestCoord] -this[middleCoord];

            return HF.hexPoint(newCoords.q, newCoords.r, newCoords.s);
        },

        round: function()
        {
            var roundedQ = Math.floor(Math.round(this.q));
            var roundedR = Math.floor(Math.round(this.r));
            var roundedS = Math.floor(Math.round(this.s));
            var qDiff = Math.abs(roundedQ - this.q);
            var rDiff = Math.abs(roundedR - this.r);
            var sDiff = Math.abs(roundedS - this.s);
            if (qDiff > rDiff && qDiff > sDiff)
            {
                roundedQ = -roundedR - roundedS;
            }
            else if (rDiff > sDiff)
            {
                roundedR = -roundedQ - roundedS;
            }
            else
            {
                roundedS = -roundedQ - roundedR;
            }
            return HF.hexPoint(roundedQ, roundedR, roundedS);
        },

        toString: function()
        {
            return this.q + '_' + this.r + '_' + this.s;
        },

        equals: function (point)
        {
            return this.q == point.q && this.r == point.r && this.s == point.s;
        }
    };

    Object.defineProperties(hexPoint,
        {
            "q":
            {
                value: q || 0,
                writable: false,
                configurable: false
            },
            "r":
            {
                value: r || 0,
                writable: false,
                configurable: false
            },
            "s":
            {
                value: s || 0,
                writable: false,
                configurable: false
            }
        });

    return hexPoint;
};

HF.hexPoint.fromString = function(coordinates)
{
    if (coordinates == undefined)
    {
        console.error('HF.hexPoint.fromString - missing argument - returning null');
        return null;
    }

    var coordinateArray = coordinates.split('_');

    if (coordinateArray.length !== 3 || isNaN(coordinateArray[0]) || isNaN(coordinateArray[1]) || isNaN(coordinateArray[2]))
    {
        console.error('HF.hexPoint.fromString - invalid argument - returning null');
        return null;
    }

    return HF.hexPoint(coordinateArray[0], coordinateArray[1], coordinateArray[2]);
};