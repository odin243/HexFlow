window.HF = window.HF || {};

HF.hexGrid = function(size) {
    var hexGrid = {
        createTile: function (hex) {
            return {
                hex: hex,
                power: 0,
                vector: HF.vector(null, 0)
            }
        },

        hex_ring: function (center, radius) {
            var results = [];
            var cube = cube_add(center, cube_scale(cube_direction(4), radius));
            for (var i = 0; i < 6; i++)
            {
                for (var j = 0; j < radius, j++)
                    results.append(cube)
            }
            cube = cube_neighbor(cube, i)
            return results
        }
    }
    return hexGrid;
}