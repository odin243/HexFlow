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
                var newTile = new HF.hexTile(newTileLocation);
                map.set(newTile);
            }
        }
    };

    var origin = new HF.hexTile(new HF.hexPoint());
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
            return this.getTileAtString(point.toString());
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
                updates.push.apply(updates, this.calcEffectOnNeighbors(tile));
            }
            return HF.hexTileDictionary(updates);
        },

        calcEffectOnNeighbors: function (tile)
        {
            var dispersedVectors = tile.getDispersions();

            var updates = [];

            var lostPower = 0;

            //Step 2: Apply the dispersed vector to each neighbor, and calculate an update tile
            for (var i = 0; i < dispersedVectors.length; i++)
            {
                var dispersion = dispersedVectors[i];

                //If we're not dispersing in this direction, no need to calculate an update vector
                if (dispersion.magnitude === 0)
                    continue;

                var neighborLocation = tile.location.add(dispersion.direction).round();

                var neighbor = this.getTileAtPoint(neighborLocation);

                if (neighbor != null || HF.config.allowFlowOffMap)
                {
                    var updateTile = new HF.hexTile(neighborLocation, dispersion.magnitude, dispersion, tile.owner);

                    updates.push(updateTile);

                    lostPower = lostPower + dispersion.magnitude;
                }
                else
                {
                    updates.push(new HF.hexTile(tile.location, 0, new HF.vector(dispersion.direction.invert(), dispersion.magnitude), null));
                }
            }

            if (tile.isSource === false)
            {
                //Step 3: Add an update for this tile, based on the power that has flowed out
                updates.push(new HF.hexTile(tile.location, -1 * lostPower, null, null));
            }

            return updates;
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