function hexGrid() {
    return {
        createGrid: function (size) {
            this.center = this.createTile(0,0,0);
        },

        hex: function(x, y, z){
            return {
                x: x,
                y: y,
                z: z
            }
        },

        createTile: function (x, y, z) {
            return {
                hex: hex(x, y, z),
                power: 0,
                vector: {direction: 0, magnitude: 0}
            }
        },
        
        directions: [
            {x:  1, y: -1, z:  0}, 
            {x:  1, y:  0, z: -1}, 
            {x:  0, y:  1, z: -1}, 
            {x: -1, y:  1, z:  0}, 
            {x: -1, y:  0, z:  1}, 
            {x:  0, y: -1, z:  1}],
                         

        hex_direction: function(direction){
            return directions[direction];
        },

        hex_add: function(hex1, hex2){
            return hex(hex1.x + hex2.x, hex1.y + hex2.y, hex1.z + hex2.z);
        },

        hex_neighbor: function (hex, direction) {
            return cube_add(hex, cube_direction(direction));
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
}