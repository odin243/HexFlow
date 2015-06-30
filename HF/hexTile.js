//HF Namespace
window.HF = window.HF || {};

HF.hexTile = function (location, power, flow, owner, sourcePower)
{
    this.location = location;
    this.power = power || 0;
    this.flow = flow || new HF.vector();
    this.owner = owner || null;
    this.sourcePower = sourcePower || 0;

};

HF.hexTile.prototype =
{

    getIdentifier: function ()
    {
        if (this.identifier === undefined)
            this.identifier = this.location.toString();
        return this.identifier;
    },

    //This method disperses this vectors magnitude in 6 equal direction, and returns a list of the resultant dispersed vectors
    //The total magnitude of the dispersed vectors will (approximately) equal the magnitude of this vector
    getDispersions: function ()
    {
        if (this.dispersions == undefined)
        {
            var dispersionConstant = HF.config.flowDispersionConstant;
            var standingDispersion = HF.config.standingFlowFactor;

            //Step 1: Disperse the current vector in each direction
            //If we have less power than flow, then the actual flow magnitude will be equal to our power
            var actualFlowMagnitude = Math.min(this.power, this.flow.magnitude);
            var actualFlow = new HF.vector(this.flow.direction, actualFlowMagnitude);

            //If we have less flow than power, then there will be some power left over, which we will disperse in all directions
            var extraPower = standingDispersion * Math.max(this.power - actualFlowMagnitude, 0);

            var dispersedVectors = [];
            
            //For sources which do not have a flow, push all power equally towards all faces
            if (this.isSource && this.flow.direction.length() == 0)
            {
                var numFaces = HF.directions.faceDirections.length;
                for (var i = 0; i < numFaces; i++)
                {
                    dispersedVectors.push(new HF.vector(HF.directions.faceByIndex(i), actualFlowMagnitude / numFaces));
                }
            }
            else
            {
                //First decompose the flow direction into 6 equally spaced directions (though not necessarily aligned with the hex faces)
                var decomposedFlowDirections = HF.directions.decompose(actualFlow.direction);

                //var primaryFace = actualFlow.findFirstFace();
                //var primaryAffinity = 1 - actualFlow.direction.subtract(primaryFace).length();

                //var secondaryFace = actualFlow.findSecondFace();
                //var secondaryAffinity = 1 - actualFlow.direction.subtract(secondaryFace).length();
                
                var forward = 1;
                var frontSides = forward * dispersionConstant;
                var backSides = frontSides * dispersionConstant;
                var back = backSides * dispersionConstant;

                var totalDispersion = forward + (2 * frontSides) + (2 * backSides) + back;

                if (totalDispersion === 0)
                    totalDispersion = 1;

                forward = forward / totalDispersion;
                frontSides = frontSides / totalDispersion;
                backSides = backSides / totalDispersion;
                back = back / totalDispersion;

                for (i = 0; i < 6; i++)
                {
                    var dispersionFactor = 0;
                    switch (i)
                    {
                        case 0:
                        {
                            //This is the primary direction
                            dispersionFactor = forward;
                            break;
                        }
                        case 1:
                        case 5:
                        {
                            //These are the front sides
                            dispersionFactor = frontSides;
                            break;
                        }
                        case 2:
                        case 4:
                        {
                            //These are the back sides
                            dispersionFactor = backSides;
                            break;
                        }
                        case 3:
                        {
                            //This is directly behind the flow
                            dispersionFactor = back;
                            break;
                        }
                    }
                    var direction = decomposedFlowDirections[i];

                    var dispersionAmount = dispersionFactor * actualFlowMagnitude;

                    //Now disperse the extra power as well;
                    if (!this.isSource)
                        dispersionAmount = dispersionAmount + (extraPower / 6);

                    if (dispersionAmount !== 0)
                    {
                        var dispersion = new HF.vector(direction, dispersionAmount);

                        dispersedVectors.push(dispersion);
                    }
                }
            }

            this.dispersions = dispersedVectors;
        }

        return this.dispersions;
    },

    applyUpdates: function (tileUpdates)
    {
        //if (this.isSource === true)
        //    return this;

        var newPower = this.power;
        var newOwner = this.owner;
        //The flow left over from the previous turn should be scaled back, so that we don't continously build up speed
        var newFlow = this.flow;

        var playerPower = {};
        if (this.owner != null)
            playerPower[this.owner] = this.power;

        for (var updateIndex = 0; updateIndex < tileUpdates.length; updateIndex++)
        {
            var tileUpdate = tileUpdates[updateIndex];

            playerPower[tileUpdate.owner] = playerPower[tileUpdate.owner] || 0;
            playerPower[tileUpdate.owner] += tileUpdate.power;

            newFlow = newFlow.add(tileUpdate.flow);

        }

        if (this.owner != null)
        {
            var newPower = 0;

            for (var playerKey in playerPower)
            {
                if (!(playerKey == 'null' && this.isSource))
                    newPower += playerPower[playerKey] * (playerKey === this.owner ? 1 : -1);
            }

            if (newPower <= 0)
                newOwner = null;
        }
        else
        {
            var biggestPlayer;
            var biggestPower = 0;

            for (var playerKey in playerPower)
            {
                if (playerPower[playerKey] > biggestPower)
                {
                    biggestPower = playerPower[playerKey];
                    biggestPlayer = playerKey;
                }
            }

            newOwner = biggestPlayer;

            for (var playerKey in playerPower)
            {
                newPower += playerPower[playerKey] * (playerKey === newOwner ? 1 : -1);
            }

            if (newPower <= 0)
                newOwner = null;
        }

        newFlow = newFlow.scale(HF.config.flowMagnitudeSustain);
        newFlow = this.isSource ? new HF.vector(this.flow.direction, Math.min(this.sourcePower, newPower)) : new HF.vector(newFlow.direction, Math.min(newFlow.magnitude, newPower));

        return new HF.hexTile(this.location, newPower, newFlow, newOwner, this.sourcePower);
    },

    getHexColor: function (colorScale)
    {
        if (this.bodyColor == undefined)
        {
            var maxPower = HF.config.hexFullPower || 100;
            var power = Math.min(this.power, maxPower);
            power = Math.max(power, HF.config.hexMinPower);
            this.bodyColor = colorScale(power);
        }
        return this.bodyColor;
    },

    getFlowColor: function (faceIndex, colorScale)
    {
        if (this.flowColor == undefined)
            this.flowColor = {};

        var face = HF.directions.faceByIndex(faceIndex);
        var faceString = face.toString();

        if (this.flowColor[faceString] == undefined)
        {
            var faceUpdates = this.updates;
            if (faceUpdates == undefined)
                return '#FFFFFF';

            var updatesTowardsFace = faceUpdates.getTilesAtPoint(this.location.add(face));

            var magnitudeTowardsFace = updatesTowardsFace.reduce(function(magnitude, updateTile) {
                return magnitude + updateTile.flow.magnitude;
            }, 0);
                    
            var maxMagnitude = HF.config.hexFullFlow || 100;
            var magnitude = Math.min(magnitudeTowardsFace, maxMagnitude);
            magnitude = Math.max(magnitude, HF.config.hexMinFlow);
            var color = colorScale(magnitude);
            this.flowColor[faceIndex] = color;
        }

        return this.flowColor[faceIndex];
    }
};

Object.defineProperty(HF.hexTile.prototype, 'isSource', {
    get: function () { return this.sourcePower > 0;}
});