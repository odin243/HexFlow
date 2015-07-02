//HF Namespace
window.HF = window.HF || {};

//The engine object handles the main game loop, which updates the game state and causes new scenes to be rendered.
//The constructor takes in the current game map, and the list of players
//NOTE: This is a MUTABLE object! The current game state changes on each run of the loop! It should not be referenced from this object EVER
HF.engine = function(level, players)
{
    return {
        level: level,
        currentMap: null,
        players: players,
        scene: HF.visual.scene(),
        keepRunning: true,
        //run is the main game loop
        run: function()
        {
            if (this.iterateInterval || this.renderInterval)
                this.stop();

            var engine = this;
            var frameRate = HF.config.frameRate || 30;
            var turnRate = HF.config.turnRate || 100;

            engine.keepRunning = true;
            this.iterateInterval = setInterval(function() {
                engine.iterate();
                //return !engine.keepRunning;
            }, 1000 / turnRate);
            this.renderInterval = setInterval(function () {
                engine.render();
                //return !engine.keepRunning;
            }, 1000 / frameRate);
        },
        stop: function()
        {
            this.keepRunning = false;
            if (this.iterateInterval)
                clearInterval(this.iterateInterval);
            if (this.renderInterval)
                clearInterval(this.renderInterval);
        },
        restart: function()
        {
            this.stop();
            this.currentMap = null;
            this.run();
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
            if (!this.currentMap)
                this.currentMap = this.level.map;
            //Step 1:
            //Apply the queued inputs of all players to the current state.
            //This will create a list of update objects

            //list allUpdates
            //for each player in players
            //  update = gameState.applyPlayerActions(player.queuedActions)
            //  add update to allUpdates
            //next player

            if (this.actions !== undefined)
            {
                while (this.actions.length > 0)
                {
                    var action = this.actions[0].action;
                    action(this.actions[0].args, this.currentMap);
                    this.actions.shift();
                }
            }

            //Step 2:
            //Iterate the current game state to produce a set of updates based on game rules

            var updates = this.currentMap.calculateAllTileEffects();
            //add stateUpdates to allUpdates

            //Step 3:
            //Create the next game state based on the current game state + all updates

            var newMap = this.currentMap.updateTiles(updates);

            //Step 4:
            //render the new state

            this.lastMap = this.currentMap;

            this.currentMap = newMap;

            if (this.hasOwnProperty('afterIterate'))
                this.afterIterate();

            if (doRender === true)
                this.render();
        },

        render: function()
        {
            if (this.lastMap != undefined)
                this.scene.drawMap(this.lastMap, '.mainPanel');
        }

    };
};