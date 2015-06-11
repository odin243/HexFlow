//HF Namespace
window.HF = window.HF || {};

//This class represents a single state of the game.
//It is essentially a model for the game grid.
HF.state = function(map) {
    return {
        //The map is an object which contains all the individual tiles on the game grid
        map: map,
        //applyPlayerActions takes a list of player inputs and returns a list of update objects
        applyPlayerActions: function (listOfActions) { },
        //iterate caluclates effects of flows in all current tiles and returns a list of corresponding update actions
        iterate: function () { },
        //apply takes a list of updates, and returns a new game state that reflects those updates
        apply: function (listOfUpdates) { }
    };
};