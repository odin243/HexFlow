//HF Namespace
window.HF = window.HF || {};

HF.hexTile = function(location)
{
    if (location == undefined)
    {
        console.error('HF.hexTile - invalid argument - returning null');
        return null;
    }

    return {
        location: location,
        power: 0,
        flow: HF.vector(),
        owner: null,

        getIdentifier: function()
        {
            return location.toString();
        },

        calcEffectOnNeighbors: function()
        {
        }
    };
}