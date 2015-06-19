//HF Namespace
window.HF = window.HF || {};

HF.hexMap = function(radius, tiles)
{
    var map = {};

    var addToMap = function(newTile)
    {
        map[newTile.location.toString()] = newTile;
    };

    var addRing = function(ringRadius)
    {
        for (var side = 0; side < 6; side++)
        {
            var sideDirection = (side + 2) % 6;
            var ringCorner = HF.directions.faceByIndex(side).scale(ringRadius);
            for (var sideOffset = 0; sideOffset < ringRadius; sideOffset++)
            {
                var newTileLocation = ringCorner.add(HF.directions.faceByIndex(sideDirection).scale(sideOffset));
                var newTile = HF.hexTile(newTileLocation);
                addToMap(newTile);
            }
        }
    };

    var origin = HF.hexTile(HF.hexPoint());
    addToMap(origin);

    for (var ringDistance = 1; ringDistance <= radius; ringDistance++)
    {
        addRing(ringDistance);
    }

    //If a list or array was passed in, replace those specific tiles with the ones passed in
    if (tiles != undefined)
    {
        var tileList = tiles;
        //Check for a hexTileList
        if (tiles.hasOwnProperty('tileList') && tiles.tileList != undefined)
            tileList = tiles.tileList;
        for (var i = 0; i < tileList.length; i++)
        {
            addToMap(tileList[i]);
        }
    }

    return {
        tileMap: map,

        radius: radius,

        getTileAtString: function (point)
        {
            for (var tileString in this.tileMap)
            {
                if (this.tileMap.hasOwnProperty(tileString))
                {
                    var tile = this.tileMap[tileString];
                    if (tile.location.toString() === point)
                    {
                        return tile;
                    }
                }
            }
            return null;
        },

        getTileAtPoint: function (point)
        {
            return this.getTileAtString(point.toString());
        },

        updateTiles: function (tileUpdates)
        {
            var newMapTiles = [];
            for (var location in this.tileMap)
            {
                if (this.tileMap.hasOwnProperty(location))
                {
                    var tile = this.tileMap[location];
                    var updates = tileUpdates.getTilesAtString(location);
                    var updatedTile = tile.applyUpdates(updates);

                    newMapTiles.push(updatedTile);
                }
            }

            return HF.hexMap(this.radius, newMapTiles);
        },

        calculateAllTileEffects: function()
        {
            var updates = HF.hexTileList();
            for (var tileString in this.tileMap)
            {
                if (this.tileMap.hasOwnProperty(tileString))
                {
                    updates.addRange(this.tileMap[tileString].calcEffectOnNeighbors());
                }
            }
            return updates;
        },

        debugPrint: function()
        {
            for (var tileString in this.tileMap)
            {
                if (this.tileMap.hasOwnProperty(tileString))
                {
                    var tile = this.tileMap[tileString];

                    Debug.writeln(tile.location.toString() + ' ' + tile.power);
                }
            }
        },

        getTileArray: function()
        {
            var tiles = [];
            var tileMap = this.tileMap;
            for (var tileString in tileMap)
            {
                if (tileMap.hasOwnProperty(tileString))
                {
                    tiles.push(tileMap[tileString]);
                }
            }
            return tiles;
        }
    };
};