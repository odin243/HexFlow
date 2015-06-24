//HF Namespace
window.HF = window.HF || {};

//The engine object handles the main game loop, which updates the game state and causes new scenes to be rendered.
//The constructor takes in the current game map, and the list of players
//NOTE: This is a MUTABLE object! The current game state changes on each run of the loop! It should not be referenced from this object EVER
HF.engine = function(hexMap, players)
{
    return {
        currentMap: hexMap,
        players: players,
        scene: HF.visual.scene(HF.visual.point(500, 300)),
        //run is the main game loop
        run: function()
        {
            var engine = this;
            var frameRate = HF.config.frameRate || 30;
            var turnRate = HF.config.turnRate || 100;
            this.turnIntervalId = setInterval(function() {
                engine.iterate();
            }, 1000 / turnRate);
            this.frameIntervalId = setInterval(function() {
                engine.render();
            }, 1000 / frameRate);
        },
        stop: function()
        {
            clearInterval(this.turnIntervalId);
            clearInterval(this.frameIntervalId);
        },
        test: function(turnsToTest)
        {
            var engine = this;
            var turnRate = HF.config.turnRate || 1;
            if (turnsToTest > 0)
            {
                engine.iterate(true);
                setTimeout(function() {
                    engine.test(turnsToTest - 1);
                }, 1000 / turnRate);
            }
        },

        iterate: function(doRender)
        {
            //Step 1:
            //Apply the queued inputs of all players to the current state.
            //This will create a list of update objects

            //list allUpdates
            //for each player in players
            //  update = gameState.applyPlayerActions(player.queuedActions)
            //  add update to allUpdates
            //next player

            //Step 2:
            //Iterate the current game state to produce a set of updates based on game rules

            var updates = this.currentMap.calculateAllTileEffects();
            //add stateUpdates to allUpdates

            //Step 3:
            //Create the next game state based on the current game state + all updates

            var newMap = this.currentMap.updateTiles(updates);

            //Step 4:
            //render the new state

            this.currentMap = newMap;

            if (this.hasOwnProperty('afterIterate'))
                this.afterIterate();

            if (doRender === true)
                this.render();
        },

        render: function()
        {
            this.scene.drawMap(this.currentMap, 'body');
        }

    };
};