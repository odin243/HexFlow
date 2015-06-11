//HF Namespace
window.HF = window.HF || {};

HF.vector = function (direction, magnitude)
{
    if (magnitude != undefined && isNaN(magnitude))
    {
        console.error("HF.vector - invalid argument - returning null");
        return null;
    }

    return {
        direction: direction || HF.hexPoint(),
        magnitude: magnitude || 0,

        add: function (otherVector)
        {
            if (otherVector == undefined) {
                console.error("HF.vector.add - invalid argument - returning null");
                return null;
            }

            var thisPath = this.direction.scale(this.magnitude);
            var otherPath = otherVector.direction.scale(otherVector.magnitude);

            var combinedPath = thisPath.add(otherPath);
            
            var newMagnitude = combinedPath.length();

            var newDirection = HF.directions.fromPoint(combinedPath);

            return HF.vector(newDirection, newMagnitude);
        }
    };
}