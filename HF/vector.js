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

    findFirstFace: function ()
    {
        if (this.direction.q == 1)
        {
            if (this.direction.r > this.direction.s)
                return HF.directions.face('ur');
            else
                return HF.directions.face('r');
        }
        if (this.direction.r == 1)
        {
            if (this.direction.s > this.direction.q)
                return HF.directions.face('l');
            else
                return HF.directions.face('ul');
        }
        if (this.direction.s == 1)
        {
            if (this.direction.q > this.direction.r)
                return HF.directions.face('lr');
            else
                return HF.directions.face('ll');
        }
        if (this.direction.q == -1)
        {
            if (this.direction.r > this.direction.s)
                return HF.directions.face('ll');
            else
                return HF.directions.face('l');
        }
        if (this.direction.r == -1)
        {
            if (this.direction.s > this.direction.q)
                return HF.directions.face('r');
            else
                return HF.directions.face('lr');
        }
        if (this.direction.s == -1)
        {
            if (this.direction.q > this.direction.r)
                return HF.directions.face('ur');
            else
                return HF.directions.face('ul');
        }
        return new HF.hexPoint();
    },

    findSecondFace: function ()
    {
        if (this.direction.q == 1)
        {
            if (this.direction.r > this.direction.s)
                return HF.directions.face('r');
            else
                return HF.directions.face('ur');
        }
        if (this.direction.r == 1)
        {
            if (this.direction.s > this.direction.q)
                return HF.directions.face('ul');
            else
                return HF.directions.face('l');
        }
        if (this.direction.s == 1)
        {
            if (this.direction.q > this.direction.r)
                return HF.directions.face('ll');
            else
                return HF.directions.face('lr');
        }
        if (this.direction.q == -1)
        {
            if (this.direction.r > this.direction.s)
                return HF.directions.face('l');
            else
                return HF.directions.face('ll');
        }
        if (this.direction.r == -1)
        {
            if (this.direction.s > this.direction.q)
                return HF.directions.face('lr');
            else
                return HF.directions.face('r');
        }
        if (this.direction.s == -1)
        {
            if (this.direction.q > this.direction.r)
                return HF.directions.face('ul');
            else
                return HF.directions.face('ur');
        }
        return new HF.hexPoint();
    }
};