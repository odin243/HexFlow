HF.point = function(q, r, s)
{
    return 
    {
        q = q,
        r = r,
        s = s,

        add = function (q, r, s) {
            return HF.point(this.q + q, this.r + r, this.s + s);
        },

        addPoint = function (otherPoint) {
            return this.add(otherPoint.q, otherPoint.r, otherPoint.s);
        },

        scale = function (scalar)
        {
            return HF.point(this.q * scalar, this.r * scalar, this.s * scalar)
        }

        invert = function ()
        {
            return this.scale(-1);
        }
    };
};