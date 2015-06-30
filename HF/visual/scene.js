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

    var scene = {
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

        getHexBodyColorScale: function(hexTile)
        {
            this.bodyColorScales = this.bodyColorScales || {};
            var maxColor = hexTile.owner || HF.config.hexFlowColor || '#000000';
            this.bodyColorScales[maxColor] = this.bodyColorScales[maxColor] || {};
            var maxPower = HF.config.hexFullPower || 100;
            var minPower = HF.config.hexMinPower || 0.01;
            this.bodyColorScales[maxColor][maxPower] =
                this.bodyColorScales[maxColor][maxPower] ||
                d3.scale.log()
                .domain([minPower, maxPower])
                .interpolate(d3.interpolateRgb)
                .range([HF.config.gridBackgroundColor, maxColor]);
            return this.bodyColorScales[maxColor][maxPower];
        },

        getHexBorderColorScale: function(hexTile)
        {
            this.borderColorScales = this.borderColorScales || {};
            var maxColor = hexTile.owner || HF.config.hexFlowColor || '#000000';
            this.borderColorScales[maxColor] = this.borderColorScales[maxColor] || {};
            var maxMagnitude = HF.config.hexFullFlow || 100;
            var minMagnitude = HF.config.hexMinFlow || 0.01;
            this.borderColorScales[maxColor][maxMagnitude] =
                this.borderColorScales[maxColor][maxMagnitude] ||
                d3.scale.log()
                .domain([minMagnitude, maxMagnitude])
                .interpolate(d3.interpolateRgb)
                .range([HF.config.gridBackgroundColor, maxColor]);
            return this.borderColorScales[maxColor][maxMagnitude];
        },

        getHexPartColor: function(hexTile, partIndex)
        {
            if (partIndex === -1 || partIndex == undefined)
            {
                return hexTile.getHexColor(this.getHexBodyColorScale(hexTile));
            }
            else
            {
                return hexTile.getFlowColor(partIndex, this.getHexBorderColorScale(hexTile));
            }
        },

        lastSceneData: [],

        getTileData: function(hexTile)
        {
            var tileData = [];

            tileData.push({
                id: hexTile.getIdentifier(),
                tileId: hexTile.getIdentifier(),
                color: this.getHexPartColor(hexTile),
                border: 'black',
                borderWidth: hexTile.isSource ? HF.config.sourceBorderWidth || 3 : HF.config.hexBorderWidth,
                points: this.makeHexShapeString(hexTile.location)
            });

            if (this.borderWidth > 0)
            {
                for (var i = 0; i < 6; i++)
                {
                    tileData.push({
                        id: hexTile.getIdentifier() + '_face' + i,
                        tileId: hexTile.getIdentifier(),
                        faceIndex: i,
                        color: this.getHexPartColor(hexTile, i),
                        border: 'none',
                        points: this.makeSideBorderShapeString(hexTile.location, i)
                    });
                }
            }

            return tileData;
        },

        //The scene data is a dictionary of tile IDs to an array of polygons that should be rendered for a given hex
        getSceneData: function(hexMap)
        {
            var sceneData = {};

            var tileDictionary = hexMap.tileDictionary.dictionary;
            for (var tileString in tileDictionary)
            {
                if(!tileDictionary.hasOwnProperty(tileString))
                    continue;

                var tile = tileDictionary[tileString][0];

                var tileData = this.getTileData(tile);

                sceneData[tile.getIdentifier()] = tileData;
            }

            return sceneData;
        },

        isTileDataEqual: function(oldTileData, newTileData)
        {
            if (oldTileData == undefined)
                return newTileData == undefined;

            if (newTileData == undefined)
                return true;

            if (oldTileData.length !== newTileData.length)
                return true;

            for (var i = 0; i < newTileData.length; i++)
            {
                var oldPolyData = oldTileData[i];
                var newPolyData = newTileData[i];

                if (oldPolyData.id !== newPolyData.id ||
                    oldPolyData.color !== newPolyData.color ||
                    oldPolyData.border !== newPolyData.border ||
                    oldPolyData.points !== newPolyData.points ||
                    oldPolyData.borderWidth !== newPolyData.borderWidth)
                    return false;
            }

            return true;
        },

        diffSceneData: function(hexMap)
        {
            var lastSceneData = this.lastSceneData;
            var thisSceneData = this.getSceneData(hexMap);

            //If this is the first scene render, return everything
            if (lastSceneData == undefined)
            {
                this.lastSceneData = thisSceneData;
                return thisSceneData;
            }

            var tileDictionary = hexMap.tileDictionary.dictionary;

            var tileStrings = d3.keys(tileDictionary);

            var differentData = {};

            for (var i = 0; i < tileStrings.length; i++)
            {
                var tileString = tileStrings[i];
                var oldDatum = lastSceneData[tileString];
                var newDatum = thisSceneData[tileString];
                if (!this.isTileDataEqual(oldDatum, newDatum))
                    differentData[tileString] = newDatum;
            }

            this.lastSceneData = thisSceneData;

            return differentData;
        },

        //Returns an array of shape strings corresponding to the hexagons on a map
        drawTiles: function(svgSelection, hexMap)
        {
            var scene = this;
           
            //var thisSceneData = scene.getSceneData(hexMap);
            var diffSceneData = scene.diffSceneData(hexMap);

            var polygonDataArray = [].concat.apply([], d3.values(diffSceneData));

            //Add a polygon element per hex part
            var polygonSelection = svgSelection
                .selectAll('polygon')
                .data(polygonDataArray,
                function(polyData) {
                    return polyData.id;
                });
            
            //Draw each hex part
            polygonSelection.enter()
                .append('polygon')
                .attr('id', function(polyData) {
                    return polyData.id;
                })
                .attr('points', function(polyData) {
                    return polyData.points;
                })
                .on('mousedown', HF.input.onPolygonMouseDown.bind(HF.input))
                .on('mouseup', HF.input.onPolygonMouseUp.bind(HF.input));

            //Next update the tile attributes
            polygonSelection.attr('fill', function(polyData) {
                    return polyData.color;
                })
                .attr('stroke', function(polyData) {
                    return polyData.border;
                })
                .attr('stroke-width', function(polyData) {
                    return polyData.borderWidth;
                });


//Remove any old tiles
            //groupSelection.exit().remove();
            //polygonSelection.exit().remove();
        },

        // containerSelector is a selector that d3 can use to find the container element
        drawMap: function(hexMap, containerSelector)
        {
            var containerSelection = d3.select(containerSelector);

            //Set the sizing of the scene
            var radius = hexMap.radius;
            var diameter = (2 * radius + 1) * 1.8 * this.size;
            containerSelection.style('width', diameter + 'px').style('height', diameter + 'px');
            this.origin = HF.visual.point(diameter / 2, diameter / 2);
            
            var svgSelection = containerSelection.select('svg');
            if (svgSelection.empty())
            {
                svgSelection = containerSelection
                    .append('svg')
                    .style('width', '100%')
                    .style('height', '100%')
                    .style('background-color', HF.config.gridBackgroundColor);

                d3.select('body').style('background-color', HF.config.gridBackgroundColor);
            }

            this.drawTiles(svgSelection, hexMap);
        }

    };

    Object.defineProperties(scene, {
        'size': {
            get: function()
            {
                return HF.config.hexSize || 50;
            }
        },
        'borderWidth': {
            get: function()
            {
                return HF.config.hexFlowPanelWidth === -1 ? 0 : HF.config.hexFlowPanelWidth || 5;
            }
        }
    });
    return scene;
};
