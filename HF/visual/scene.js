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
        borderWidth: HF.config.hexBorderWidth || 5,
        orientationOffset: isFlatLayout ? 0 : 1,
        orientation: orientation,
        origin: origin,

        //Gets the pixel coordinates of the center of the hex
        getHexCenter: function (hexPoint)
        {
            if (hexPoint.center == undefined)
            {
                var m = this.orientation;
                var size = this.size;
                //var x = this.size * Math.sqrt(1.5) * (hexPoint.r - hexPoint.q);
                //var y = this.size * (0.5 * (hexPoint.r + hexPoint.q) - hexPoint.s);
                var x = (m.f0 * hexPoint.q + m.f1 * hexPoint.s) * size;
                var y = (m.f2 * hexPoint.q + m.f3 * hexPoint.s) * size;
                hexPoint.center = HF.visual.point(x, y).add(this.origin);
            }
            return hexPoint.center;
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
            return new HF.hexPoint(q, -q - s, s);
        },

        getHexCornerOffset: function(cornerIndex, isBorderCorner)
        {
            var m = this.orientation;
            var size = this.size;
            if (isBorderCorner !== true)
                size = size - (this.borderWidth * 2);
            var angle = 2.0 * Math.PI * (cornerIndex + m.startAngle) / 6;
            return HF.visual.point(size * Math.cos(angle), size * Math.sin(angle));
        },
        
        getHexCorners: function(hexPoint, isBorderCorner)
        {
            var cornersKey = isBorderCorner === true ? 'borderCornerPoints' : 'innerCornerPoints';
            if (hexPoint[cornersKey] == undefined)
            {
                var center = this.getHexCenter(hexPoint);
                var corners = [];
                for (var i = 0; i < 6; i++)
                {
                    var offset = this.getHexCornerOffset(i, isBorderCorner);
                    corners.push(center.add(offset));
                }

                hexPoint[cornersKey] = corners;
            }

            return hexPoint[cornersKey];
        },

        makeHexShapeString: function(hexPoint)
        {
            return this.getHexCorners(hexPoint)
                .map(function(point) {
                    return point.x.toFixed(3) + ',' + point.y.toFixed(3);
                })
                .join(' ');
        },

        //Gets the points that make up a side border panel of the hex
        getSideBorderPoints: function(hexPoint, faceIndex)
        {
            var innerCorners = this.getHexCorners(hexPoint);
            var borderCorners = this.getHexCorners(hexPoint, true);
            var firstCornerIndex = (faceIndex + 5) % 6;
            var secondCornerIndex = faceIndex;
            return [
                innerCorners[firstCornerIndex],
                borderCorners[firstCornerIndex],
                borderCorners[secondCornerIndex],
                innerCorners[secondCornerIndex]
            ];
        },

        makeSideBorderShapeString: function(hexPoint, faceIndex)
        {
            return this.getSideBorderPoints(hexPoint, faceIndex)
                .map(function(point) {
                    return point.x.toFixed(3) + ',' + point.y.toFixed(3);
                })
                .join(' ');
        },

        makeShapeStringForHexPart: function(hexPart)
        {
            var tile = hexPart.tile;
            if (hexPart.index === -1)
            {
                return this.makeHexShapeString(tile.location);
            }
            else if (this.borderWidth > 0)
            {
                return this.makeSideBorderShapeString(tile.location, hexPart.index);
            }
            else
                return '';
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

        getFlowColor: function(flow, faceIndex)
        {
            var face = HF.directions.faceByIndex(faceIndex);
            var flowDispersions = flow.disperse();
            var dispersionsTowardsFace = flowDispersions.filter(function(vector) {
                return face.equals(vector.direction, true);
            });
            if (dispersionsTowardsFace.length < 1)
            {
                return '#FFFFFF';
            }
            flow = dispersionsTowardsFace[0];

            var maxMagnitude = HF.config.hexFullFlow || 100;
            var maxColor = HF.config.hexFlowColor || '#000000';
            var scale = d3.scale.linear()
                .domain([0, maxMagnitude])
                .interpolate(d3.interpolateRgb)
                .range(['#FFFFFF', maxColor]);
            var magnitude = Math.min(flow.magnitude, maxMagnitude);
            magnitude = Math.max(magnitude, 0);
            var color = scale(magnitude);
            return color;
        },

        getHexPartColor: function(hexPart)
        {
            var tile = hexPart.tile;
            if (hexPart.index === -1)
            {
                return this.getHexColor(tile);
            }
            else
            {
                return this.getFlowColor(tile.flow, hexPart.index);
            }
        },

        //Returns an array of shape strings corresponding to the hexagons on a map
        drawTiles: function(svgSelection, hexMap)
        {
            var scene = this;
            var tiles = hexMap.toArray();

            //Add a group element for each tile
            var groupSelection =
                svgSelection.selectAll('g')
                    .data(tiles, function(tile) {
                        return tile.getIdentifier();
                    });
            groupSelection.enter()
                .append('g');

            //Add a polygon element per hex part to each group
            var polygonSelection = groupSelection.selectAll('polygon')
                .data(function(tile) {
                        return [
                            { tile: tile, index: -1, id: tile.getIdentifier() + '_body' },
                            { tile: tile, index: 0, id: tile.getIdentifier() + '_face0' },
                            { tile: tile, index: 1, id: tile.getIdentifier() + '_face1' },
                            { tile: tile, index: 2, id: tile.getIdentifier() + '_face2' },
                            { tile: tile, index: 3, id: tile.getIdentifier() + '_face3' },
                            { tile: tile, index: 4, id: tile.getIdentifier() + '_face4' },
                            { tile: tile, index: 5, id: tile.getIdentifier() + '_face5' }
                        ];
                    },
                    function(hexPart) {
                        return hexPart.id;
                    });
            //Draw each hex part
            polygonSelection.enter()
                .append('polygon')
                .attr('id', function(hexPart) {
                    return hexPart.id;
                })
                .attr('points', function(hexPart) {
                    return scene.makeShapeStringForHexPart(hexPart);
                });

            //Next update the tile attributes
            polygonSelection.attr('fill', function(hexPart) {
                    return scene.getHexPartColor(hexPart);
                })
                .attr('stroke', function(hexPart) {
                return hexPart.index === -1 ? 'black' : 'none';
            });

            //Remove any old tiles
            groupSelection.exit().remove();
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
