//HF Namespace
HF = this.HF != undefined ? this.HF : {};

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
            
            var newMagnitude = (Math.abs(combinedPath.q) + Math.abs(combinedPath.r) + Math.abs(combinedPath.s))/2;
            var newDirection = newMagnitude != 0 ? combinedPath.scale(1 / newMagnitude) : HF.hexPoint(0, 0, 0);

            //Ensure q + r + s = 0
            newDirection = newDirection.validate();

            return HF.vector(newDirection, newMagnitude);
        }
    };
}