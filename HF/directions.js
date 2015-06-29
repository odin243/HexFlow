//HF Namespace
window.HF = window.HF || {};

HF.directions = {
    faceDirections: [
        new HF.hexPoint(1, -1, 0),
        new HF.hexPoint(0, -1, 1),
        new HF.hexPoint(-1, 0, 1),
        new HF.hexPoint(-1, 1, 0),
        new HF.hexPoint(0, 1, -1),
        new HF.hexPoint(1, 0, -1)
    ],

    indexToFace: [
        'r',
        'lr',
        'll',
        'l',
        'ul',
        'ur'
    ],

    faceToIndex: {
        'r':  0,
        'lr': 1,
        'll': 2,
        'l':  3,
        'ul': 4,
        'ur': 5
    },

    axisDirections: [
        new HF.hexPoint(.5, -1, .5),
        new HF.hexPoint(-.5, -.5, 1),
        new HF.hexPoint(-1, .5, .5),
        new HF.hexPoint(-.5, 1, -.5),
        new HF.hexPoint(.5, .5, -1),
        new HF.hexPoint(1, -.5, -.5)
    ],

    indexToAxis: [
        '-r',
        's',
        '-q',
        'r',
        '-s',
        'q'
    ],

    axisToIndex: {
        '-r': 0,
        's':  1,
        '-q': 2,
        'r':  3,
        '-s': 4,
        'q':  5
    },

    face: function(faceString)
    {
        return this.faceDirections[this.faceToIndex[faceString]];
    },

    faceByIndex: function(faceIndex)
    {
        return this.faceDirections[faceIndex];
    },

    axis: function(axisString)
    {
        return this.axisDirections[this.axisToIndex[axisString]];
    },

    axisByIndex: function(axisIndex)
    {
        return this.axisDirections[axisIndex];
    },

    get: function(directionString)
    {
        return this.axisToIndex.hasOwnProperty(directionString)
            ? this.axis(directionString)
            : this.faceToIndex.hasOwnProperty(directionString)
            ? this.face(directionString)
            : null;
    },

    //For a given direction, returns 6 equally spaced component directions
    //The order will be as follows: [direction, direction+60d, direction+120d,...,direction++300d]
    //Rotating a direction 60d to the right inverts the direction and shifts each cooridinate one space right.
    decompose: function(direction)
    {
        return [
            direction,
            new HF.hexPoint(-direction.s, -direction.q, -direction.r),
            new HF.hexPoint(direction.r, direction.s, direction.q),
            new HF.hexPoint(-direction.q, -direction.r, -direction.s),
            new HF.hexPoint(direction.s, direction.q, direction.r),
            new HF.hexPoint(-direction.r, -direction.s, -direction.q)
        ];
    },

    rotate: function(direction, anticlockwise)
    {
        if (anticlockwise === true)
        {
            return new HF.hexPoint(-direction.r, -direction.s, -direction.q);
        }
        else
        {
            return new HF.hexPoint(-direction.s, -direction.q, -direction.r);
        }
    }

};