//HF Namespace
window.HF = window.HF || {};

HF.hexTileList = function ()
{
    return {
        tiles: [],

        add: function (tile)
        {
            this.tiles.push(tile);
            return this;
        },

        addRange: function (tileList)
        {
            var tilesToAdd = tileList.hasOwnProperty('tiles') ? tileList.tiles : tileList;
            for (var tileIndex = 0; tileIndex < tilesToAdd.length; tileIndex++)
            {
                var tile = tilesToAdd[tileIndex];
                this.add(tile);
            }
            return this;
        },

        getTilesAtString: function (point)
        {
            var matches = [];
            for (var i = 0; i < this.tiles.length; i++)
            {
                if (this.tiles[i].location.toString() === point)
                {
                    matches.push(this.tiles[i]);
                }
            }

            return matches;
        },

        getTilesAtPoint: function (point)
        {
            return this.getTilesAtString(point.toString());
        }
    };
};