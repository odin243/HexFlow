//HF Namespace
window.HF = window.HF || {};

HF.directions = {
    faceDirections: [
        new HF.hexPoint( 1, -1,  0),
        new HF.hexPoint( 1,  0, -1),
        new HF.hexPoint( 0,  1, -1),
        new HF.hexPoint(-1,  1,  0),
        new HF.hexPoint(-1,  0,  1),
        new HF.hexPoint( 0, -1,  1)
    ],

    indexToFace: [
        'r',
        'ur',
        'ul',
        'l',
        'll',
        'lr'
    ],

    faceToIndex: {
        'r' : 0,
        'ur': 1,
        'ul': 2,
        'l' : 3,
        'll': 4,
        'lr': 5
    },

    face: function(faceString)
    {
        return this.faceDirections[this.faceToIndex[faceString]];
    },

    faceByIndex: function(faceIndex)
    {
        return this.faceDirections[faceIndex];
    },

    axis:
    {
        'q': new HF.hexPoint(1, -0.5, -0.5),
        'r': new HF.hexPoint(-0.5, 1, -0.5),
        's': new HF.hexPoint(-0.5, -0.5, 1),
        'qr': new HF.hexPoint(0.5, 0.5, -1),
        'qs': new HF.hexPoint(0.5, -1, 0.5),
        'rs': new HF.hexPoint(-1, 0.5, 0.5)
    }
};