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

            var combinedPath = thisPath.addPoint(otherPath);
            
            //Here's the fun part. Find the unit vector and the magnitude. Not too hard.
            //Step 1: Add up the positive and negative components separately
            //Track number of positive amd negative components.
            //(Consider 0 positive here for our purposes)
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
            var newMagnitude = positiveComponents > negativeComponents ? positiveMagnitude : -negativeComponents;

            //Step 2: Divide combined path by new magnitude
            //If magnitude is 0, use zero direction
            var newDirection = newMagnitude != 0 ? combinedPath.scale(1 / newMagnitude) : HF.point(0, 0, 0);

            //Step 3: Ensure q + r + s = 0
            //Floating point math can cause increasing disparagement if unchecked, let's stop it here. 
            //Set the odd directionality to the inverse of the sum of it's brethren
            var sumAndInvert = function (val1, val2) { return -1 * (val1 + val2)};
            if (positiveComponents > negativeComponents)
            {
                if (newDirection.q < 0)
                    newDirection.q = sumAndInvert(newDirection.r, newDirection.s);
                if (newDirection.r < 0)
                    newDirection.r = sumAndInvert(newDirection.q, newDirection.s);
                if (newDirection.s < 0)
                    newDirection.s = sumAndInvert(newDirection.q, newDirection.r);
            }
            else
            {
                if (newDirection.q > 0)
                    newDirection.q = sumAndInvert(newDirection.r, newDirection.s);
                if (newDirection.r > 0)
                    newDirection.r = sumAndInvert(newDirection.q, newDirection.s);
                if (newDirection.s > 0)
                    newDirection.s = sumAndInvert(newDirection.q, newDirection.r);
            }

            return HF.vector(newDirection, newMagnitude);
        }
    };
}