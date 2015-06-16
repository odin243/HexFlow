//HF Namespace
window.HF = window.HF || {};

HF.hexMap = function (radius, tiles)
{
    var map = tiles || {};

    if (tiles === undefined)
    {
        var addToMap = function (newTile)
        {
            map[newTile.location.toString()] = newTile;
        };

        var origin = HF.hexTile(HF.hexPoint());
        addToMap(origin);

        var addRing = function (ringRadius)
        {
            for (var side = 0; side < 6; side++)
            {
                var sideDirection = (side + 2) % 6;
                var ringCorner = HF.directions.faceByIndex(side).scale(ringDistance);
                for (var sideOffset = 0; sideOffset < ringRadius; sideOffset++)
                {
                    var newTileLocation = ringCorner.add(HF.directions.faceByIndex(sideDirection).scale(sideOffset));
                    var newTile = HF.hexTile(newTileLocation);
                    addToMap(newTile);
                }
            }

        };

        for (var ringDistance = 1; ringDistance <= radius; ringDistance++)
        {
            addRing(ringDistance);
        }
    }
    
    return {
        tiles: map,

        radius: radius,

        getTileAtString: function (point)
        {
            for (var tileString in this.tiles)
            {
                var tile = this.tiles[tileString];
                if (tile.location.toString() === point)
                {
                    return tile;
                }
            }
        },

        getTileAtPoint: function (point)
        {
            return this.getTileAtString(point.toString());
        },

        updateTiles: function (tileUpdates)
        {
            var newMap = {};

            for (var location in this.tiles)
            {
                var tile = this.tiles[location];
                var updates = tileUpdates.getTilesAtString(location);
                var updatedTile = tile.applyUpdates(updates);

                newMap[updatedTile.location.toString()] = updatedTile;
            }

            return HF.hexMap(this.radius, newMap);
        }
    };
};