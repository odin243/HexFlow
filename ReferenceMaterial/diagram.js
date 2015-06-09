window.HF = window.HF || {};

/* A grid diagram will be an object with
   1. nodes = { cube: Cube object, key: string, node: d3 selection of <g> containing polygon }
   2. grid = Grid object
   3. root = d3 selection of root <g> of diagram
   4. polygons = d3 selection of the hexagons inside the <g> per tile
   5. update = function(scale, orientation) to call any time orientation changes, including initialization
   6. onLayout = callback function that will be called before an update (to assign new cube coordinates)
      - this will be called immediately on update
   7. onUpdate = callback function that will be called after an update
      - this will be called after a delay, and only if there hasn't been another update
      - since it may not be called, this function should only affect the visuals and not data
*/
HF.diagram = function(svg, cubes) {
    var diagram = {};

    diagram.nodes = cubes.map(function (n) { return { cube: n, key: n.toString() }; });
    diagram.root = svg.append('g');
    diagram.tiles = diagram.root.selectAll("g.tile").data(diagram.nodes, function (node) { return node.key; });
    diagram.tiles.enter()
        .append('g').attr('class', "tile")
        .each(function (d) { d.node = d3.select(this); });
    diagram.polygons = diagram.tiles.append('polygon');

    diagram.makeTilesSelectable = function (callback) {
        diagram.selected = d3.set();
        diagram.toggle = function (cube) {
            if (diagram.selected.has(cube)) {
                diagram.selected.remove(cube);
            } else {
                diagram.selected.add(cube);
            }
        };

        var dragState = 0;
        var drag = d3.behavior.drag()
            .on('dragstart', function (d) {
                dragState = diagram.selected.has(d.cube);
            })
            .on('drag', function () {
                var target = d3.select(d3.event.sourceEvent.target);
                if (target != undefined && target.data()[0] && target.data()[0].cube) {
                    var cube = target.data()[0].cube;
                    if (dragState) {
                        diagram.selected.remove(cube);
                    } else {
                        diagram.selected.add(cube);
                    }
                }
                callback();
            });

        diagram.tiles
            .on('click', function (d) {
                d3.event.preventDefault();
                diagram.toggle(d.cube);
                callback();
            })
            .call(drag);
    };


    diagram.addLabels = function (labelFunction) {
        diagram.tiles.append('text')
            .attr('y', "0.4em")
            .text(function (d, i) { return labelFunction ? labelFunction(d, i) : ""; });
        return diagram;
    };


    diagram.addHexCoordinates = function (converter, withMouseover) {
        diagram.nodes.forEach(function (n) { n.hex = converter(n.cube); });
        diagram.tiles.append('text')
            .attr('y', "0.4em")
            .each(function (d) {
                var selection = d3.select(this);
                selection.append('tspan').attr('class', "q").text(d.hex.q);
                selection.append('tspan').text(", ");
                selection.append('tspan').attr('class', "r").text(d.hex.r);
            });

        function setSelection(hex) {
            diagram.tiles
                .classed('q-axis-same', function (other) { return hex.q == other.hex.q; })
                .classed('r-axis-same', function (other) { return hex.r == other.hex.r; });
        }

        if (withMouseover) {
            diagram.tiles
                .on('mouseover', function (d) { setSelection(d.hex); })
                .on('touchstart', function (d) { setSelection(d.hex); });
        }

        return diagram;
    };


    diagram.addCubeCoordinates = function (withMouseover) {
        diagram.tiles.append('text')
            .each(function (d) {
                var selection = d3.select(this);
                var labels = [d.cube.x, d.cube.y, d.cube.z];
                if (labels[0] == 0 && labels[1] == 0 && labels[2] == 0) {
                    // Special case: label the origin with x/y/z so that you can tell where things to
                    labels = ["x", "y", "z"];
                }
                selection.append('tspan').attr('class', "q").text(labels[0]);
                selection.append('tspan').attr('class', "s").text(labels[1]);
                selection.append('tspan').attr('class', "r").text(labels[2]);
            });

        function relocate() {
            var bl = 4;  // adjust to vertically center
            var offsets = diagram.orientation ? [14, -9 + bl, -14, -9 + bl, 0, 13 + bl] : [13, 0 + bl, -9, -14 + bl, -9, 14 + bl];
            offsets = offsets.map(function (f) { return f * diagram.scale / 50; });
            diagram.tiles.select(".q").attr('x', offsets[0]).attr('y', offsets[1]);
            diagram.tiles.select(".s").attr('x', offsets[2]).attr('y', offsets[3]);
            diagram.tiles.select(".r").attr('x', offsets[4]).attr('y', offsets[5]);
        }

        function setSelection(cube) {
            ["q", "s", "r"].forEach(function (axis, i) {
                diagram.tiles.classed(axis + "-axis-same", function (other) { return cube.v()[i] == other.cube.v()[i]; });
            });
        }

        if (withMouseover) {
            diagram.tiles
                .on('mouseover', function (d) { return setSelection(d.cube); })
                .on('touchstart', function (d) { return setSelection(d.cube); });
        }

        diagram.onUpdate(relocate);
        return diagram;
    };


    diagram.addPath = function () {
        diagram.pathLayer = this.root.append('path')
            .attr('d', "M 0 0")
            .attr('class', "path");
        diagram.setPath = function (path) {
            var d = [];
            for (var i = 0; i < path.length; i++) {
                d.push(i == 0 ? 'M' : 'L');
                d.push(diagram.grid.hexToCenter(path[i]));
            }
            diagram.pathLayer.attr('d', d.join(" "));
        };
    };


    var preCallbacks = [];
    var postCallbacks = [];
    diagram.onLayout = function (callback) { preCallbacks.push(callback); };
    diagram.onUpdate = function (callback) { postCallbacks.push(callback); };

    var hexagonPoints = makeHexagonShape(diagram.scale);

    diagram.update = function (scale, orientation) {
        if (scale != diagram.scale) {
            diagram.scale = scale;
            hexagonPoints = makeHexagonShape(scale);
            diagram.polygons.attr('points', hexagonPoints);
        }
        diagram.orientation = orientation;

        preCallbacks.forEach(function (f) { f(); });
        var grid = new Grid(scale, orientation, diagram.nodes.map(function (node) { return node.cube; }));
        var bounds = grid.bounds();
        var firstDraw = !diagram.grid;
        diagram.grid = grid;

        delay(svg, function (animate) {
            if (firstDraw) { animate = function (selection) { return selection; }; }

            // NOTE: In Webkit I can use svg.node().clientWidth but in Gecko that returns 0 :(
            diagram.translate = new ScreenCoordinate((parseFloat(svg.attr('width')) - bounds.minX - bounds.maxX) / 2,
                                                     (parseFloat(svg.attr('height')) - bounds.minY - bounds.maxY) / 2);
            animate(diagram.root)
                .attr('transform', "translate(" + diagram.translate + ")");

            animate(diagram.tiles)
                .attr('transform', function (node) {
                    var center = grid.hexToCenter(node.cube);
                    return "translate(" + center.x + "," + center.y + ")";
                });

            animate(diagram.polygons)
                .attr('transform', "rotate(" + (orientation * -30) + ")");

            postCallbacks.forEach(function (f) { f(); });
        });

        return diagram;
    };

    return diagram;
};