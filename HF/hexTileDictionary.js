//HF Namespace
window.HF = window.HF || {};

HF.hexTileDictionary = function (tileArray)
{
    var tileListMap = {};
    if (tileArray != undefined)
    {
        for (var i = 0; i < tileArray.length || 0; i++)
        {
            var tile = tileArray[i];
            tileListMap[tile.getIdentifier()] = tileListMap[tile.getIdentifier()] || [];
            tileListMap[tile.getIdentifier()].push(tile);
        }
    }
    return {
        dictionary: tileListMap,

        toArray: function()
        {
            var array = [];
            for (var tileString in this.dictionary)
            {
                if (this.dictionary.hasOwnProperty(tileString))
                {
                    array.push.apply(array, this.dictionary[tileString]);
                }
            }
            return array;
        },

        add: function (tile)
        {
            this.dictionary[tile.getIdentifier()] = this.dictionary[tile.getIdentifier()] || [];
            this.dictionary[tile.getIdentifier()].push(tile);
            return this;
        },

        addMany: function (tileArray)
        {
            for (var tileIndex = 0; tileIndex < tileArray.length; tileIndex++)
            {
                var tile = tileArray[tileIndex];
                this.add(tile);
            }
            return this;
        },

        set: function(tile)
        {
            this.dictionary[tile.getIdentifier()] = [tile];
            return this;
        },

        setMany: function(tileArray)
        {
            for (var tileIndex = 0; tileIndex < tileArray.length; tileIndex++)
            {
                var tile = tileArray[tileIndex];
                this.set(tile);
            }
            return this;
        },

        getTilesAtString: function (pointString)
        {
            return this.dictionary[pointString] || [];
        },

        getTilesAtPoint: function (point)
        {
            return this.getTilesAtString(point.toString());
        }
    };
};