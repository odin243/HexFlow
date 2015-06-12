//HF Namespace
window.HF = window.HF || {};

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

        subtract: function (otherPoint)
        {
            if (otherPoint == undefined)
            {
                console.error("HF.hexPoint.subtract - invalid argument - returning null");
                return null;
            }

            return this.add(otherPoint.invert());
        },

        invert: function ()
        {
            return this.scale(-1);
        },

        length: function ()
        {
            return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s))/2;
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

        validate: function ()
        {
            //Nothing to validate if all are 0
            if (this.q === 0 && this.r === 0 && this.s === 0)
                return this;

            var newQ = this.q, newR = this.r, newS = this.s;

            if (Math.abs(newQ) > Math.abs(newR))
            {
                if (Math.abs(newQ) > Math.abs(newS))
                {
                    newQ = -newR - newS;
                }
                else
                {
                    newS = -newQ - newR;
                }
            }
            else
            {
                if (Math.abs(newR) > Math.abs(newS))
                {
                    newR = -newQ - newS;
                }
                else
                {
                    newS = -newQ - newR;
                }
            }

            return HF.hexPoint(newQ, newR, newS);
        },

        toString: function ()
        {
            return this.q + "_" + this.r + "_" + this.s;
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

    if (coordinateArray.length !== 3 || isNaN(coordinateArray[0]) || isNaN(coordinateArray[1]) ||isNaN(coordinateArray[2]))
    {
        console.error("HF.hexPoint.fromString - invalid argument - returning null");
        return null;
    }

    return HF.hexPoint(coordinateArray[0], coordinateArray[1], coordinateArray[2]);
};