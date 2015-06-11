//HF Namespace
window.HF = window.HF || {};

HF.directions = {
    faceDirections: [
        HF.hexPoint( 1,  0, -1),
        HF.hexPoint( 1, -1,  0),
        HF.hexPoint( 0, -1,  1),
        HF.hexPoint(-1,  0,  1),
        HF.hexPoint( 0,  1, -1),
        HF.hexPoint(-1,  1,  0)
    ],

    indexToFace: [
        'ur',
        'r',
        'lr',
        'll',
        'ul',
        'l'
    ],

    faceToIndex: {
        'ur': 0,
        'r': 1,
        'lr': 2,
        'll': 3,
        'ul': 4,
        'l': 5
    },

    face: function (faceString) {
        return faceDirections[faceToIndex[faceString]];
    },

    faceByIndex: function(faceIndex) {
        return faceDirections[faceIndex];
    },

    axis: 
    {
        'q' : HF.hexPoint( 1  ,  -0.5, -0.5),
        'r' : HF.hexPoint(-0.5,   1  , -0.5),
        's' : HF.hexPoint(-0.5,  -0.5,  1  ),
        'qr': HF.hexPoint( 0.5,   0.5, -1  ),
        'qs': HF.hexPoint( 0.5,  -1  ,  0.5),
        'rs': HF.hexPoint(-1  ,   0.5,  0.5)
    },

    //This method takes a point and scales it to a unit direction
    fromPoint: function(point) {
        var magnitude = point.length();
        var direction = point.scale(1 / magnitude);
        direction = direction.validate();
        return direction;
    }
};