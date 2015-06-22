//HF Namespace
window.HF = window.HF || {};

HF.hexMap = function(radius, tileArray)
{
    var map = HF.hexTileDictionary();

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
                map.set(newTile);
            }
        }
    };

    var origin = HF.hexTile(HF.hexPoint());
    map.set(origin);

    for (var ringDistance = 1; ringDistance <= radius; ringDistance++)
    {
        addRing(ringDistance);
    }

    //If a list or array was passed in, replace those specific tiles with the ones passed in
    if (tileArray != undefined && tileArray.length != undefined)
    {
        map.setMany(tileArray);
    }

    return {
        tileDictionary: map,

        radius: radius,

        getTileAtString: function (pointString)
        {
            return (this.tileDictionary.getTilesAtString(pointString) || [null])[0];
        },

        getTileAtPoint: function (point)
        {
            return this.getTileAtString(point.string);
        },

        updateTiles: function(tileUpdateDictionary)
        {
            var tiles = this.toArray();
            var newTiles = [];

            for (var i = 0; i < tiles.length; i++)
            {
                var tile = tiles[i];
                var updates = tileUpdateDictionary.getTilesAtPoint(tile.location);
                var updatedTile = tile.applyUpdates(updates);
                newTiles.push(updatedTile);
            }

            return HF.hexMap(this.radius, newTiles);
        },

        calculateAllTileEffects: function()
        {
            var tiles = this.toArray();
            var updates = [];
            for (var i = 0; i < tiles.length; i++)
            {
                var tile = tiles[i];
                updates.push.apply(updates, tile.calcEffectOnNeighbors());
            }
            return HF.hexTileDictionary(updates);
        },

        debugPrint: function()
        {
            var tiles = this.toArray();
            for (var i = 0; i < tiles.length; i++)
            {
                var tile = tiles[i];

                Debug.writeln(tile.location.string + ' ' + tile.power);
            }
        },

        toArray: function()
        {
            return this.tileDictionary.toArray();
        }
    };
};