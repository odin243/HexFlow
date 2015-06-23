//HF Namespace
window.HF = window.HF || {};

HF.directions = {
    faceDirections: [
        HF.hexPoint(1, -1, 0),
        HF.hexPoint(0, -1, 1),
        HF.hexPoint(-1, 0, 1),
        HF.hexPoint(-1, 1, 0),
        HF.hexPoint(0, 1, -1),
        HF.hexPoint(1, 0, -1)
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
        HF.hexPoint(.5, -1, .5),
        HF.hexPoint(-.5, -.5, 1),
        HF.hexPoint(-1, .5, .5),
        HF.hexPoint(-.5, 1, -.5),
        HF.hexPoint(.5, .5, -1),
        HF.hexPoint(1, -.5, -.5)
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
    }
};