//HF.visual namespaces
window.HF = window.HF || {};
window.HF.visual = window.HF.visual || {};

HF.visual.point = function(x, y)
{
    return {
        x: x || 0,
        y: y || 0,
        equals: function(otherPoint)
        {
            return this.x === otherPoint.x && this.y === otherPoint.y;
        },
        toString: function()
        {
            return this.x + ',' + this.y;
        },
        lengthSquared: function()
        {
            return this.x * this.x + this.y * this.y;
        },
        length: function()
        {
            return Math.sqrt(this.lengthSquared());
        },
        normalize: function()
        {
            var d = this.length();
            return HF.visual.point(this.x / d, this.y / d);
        },
        scale: function(d)
        {
            return HF.visual.point(this.x * d, this.y * d);
        },
        rotateLeft: function()
        {
            return HF.visual.point(this.y, -this.x);
        },
        rotateRight: function()
        {
            return HF.visual.point(-this.y, this.x);
        },
        add: function(otherPoint)
        {
            return HF.visual.point(this.x + otherPoint.x, this.y + otherPoint.y);
        },
        subtract: function(otherPoint)
        {
            return HF.visual.point(this.x - otherPoint.x, this.y - otherPoint.y);
        },
        dot: function(otherPoint)
        {
            return this.x * otherPoint.x + this.y * otherPoint.y;
        },
        cross: function(otherPoint)
        {
            return this.x * otherPoint.y - this.y * otherPoint.x;
        },
        distance: function(otherPoint)
        {
            return this.subtract(otherPoint).length();
        }
    };
};

