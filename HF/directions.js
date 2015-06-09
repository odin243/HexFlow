//HF Namespace
HF = this.HF != undefined ? this.HF : {};

HF.directions =
{
    face: 
    {
        'ur': HF.point( 1,  0, -1),
        'ul': HF.point( 0,  1, -1),
        'l' : HF.point(-1,  1,  0),
        'll': HF.point(-1,  0,  1),
        'lr': HF.point( 0, -1,  1),
        'r' : HF.point( 1, -1,  0)
    },

    unit: 
    {
        'q' : HF.point( 1  ,  -0.5, -0.5),
        'r' : HF.point(-0.5,   1  , -0.5),
        's' : HF.point(-0.5,  -0.5,  1  ),
        'qr': HF.point( 0.5,   0.5, -1  ),
        'qs': HF.point( 0.5,  -1  ,  0.5),
        'rs': HF.point(-1  ,   0.5,  0.5)
    }
};