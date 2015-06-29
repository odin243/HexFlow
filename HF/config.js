//HF Namespace
window.HF = window.HF || {};

//This is a static class that holds game configuration values
HF.config =
{
    //Frame rate in frames per second
    frameRate: 10,

    //Turn rate in turns (ticks) per second
    turnRate: 100,

    //0 to 1; 0 represents no dispersion, 1 represents complete dispersion.
    flowDispersionConstant: 0.2,

    //0 to 1; 1 represents no decay in magnitude, 0 represents complete loss of momentum.
    flowMagnitudeSustain: .8,

    //0 to 1; 0 allows standing liquid, 1 disperses all standing liquid.
    standingFlowFactor: 1,

    //If true, nothing will stop power from flowing off the side of the map.
    allowFlowOffMap: false,

    //The size of a hex, corner to corner
    hexSize: 30,

    //The width of the hex border panels (used for showing flow direction)
    //Set to -1 to turn off borders
    hexFlowPanelWidth: 5,

    sourceBorderWidth: 3,

    hexBorderWidth: 1,
    
    //The power amount at which a hex will appear fully shaded
    hexFullPower: 100,

    //The color used for full power.
    hexFullColor: '#0000FF',

    //The flow magnitude at which a hex border will appear fully shaded
    hexFullFlow: 100,

    //The color used for full flow
    hexFlowColor: '#000000',

    gridBackgroundColor: '#000000',
    debug: false
};