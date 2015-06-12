//HF Namespace
window.HF = window.HF || {};

HF.vector = function(direction, magnitude)
{
    if (magnitude != undefined && isNaN(magnitude))
    {
        console.error('HF.vector - invalid argument - returning null');
        return null;
    }

    return {
        direction: direction || HF.hexPoint(),
        magnitude: magnitude || 0,

        add: function(otherVector)
        {
            if (otherVector == undefined)
            {
                console.error('HF.vector.add - invalid argument - returning null');
                return null;
            }

            var thisPath = this.direction.scale(this.magnitude);
            var otherPath = otherVector.direction.scale(otherVector.magnitude);

            var combinedPath = thisPath.add(otherPath);

            var newMagnitude = combinedPath.length();

            var newDirection = combinedPath.toUnit();

            return HF.vector(newDirection, newMagnitude);
        },

        //This method disperses this vectors magnitude in each face direction, and returns a list of the resultant dispersed vectors
        //The total magnitude of the dispersed vectors will (approximately) equal the magnitude of this vector
        disperse: function()
        {
            var numFaces = HF.directions.faceDirections.length;

            var dispersedVectors = [];

            var totalAffinity = 0;
            for (var i = 0; i < numFaces; i++)
            {
                totalAffinity += this.affinityWithFace(i);
            }

            for (i = 0; i < numFaces; i++)
            {
                var dispersedMagnitude = this.magnitude * this.affinityWithFace(i) / totalAffinity;
                dispersedVectors.push(HF.vector(HF.directions.faceByIndex(i), dispersedMagnitude));
            }

            return dispersedVectors;
        },

        //This method returns the 'affinity' this vector has with the given face.
        affinityWithFace: function(faceIndex)
        {
            //var dispersionRate = HF.config.flowDisperseRate;

            var face = HF.directions.faceByIndex(faceIndex);

            var differenceFromFace = this.direction.subtract(face).length();

            var differenceFactor = 1 / differenceFromFace;

            return differenceFactor;
        }
    };
};