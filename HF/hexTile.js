//HF Namespace
window.HF = window.HF || {};

HF.hexTile = function(location, power, flow, owner)
{
    if (location == undefined)
    {
        console.error('HF.hexTile - invalid argument - returning null');
        return null;
    }

    return {
        location: location,
        power: power || 0,
        flow: flow || HF.vector(),
        owner: owner || null,

        getIdentifier: function()
        {
            return location.toString();
        },

        calcEffectOnNeighbors: function()
        {
            //Step 1: Disperse the current vector in each direction
            //If we have less power than flow, then the actual flow magnitude will be equal to our power
            var actualFlowMagnitude = Math.min(this.power, this.flow.magnitude);
            var actualFlow = HF.vector(this.flow.direction, actualFlowMagnitude);

            var dispersedVectors = actualFlow.disperse();

            var updateTiles = [];

            //Step 2: Apply the dispersed vector to each neighbor, and calculate an update tile
            for (var i = 0; i < dispersedVectors.length; i++)
            {
                var dispersion = dispersedVectors[i];

                //If we're not dispersing in this direction, no need to calculate an update vector
                if(dispersion.magnitude === 0)
                    continue;

                var neighbor = this.location.add(dispersion.direction).round();

                var updateTile = HF.hexTile(neighbor, dispersion.magnitude, dispersion, this.owner);

                updateTiles.push(updateTile);
            }

            //Step 3: Add an update for this tile, based on the power that has flowed out
            updateTiles.push(HF.hexTile(this.location, -1 * actualFlowMagnitude, null, this.owner));

            return updateTiles;
        }
    };
}