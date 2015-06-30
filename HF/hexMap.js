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
                updates.push.apply(updates, this.calcEffectOnNeighbors(tile).toArray());
            }
            return HF.hexTileDictionary(updates);
        },
        
        //Returns a hexTileDictionary representing the effect the given tile has on its neighbors
        calcEffectOnNeighbors: function (tile)
        {
            if (tile.updates == undefined)
            {
                var dispersedVectors = tile.getDispersions();

                var updates = HF.hexTileDictionary();

                //Step 2: Apply the dispersed vector to each neighbor, and calculate an update tile
                for (var i = 0; i < dispersedVectors.length; i++)
                {
                    var dispersion = dispersedVectors[i];

                    //If we're not dispersing in this direction, no need to calculate an update vector
                    if (dispersion.direction.length() === 0 || dispersion.magnitude === 0)
                        continue;

                    var updatesForDispersion = [];

                    var faceAffinities = dispersion.getFaceAffinities();

                    var direction1 = faceAffinities.direction1;
                    var magnitude1 = faceAffinities.affinity1;
                    var dispersion1 = dispersion.scale(magnitude1);
                    var direction2 = faceAffinities.direction2;
                    var magnitude2 = faceAffinities.affinity2;
                    var dispersion2 = dispersion.scale(magnitude2);

                    [].push.apply(updatesForDispersion, this.getUpdateTilesForDispersion(tile, dispersion1, direction1));
                    [].push.apply(updatesForDispersion, this.getUpdateTilesForDispersion(tile, dispersion2, direction2));

                    updates.addMany(updatesForDispersion);
                }

                var lostPower = updates.toArray().reduce(function(power, updateTile) {
                    return power + updateTile.power;
                }, 0);

                if (tile.isSource === false && lostPower !== 0)
                {
                    //Step 3: Add an update for this tile, based on the power that has flowed out
                    updates.add(new HF.hexTile(tile.location, lostPower, null, null));
                }

                tile.updates = updates;
            }

            return tile.updates;
        },

        getUpdateTilesForDispersion: function (tile, dispersion, neighborDirection)
        {
            var updateTiles = [];

            var neighborLocation = tile.location.add(neighborDirection).round();

            //var neighborDirection = neighborLocation.subtract(tile.location);

            var neighbor = this.getTileAtPoint(neighborLocation);

            if (neighbor != null || HF.config.useWalls !== true)
            {
                var flowToPropogate = new HF.vector(neighborDirection, dispersion.magnitude);//, offset);
                var updateTile = new HF.hexTile(neighborLocation, dispersion.magnitude, dispersion, tile.owner);

                updateTiles.push(updateTile);
            }
            else
            {
                var bounceAmount = dispersion.magnitude * 0.5;
                updateTiles.push(new HF.hexTile(tile.location, bounceAmount, new HF.vector(dispersion.direction.invert(), bounceAmount), null));
            }

            return updateTiles;
        },

        debugPrint: function()
        {
            var tiles = this.toArray();
            for (var i = 0; i < tiles.length; i++)
            {
                var tile = tiles[i];

                Debug.writeln(tile.location.toString() + ' ' + tile.power);
            }
        },

        toArray: function()
        {
            return this.tileDictionary.toArray();
        }
    };
};