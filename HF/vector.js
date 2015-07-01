//HF Namespace
window.HF = window.HF || {};

HF.vector = function(direction, magnitude)
{
    var debug = HF.config.debug === true;

    if (debug)
    {
        if (magnitude != undefined && isNaN(magnitude))
        {
            console.error('HF.vector - invalid argument - returning null');
            return null;
        }
    }
    
    this.direction = direction || new HF.hexPoint();
    this.magnitude = magnitude || 0;    
};

HF.vector.prototype = {
    add: function (otherVector)
    {
        if (HF.config.debug)
        {
            if (otherVector == undefined)
            {
                console.error('HF.vector.add - invalid argument - returning null');
                return null;
            }
        }

        if (this.magnitude === 0)
            return otherVector;

        if (otherVector.magnitude === 0)
            return this;

        var thisEndPoint = this.getEndPoint();
        var otherEndPoint = otherVector.getEndPoint();

        var combinedEndPoint = thisEndPoint.add(otherEndPoint);


        var newMagnitude = combinedEndPoint.length();

        if (newMagnitude < 0.01)
            return new HF.vector();


        var newDirection = combinedEndPoint.toUnit();

        return new HF.vector(newDirection, newMagnitude);//, combinedOffset);
    },

    scale: function (scalar)
    {
        return new HF.vector(this.direction, this.magnitude * scalar);
    },

    getEndPoint: function()
    {
        var fromOrigin = this.direction.scale(this.magnitude);
        return fromOrigin;
    },

    subtract: function(otherVector)
    {
        return this.add(otherVector.scale(-1));
    },

    getFaceAffinities: function ()
    {
        var faceAffinities = {};

        if (Math.abs(this.direction.q - 1) < 0.001)
        {
            faceAffinities.direction1 = HF.directions.face('ur');
            faceAffinities.direction2 = HF.directions.face('r');
        }
        else if (Math.abs(this.direction.r - 1) < 0.001)
        {
            faceAffinities.direction1 = HF.directions.face('ul');
            faceAffinities.direction2 = HF.directions.face('l');
        }
        else if (Math.abs(this.direction.s - 1) < 0.001)
        {
            faceAffinities.direction1 = HF.directions.face('ll');
            faceAffinities.direction2 = HF.directions.face('lr');
        }
        else if (Math.abs(this.direction.q + 1) < 0.001)
        {
            faceAffinities.direction1 = HF.directions.face('l');
            faceAffinities.direction2 = HF.directions.face('ll');
        }
        else if (Math.abs(this.direction.r + 1) < 0.001)
        {
            faceAffinities.direction1 = HF.directions.face('r');
            faceAffinities.direction2 = HF.directions.face('lr');
        }
        else if (Math.abs(this.direction.s + 1) < 0.001)
        {
            faceAffinities.direction1 = HF.directions.face('ul');
            faceAffinities.direction2 = HF.directions.face('ur');
        }
        else
            throw 'Invalid Direction';

        faceAffinities.affinity1 = 1 - this.direction.subtract(faceAffinities.direction1).length();
        faceAffinities.affinity2 = 1 - this.direction.subtract(faceAffinities.direction2).length();

        return faceAffinities;
    }
};