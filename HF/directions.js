//HF Namespace
HF = this.HF != undefined ? this.HF : {};

HF.directions =
{
    face: 
    {
        'ur': HF.hexPoint( 1,  0, -1),
        'ul': HF.hexPoint( 0,  1, -1),
        'l' : HF.hexPoint(-1,  1,  0),
        'll': HF.hexPoint(-1,  0,  1),
        'lr': HF.hexPoint( 0, -1,  1),
        'r' : HF.hexPoint( 1, -1,  0)
    },

    unit: 
    {
        'q' : HF.hexPoint( 1  ,  -0.5, -0.5),
        'r' : HF.hexPoint(-0.5,   1  , -0.5),
        's' : HF.hexPoint(-0.5,  -0.5,  1  ),
        'qr': HF.hexPoint( 0.5,   0.5, -1  ),
        'qs': HF.hexPoint( 0.5,  -1  ,  0.5),
        'rs': HF.hexPoint(-1  ,   0.5,  0.5)
    }
};