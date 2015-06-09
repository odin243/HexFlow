//HF Namespace
HF = this.HF != undefined ? this.HF : {};

HF.vector = function (direction, magnitude)
{
    return {
        direction: direction,
        magnitude: magnitude,

        add: function (otherVector)
        {
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