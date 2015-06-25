//HF Namespace
window.HF = window.HF || {};

//This class represents a single state of the game.
//It is essentially a model for the game grid.
HF.state = 
{
    initialize: function (map)
    {
        this.map = map;
        this.engine = HF.engine(map, []);
    },

    start: function (map)
    {
        this.engine.run();
    },

    bufferAction: function (args, action)
    {
        if (this.engine.actions === undefined)
            this.engine.actions = [];

        this.engine.actions.push({ args: args, action: action });
    }
};