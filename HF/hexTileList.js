//HF Namespace
window.HF = window.HF || {};

HF.hexTileList = function (tileList)
{
    return {
        tileList: tileList || [],

        add: function (tile)
        {
            this.tileList.push(tile);
            return this;
        },

        addRange: function (tiles)
        {
            var tileList = tiles.hasOwnProperty('tileList') ? tiles.tileList : tiles;
            for (var tileIndex = 0; tileIndex < tileList.length; tileIndex++)
            {
                var tile = tileList[tileIndex];
                this.add(tile);
            }
            return this;
        },

        getTilesAtString: function (pointString)
        {
            var matches = [];
            for (var i = 0; i < this.tileList.length; i++)
            {
                if (this.tileList[i].location.toString() === pointString)
                {
                    matches.push(this.tileList[i]);
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