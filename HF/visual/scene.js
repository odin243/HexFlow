//HF.visual namespaces
window.HF = window.HF || {};
window.HF.visual = window.HF.visual || {};

//origin (required) - the pixel location of the center of the scene
//scale (optional) - if not provided, HF.configl.hexScale will be used
//flatTop (optional) - if true, flat topped hexes will be used. Pointy topped hexes are the default.
HF.visual.scene = function(origin, flatTop)
{
    //this creates an orientation matrix object
    var createOrientation = function(f0, f1, f2, f3, b0, b1, b2, b3, startAngle)
    {
        return { f0: f0, f1: f1, f2: f2, f3: f3, b0: b0, b1: b1, b2: b2, b3: b3, startAngle: startAngle };
    };
    //var layoutPointy = createOrientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);
    //var layoutFlat = createOrientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);

    var isFlatLayout = flatTop === true;
    var orientation = isFlatLayout
        ? createOrientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0)
        : createOrientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);

    return {
        size: HF.config.hexSize || 50,
        orientationOffset: isFlatLayout ? 0 : 1,
        orientation: orientation,
        origin: origin,

        //Gets the pixel coordinates of the center of the hex
        getHexCenter: function (hexPoint)
        {
            var m = this.orientation;
            var size = this.size;
            //var x = this.size * Math.sqrt(1.5) * (hexPoint.r - hexPoint.q);
            //var y = this.size * (0.5 * (hexPoint.r + hexPoint.q) - hexPoint.s);
            var x = (m.f0 * hexPoint.q + m.f1 * hexPoint.s) * size;
            var y = (m.f2 * hexPoint.q + m.f3 * hexPoint.s) * size;
            return HF.visual.point(x, y).add(this.origin);
        },

        //returns a hexpoint that corresponds to a given pixel location
        getHexAtPoint: function(pixelPoint)
        {
            var m = this.orientation;
            var size = this.size;
            var origin = this.origin;
            var x = (pixelPoint.x - origin.x) / size;
            var y = (pixelPoint.y - origin.y) / size;
            var q = m.b0 * x + m.b1 * y;
            var s = m.b2 * x + m.b3 * y;
            return HF.hexPoint(q, -q - s, s);
        },
        
        getHexCorners: function(hexPoint)
        {
            var m = this.orientation;
            var size = this.size;
            var getCornerOffset = function(cornerIndex)
            {
                var angle = 2.0 * Math.PI * (cornerIndex + m.startAngle) / 6;
                return HF.visual.point(size * Math.cos(angle), size * Math.sin(angle));
            }

            var center = this.getHexCenter(hexPoint);
            var corners = [];
            for (var i = 0; i < 6; i++)
            {
                var offset = getCornerOffset(i);
                corners.push(center.add(offset));
            }

            return corners;
        },

        makeHexShapeString: function(hexPoint)
        {
            return this.getHexCorners(hexPoint)
                .map(function(point) {
                    return point.x.toFixed(3) + ',' + point.y.toFixed(3);
                })
                .join(' ');
        },

        getHexColor: function(hexTile)
        {
            var maxPower = HF.config.hexFullPower || 100;
            var maxColor = HF.config.hexFullColor || '#000000';
            var scale = d3.scale.linear()
                .domain([0, maxPower])
                .interpolate(d3.interpolateRgb)
                .range(['#FFFFFF', maxColor]);
            var power = Math.min(hexTile.power, maxPower);
            power = Math.max(power, 0);
            var color = scale(power);
            return color;
        },

        //Returns an array of shape strings corresponding to the hexagons on a map
        drawTiles: function(svgSelection, hexMap)
        {
            var scene = this;
            var tiles = hexMap.toArray();

            var polygonSelection =
                svgSelection.selectAll('polygon')
                    .data(tiles, function(tile) {
                        return tile.getIdentifier();
                    });

            //First draw any missing tiles
            polygonSelection.enter()
                .append('svg:polygon')
                .attr('id', function(tile) {
                    return tile.getIdentifier();
                })
                .attr('points', function(tile) {
                    return scene.makeHexShapeString(tile.location);
                });

            //Next update the tile attributes
            polygonSelection.attr('fill', function(tile) {
                return scene.getHexColor(tile);
            });

            //Remove any old tiles
            polygonSelection.exit().remove();
        },

        // containerSelector is a selector that d3 can use to find the container element
        drawMap: function(hexMap, containerSelector)
        {
            var containerSelection = d3.select(containerSelector);

            var svgSelection = containerSelection.select('svg');
            if (svgSelection.empty())
                svgSelection = containerSelection
                    .append('svg')
                    .attr('width', '100%')
                    .attr('height', '100%');

            this.drawTiles(svgSelection, hexMap);

            svgSelection
                .style('fill', 'none')
                .style('stroke', 'black');
        }

    };
};
