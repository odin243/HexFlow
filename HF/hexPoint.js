//HF Namespace
HF = this.HF != undefined ? this.HF : {};

HF.hexPoint = function (q, r, s)
{
    if ((q != undefined && isNaN(q)) ||
        (r != undefined && isNaN(r)) ||
        (s != undefined && isNaN(s)))
    {
        console.error("HF.hexPoint - invalid arguments - returning null");
        return null;
    }

    return {
        q: q || 0,
        r: r || 0,
        s: s || 0,

        addCoordinates: function (q, r, s)
        {
            if ((q == undefined || isNaN(q)) || (r == undefined || isNaN(r)) || (s == undefined || isNaN(s)))
            {
                console.error("HF.hexPoint.addCoordinates - invalid arguments - returning null");
                return null;
            }

            return HF.hexPoint(this.q + q, this.r + r, this.s + s);
        },

        add: function (otherPoint)
        {
            if (otherPoint == undefined)
            {
                console.error("HF.hexPoint.add - invalid argument - returning null");
                return null;
            }

            return this.addCoordinates(otherPoint.q, otherPoint.r, otherPoint.s);
        },

        scale: function (scalar)
        {
            if (scalar == undefined || isNaN(scalar))
            {
                console.error("HF.hexPoint.scale - invalid argument - returning null");
                return null;
            }

            return HF.hexPoint(this.q * scalar, this.r * scalar, this.s * scalar);
        },

        invert: function ()
        {
            return this.scale(-1);
        },

        duplicate: function ()
        {
            return HF.hexPoint(this.q, this.r, this.s);
        },

        validate: function ()
        {
            //Nothing to validate if all are 0
            if (this.q == 0 && this.r == 0 && this.s == 0)
                return this;

            var newPoint = this.duplicate();

            if (Math.abs(newPoint.q) > Math.abs(newPoint.r))
            {
                if (Math.abs(newPoint.q) > Math.abs(newPoint.s))
                {
                    newPoint.q = -newPoint.r - newPoint.s;
                }
                else
                {
                    newPoint.s = -newPoint.q - newPoint.r;
                }
            }
            else
            {
                if (Math.abs(newPoint.r) > Math.abs(newPoint.s))
                {
                    newPoint.r = -newPoint.q - newPoint.s;
                }
                else
                {
                    newPoint.s = -newPoint.q - newPoint.r;
                }
            }

            return newPoint;
        },

        toString: function ()
        {
            return q + "_" + r + "_" + s;
        }
    };
};

HF.hexPoint.fromString = function (coordinates)
{
    if (coordinates == undefined)
    {
        console.error("HF.hexPoint.fromString - missing argument - returning null");
        return null;
    }

    var coordinateArray = coordinates.split("_");

    if (coordinateArray.length != 3 || isNaN(coordinateArray[0]) || isNaN(coordinateArray[1]) ||isNaN(coordinateArray[2]))
    {
        console.error("HF.hexPoint.fromString - invalid argument - returning null");
        return null;
    }

    return HF.hexPoint(coordinateArray[0], coordinateArray[1], coordinateArray[2]);
};