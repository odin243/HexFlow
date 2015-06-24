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
        flow: flow || new HF.vector(),
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
            var actualFlow = new HF.vector(this.flow.direction, actualFlowMagnitude);

            var dispersedVectors = actualFlow.disperse();
            dispersedVectors.push.apply(dispersedVectors, new HF.vector(new HF.hexPoint(1, -1, 0), (this.power - actualFlowMagnitude) * HF.config.standingFlowFactor).disperse(1));

            var updates = [];

            //Step 2: Apply the dispersed vector to each neighbor, and calculate an update tile
            for (var i = 0; i < dispersedVectors.length; i++)
            {
                var dispersion = dispersedVectors[i];

                //If we're not dispersing in this direction, no need to calculate an update vector
                if(dispersion.magnitude === 0)
                    continue;

                var neighbor = this.location.add(dispersion.direction).round();

                //var newPower = dispersion.magnitude;

                //var newDirection = dispersion.direction;
                //var newMagnitude = dispersion.magnitude * HF.config.flowMagnitudeSustain;

                //var newFlow = new HF.vector(dispersion.direction, dispersion.magnitude * HF.config.flowMagnitudeSustain);

                var updateTile = HF.hexTile(neighbor, dispersion.magnitude, dispersion, this.owner);

                updates.push(updateTile);
            }

            if (this.isSource === false)
            {
                //Step 3: Add an update for this tile, based on the power that has flowed out
                updates.push(HF.hexTile(this.location, -1 * (actualFlowMagnitude + (HF.config.standingFlowFactor * (this.power - actualFlowMagnitude))), null, null));
            }

            return updates;
        },

        applyUpdates: function (tileUpdates)
        {
            if (this.isSource === true)
                return this;

            var newPower = this.power;
            var newOwner = this.owner;
            //The flow left over from the previous turn should be scaled back, so that we don't continously build up speed
            var newFlow = this.flow;
                        
            for (var updateIndex = 0; updateIndex < tileUpdates.length; updateIndex++)
            {
                var tileUpdate = tileUpdates[updateIndex];

                if (tileUpdate.owner == null)
                    newPower = Math.max(newPower + tileUpdate.power, 0);
                else if (newOwner == null || newOwner === tileUpdate.owner)
                {
                    newOwner = tileUpdate.owner;
                    newPower = newPower + tileUpdate.power;
                }
                else
                    newPower = newPower - tileUpdate.power;

                if (newPower < 0) {
                    newOwner = tileUpdate.owner;
                    newPower = Math.abs(newPower);
                }

                newFlow = newFlow.add(tileUpdate.flow);

            }

            newFlow = newFlow.scale(HF.config.flowMagnitudeSustain);
            newFlow = new HF.vector(newFlow.direction, Math.min(newFlow.magnitude, newPower));
            
            return HF.hexTile(this.location, newPower, newFlow, newOwner, this.isSource);
        }
    };
}