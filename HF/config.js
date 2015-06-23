//HF Namespace
window.HF = window.HF || {};

//This is a static class that holds game configuration values
HF.config = function()
{
    return {
        //Frame rate in frames per second
        frameRate: 100,

        //0 to 1; 0 represents no dispersion, 1 represents complete dispersion.
        flowDispersionConstant: 0.1,

        //0 to 1; 1 represents no decay in magnitude, 0 represents complete loss of momentum.
        flowMagnitudeSustain: 0.1,

        //The size of a hex, corner to corner
        hexSize: 30,

        //The width of the hex border panels (used for showing flow direction)
        hexBorderWidth: 5,
        //Set to -1 to turn off borders

        //The power amount at which a hex will appear fully shaded
        hexFullPower: 100,

        //The color used for full power.
        hexFullColor: '#0000FF',

        //The flow magnitude at which a hex border will appear fully shaded
        hexFullFlow: 100,

        //The color used for full flow
        hexFlowColor: '#000000',

        debug: false
    };
}();