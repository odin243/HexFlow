//HF Namespace
window.HF = window.HF || {};

//This is a static class that holds game configuration values
HF.config = function()
{
    return {
        //0 to 1; 0 represents no dispersion, 1 represents complete dispersion.
        flowDispersionConstant: .2,

        //The size of a hex, corner to corner
        hexSize: 30
    };
}();