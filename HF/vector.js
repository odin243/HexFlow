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
            
            //Here's the fun part. Find the unit vector and the magnitude. Not too hard.
            //Step 1: Add up the positive and negative components separately
            var positiveMagnitude = 0;
            var negativeMagnitude = 0;
            var positiveComponents = 0;
            var negativeComponents = 0;
            
            var checkComponent = function (value)
            {
                if (value >= 0) {
                    positiveMagnitude += value;
                    positiveComponents++;
                }
                else {
                    negativeMagnitude += value;
                    negativeComponents++;
                }
            }

            checkComponent(combinedPath.q);
            checkComponent(combinedPath.r);
            checkComponent(combinedPath.s);

            //Use magnitude from whichever directionality (positive or negative) has more components
            var newMagnitude = positiveComponents > negativeComponents ? positiveMagnitude : -negativeMagnitude;

            //Step 2: Divide combined path by new magnitude
            //If magnitude is 0, use zero direction
            var newDirection = newMagnitude != 0 ? combinedPath.scale(1 / newMagnitude) : HF.hexPoint(0, 0, 0);

            //Step 3: Ensure q + r + s = 0
            newDirection = newDirection.validate();

            return HF.vector(newDirection, newMagnitude);
        }        
    };
}