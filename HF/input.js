//HF Namespace
window.HF = window.HF || {};

HF.input =
{
    onPolygonMouseDown: function (tile, index)
    {
        HF.input.mouseDownLocation = tile.tileId;
    },

    onPolygonMouseUp: function (tile, index)
    {
        if (HF.input.mouseDownLocation === undefined)
            return;

        if (HF.input.mouseDownLocation == tile.tileId)
        {
            HF.state.bufferAction({ location: tile.tileId }, this.clearDirection);
        }
        else
        {
            HF.state.bufferAction({ source: HF.input.mouseDownLocation, destination: tile.tileId }, this.assignDirection);
        }
    },

    clearDirection: function (args, map)
    {
        var tile = map.getTileAtString(args.location);
        if (tile.isSource)
        {
            var updatedTile = new HF.hexTile(tile.location, tile.power, new HF.vector(new HF.hexPoint(), tile.flow.magnitude), tile.owner, tile.sourcePower);
            map.tileDictionary.set(updatedTile);
        }
    },

    assignDirection: function (args, map)
    {
        var tile = map.getTileAtString(args.source);
        if (tile.isSource)
        {
            var newDirection = HF.hexPoint.fromString(args.destination).subtract(HF.hexPoint.fromString(args.source)).toUnit();
            var updatedTile = new HF.hexTile(tile.location, tile.power, new HF.vector(newDirection, tile.flow.magnitude), tile.owner, tile.sourcePower);
            map.tileDictionary.set(updatedTile);
        }
    }
};