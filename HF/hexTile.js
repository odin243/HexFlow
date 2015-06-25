﻿//HF Namespace
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

        //This method disperses this vectors magnitude in each face direction, and returns a list of the resultant dispersed vectors
        //The total magnitude of the dispersed vectors will (approximately) equal the magnitude of this vector
        getDispersions: function ()
        {
            var dispersionConstant = HF.config.flowDispersionConstant;
            var standingDispersion = HF.config.standingFlowFactor;

            //Step 1: Disperse the current vector in each direction
            //If we have less power than flow, then the actual flow magnitude will be equal to our power
            var actualFlowMagnitude = Math.min(this.power, this.flow.magnitude);
            var actualFlow = new HF.vector(this.flow.direction, actualFlowMagnitude);

            //If we have less flow than power, then there will be some power left over, which we will disperse in all directions
            var extraPower = standingDispersion * Math.max(this.power - actualFlowMagnitude, 0);
            
            if (this.dispersions == undefined)
            {
                var primaryFace = actualFlow.findFirstFace();
                var primaryAffinity = 1 - actualFlow.direction.subtract(primaryFace).length();

                var secondaryFace = actualFlow.findSecondFace();
                var secondaryAffinity = 1 - actualFlow.direction.subtract(secondaryFace).length();

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


                var indexOfPrimary;
                var indexOfSecondary;
                var numFaces = HF.directions.faceDirections.length;

                for (var i = 0; i < numFaces; i++)
                {
                    var face = HF.directions.faceDirections[i];
                    if (primaryFace.equals(face))
                        indexOfPrimary = i;
                    if (secondaryFace.equals(face))
                        indexOfSecondary = i;
                }

                var dispersedVectors = [];

                for (i = 0; i < numFaces; i++)
                {
                    var distanceFromPrimary = Math.min(Math.abs(i - indexOfPrimary), Math.abs(6 - Math.abs(i - indexOfPrimary)));
                    var distanceFromSecondary = Math.min(Math.abs(i - indexOfSecondary), Math.abs(6 - Math.abs(i - indexOfSecondary)));

                    var primaryResult;
                    if (distanceFromPrimary == 0)
                        primaryResult = forward;
                    else if (distanceFromPrimary == 1)
                        primaryResult = frontSides;
                    else if (distanceFromPrimary == 2)
                        primaryResult = backSides;
                    else
                        primaryResult = back;

                    primaryResult = primaryResult * primaryAffinity;

                    var secondaryResult;
                    if (distanceFromSecondary == 0)
                        secondaryResult = forward;
                    else if (distanceFromSecondary == 1)
                        secondaryResult = frontSides;
                    else if (distanceFromSecondary == 2)
                        secondaryResult = backSides;
                    else
                        secondaryResult = back;

                    secondaryResult = secondaryResult * secondaryAffinity;

                    var combinedResult = (primaryResult + secondaryResult) * actualFlow.magnitude;

                    //Now disperse the extra power as well;
                    combinedResult = combinedResult + (extraPower / numFaces);

                    var combinedVector = new HF.vector(HF.directions.faceByIndex(i), combinedResult);

                    dispersedVectors.push(combinedVector);
                }
                this.dispersions = dispersedVectors;
            }

            return this.dispersions;
        },

        calcEffectOnNeighbors: function()
        {
            var dispersedVectors = this.getDispersions();

            var updates = [];

            var lostPower = 0;

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

                lostPower = lostPower + dispersion.magnitude;
            }

            if (this.isSource === false)
            {
                //Step 3: Add an update for this tile, based on the power that has flowed out
                updates.push(HF.hexTile(this.location, -1 * lostPower, null, null));
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
        },

        getHexColor: function ()
        {
            if (this.bodyColor == undefined)
            {
                var maxPower = HF.config.hexFullPower || 100;
                var maxColor = this.owner || HF.config.hexFullColor || '#000000';
                var scale = d3.scale.linear()
                    .domain([0, maxPower])
                    .interpolate(d3.interpolateRgb)
                    .range(['#FFFFFF', maxColor]);
                var power = Math.min(this.power, maxPower);
                power = Math.max(power, 0);
                this.bodyColor = scale(power);
            }
            return this.bodyColor;
        },

        getFlowColor: function (faceIndex)
        {
            if (this.flowColor == undefined)
                this.flowColor = {};

            if (this.flowColor[faceIndex] == undefined)
            {
                var flow = this.flow;
                var face = HF.directions.faceByIndex(faceIndex);
                var flowDispersions = this.getDispersions();
                var dispersionsTowardsFace = flowDispersions.filter(function(vector) {
                    return face.equals(vector.direction);
                });
                if (dispersionsTowardsFace.length < 1)
                {
                    return '#FFFFFF';
                }
                flow = dispersionsTowardsFace[0];

                var maxMagnitude = HF.config.hexFullFlow || 100;
                var maxColor = this.owner || HF.config.hexFlowColor || '#000000';
                var scale = d3.scale.linear()
                    .domain([0, maxMagnitude])
                    .interpolate(d3.interpolateRgb)
                    .range(['#FFFFFF', maxColor]);
                var magnitude = Math.min(flow.magnitude, maxMagnitude);
                magnitude = Math.max(magnitude, 0);
                var color = scale(magnitude);
                this.flowColor[faceIndex] = color;
            }
            return this.flowColor[faceIndex];
        },
    };
}