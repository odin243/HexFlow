//HF Namespace
HF = this.HF != undefined ? this.HF : {};

HF.hexPoint = function (q, r, s)
{
    return {
        q: q,
        r: r,
        s: s,

        addCoordinates: function (q, r, s)
        {
            return HF.hexPoint(this.q + q, this.r + r, this.s + s);
        },

        add: function (otherPoint)
        {
            return this.addCoordinates(otherPoint.q, otherPoint.r, otherPoint.s);
        },

        scale: function (scalar)
        {
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
        }
    };
};