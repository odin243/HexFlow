//HF.visual namespaces
window.HF = window.HF || {};
window.HF.visual = window.HF.visual || {};

HF.visual.scene = function()
{
    return {
        // center is a point object
        // scale should be the distance from corner to corner
        getHexCorners: function(center, scale)
        {
            var points = [];
            for (var i = 0; i < 6; i++)
            {
                var angle = 2 * Math.PI * (2 * i) / 12;
                points.push(HF.visual.point(
                    center.x + 0.5 * scale * Math.cos(angle),
                    center.y + 0.5 * scale * Math.sin(angle)));
            }
            return points;
        },

        makeHexShapeString: function(scale)
        {
            return this.getHexCorners(HF.visual.point(0, 0), scale)
                .map(function(point) {
                    return point.x.toFixed(3) + ',' + point.y.toFixed(3);
                })
                .join(' ');
        }

    };
};
