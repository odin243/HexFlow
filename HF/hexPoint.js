//HF Namespace
window.HF = window.HF || {};

HF.hexPoint = function(q, r, s)
{
    var debug = HF.config.debug === true;
    
    if (debug)
    {
        if ((q != undefined && isNaN(q)) ||
        (r != undefined && isNaN(r)) ||
        (s != undefined && isNaN(s)))
        {
            console.error('HF.hexPoint - invalid arguments - returning null');
            return null;
        }
    }

    this.q = q || 0; 
    this.r = r || 0; 
    this.s = s || 0; 
};

HF.hexPoint.prototype = {
    toString: function ()
    {
        if (this.string === undefined)
            this.string = this.q + '_' + this.r + '_' + this.s;
        return this.string;
    },
    addCoordinates: function (q, r, s)
    {
        if (HF.config.debug)
        {
            if ((q == undefined || isNaN(q)) || (r == undefined || isNaN(r)) || (s == undefined || isNaN(s)))
            {
                console.error('HF.hexPoint.addCoordinates - invalid arguments - returning null');
                return null;
            }
        }

        return new HF.hexPoint(this.q + q, this.r + r, this.s + s);
    },

    add: function (otherPoint)
    {
        if (HF.config.debug)
        {
            if (otherPoint == undefined)
            {
                console.error('HF.hexPoint.add - invalid argument - returning null');
                return null;
            }
        }

        return this.addCoordinates(otherPoint.q, otherPoint.r, otherPoint.s);
    },

    scale: function (scalar)
    {
        if (HF.config.debug)
        {
            if (scalar == undefined || isNaN(scalar))
            {
                console.error('HF.hexPoint.scale - invalid argument - returning null');
                return null;
            }
        }

        return new HF.hexPoint(this.q * scalar, this.r * scalar, this.s * scalar);
    },

    subtract: function (otherPoint)
    {
        if (!otherPoint)
            return this;

        return this.add(otherPoint.invert());
    },

    invert: function ()
    {
        return this.scale(-1);
    },

    length: function ()
    {
        return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
    },

    //This method returns the point on the unit circle which intersects the path from the origin.
    //I.e. the end of the unit direction vector towards this point
    toUnit: function ()
    {
        var magnitude = this.length();
        if (magnitude === 1)
            return this;
        if (magnitude === 0)
            return new HF.hexPoint();

        var direction = this.scale(1 / magnitude);
        direction = direction.validate();
        return direction;
    },

    validate: function ()
    {
        //Nothing to validate if all are 0
        if (this.q === 0 && this.r === 0 && this.s === 0)
            return this;

        var absQ = Math.abs(this.q);
        var absR = Math.abs(this.r);
        var absS = Math.abs(this.s);
        
        var largestCoord;
        var smallestCoord;
        var middleCoord;
        if (absQ > absR)
        {
            if (absQ > absS) //absQ > (absR, absS)
            {
                largestCoord = 'q';
                if (absR > absS) //absQ > absR > absS
                {
                    middleCoord = 'r';
                    smallestCoord = 's';
                    
                }
                else // absQ > absS > absR
                {
                    middleCoord = 's';
                    smallestCoord = 'r';
                }
            }
            else //absS > absQ > absR
            {
                largestCoord = 's';
                middleCoord = 'q';
                smallestCoord = 'r';
            }
        }
        else //absR > absQ
        {
            if (absR > absS) //absR > (absQ, absS)
            {
                largestCoord = 'r';
                if (absQ > absS) //absR > absQ > absS
                {
                    middleCoord = 'q';
                    smallestCoord = 's';
                }
                else //absR > absS > absQ
                {
                    middleCoord = 's';
                    smallestCoord = 'q';
                }
            }
            else //absS > absR > absQ
            {
                largestCoord = 's';
                middleCoord = 'r';
                smallestCoord = 'q';
            }
        }

        var newCoords = {};
        newCoords[largestCoord] = this[largestCoord] > 0 ? 1 : -1;
        newCoords[middleCoord] = this[middleCoord];
        newCoords[smallestCoord] = -this[largestCoord] - this[middleCoord];

        return new HF.hexPoint(newCoords.q, newCoords.r, newCoords.s);
    },

    round: function ()
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
        return new HF.hexPoint(roundedQ, roundedR, roundedS);
    },

    equals: function (point, round)
    {
        if (round === true)
            return this.round().equals(point.round());

        return this.q === point.q && this.r === point.r && this.s === point.s;
    }
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

    return new HF.hexPoint(parseInt(coordinateArray[0]), parseInt(coordinateArray[1]), parseInt(coordinateArray[2]));
};