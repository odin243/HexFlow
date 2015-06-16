//HF Namespace
window.HF = window.HF || {};

HF.hexTileList = function ()
{
    return {
        tiles: [],

        add: function (tile)
        {
            this.tiles.push(tile);
        },

        addRange: function (tileList)
        {
            for (var tileIndex = 0; tileIndex < tileList.length; tileIndex++)
            {
                var tile = tileList[tileIndex];
                this.add(tile);
            }
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