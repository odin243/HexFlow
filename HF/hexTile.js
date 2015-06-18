//HF Namespace
window.HF = window.HF || {};

HF.hexTile = function(location, power, flow, owner, isSource)
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
        isSource: isSource || false,

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

            var updateTiles = HF.hexTileList();

            //Step 2: Apply the dispersed vector to each neighbor, and calculate an update tile
            for (var i = 0; i < dispersedVectors.length; i++)
            {
                var dispersion = dispersedVectors[i];

                //If we're not dispersing in this direction, no need to calculate an update vector
                if(dispersion.magnitude === 0)
                    continue;

                var neighbor = this.location.add(dispersion.direction).round();

                var updateTile = HF.hexTile(neighbor, dispersion.magnitude, dispersion, this.owner);

                updateTiles.add(updateTile);
            }

            //Step 3: Add an update for this tile, based on the power that has flowed out
            updateTiles.add(HF.hexTile(this.location, -1 * actualFlowMagnitude, null, null));

            return updateTiles;
        },

        applyUpdates: function (tileUpdates)
        {
            var newPower = this.power;
            var newPlayer = this.player;
            var newFlow = this.flow;
                        
            for (var updateIndex = 0; updateIndex < tileUpdates.length; updateIndex++)
            {
                var tileUpdate = tileUpdates[updateIndex];

                if (tileUpdate.player == null)
                    newPower = Math.max(newPower + tileUpdate.power, 0);
                else if (newPlayer == null || newPlayer == tileUpdate.player)
                    newPower = newPower + tileUpdate.power;
                else
                    newPower = newPower - tileUpdate.power;

                if (newPower < 0) {
                    newPlayer = tileUpdate.player;
                    newPower = Math.abs(newPower);
                }

                newFlow = newFlow.add(tileUpdate.flow);

            }

            return HF.hexTile(this.location, newPower, newFlow, newPlayer);
        }
    };
}