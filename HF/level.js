//HF Namespace
window.HF = window.HF || {};

HF.level = function(map, tilesArray)
{
    if (map && tilesArray)
        map.initialize(tilesArray);
    return {
        map: map,
        initialize: function(map, tilesArray)
        {
            this.map = map || this.map;
            this.tilesArray = tilesArray || this.tilesArray;
            if (this.map && this.tilesArray)
            {
                this.map.initialize(this.tilesArray);
            }
        }
    };
};
