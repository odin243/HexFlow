//HF Namespace
window.HF = window.HF || {};

//This class represents a single state of the game.
//It is essentially a model for the game grid.
HF.state = 
{
    initialize: function (level)
    {
        this.level = level;
        this.engine = HF.engine(level, []);
    },

    start: function ()
    {
        this.engine.run();
    },

    bufferAction: function (args, action)
    {
        if (!this.engine)
            return;

        if (this.engine.actions === undefined)
            this.engine.actions = [];

        this.engine.actions.push({ args: args, action: action });
    }
};