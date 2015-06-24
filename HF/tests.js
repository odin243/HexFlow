//HF Namespace
window.HF = window.HF || {};

if (!window.hasOwnProperty('Debug'))
    window.Debug = { writeln: function() {} };

//Singleton
HF.tests = function()
{
    return {
        runAllTests: function()
        {
            this.defaultHexPointTest();
            this.hexPointArithmeticTest();
            this.directionTest();
            this.defaultVectorTest();
            this.vectorAdditionTest();
            this.vectorDispersionTest();
            this.tileUpdateTest();
            this.visualTest();
            this.gameEngineTest();
        },

        complain: function(name)
        {
            console.log('FAIL', name);
        },

        hexPointEqual: function(name, a, b)
        {
            if (!(a.q === b.q && a.s === b.s && a.r === b.r))
            {
                this.complain(name);
            }
        },

        intEqual: function(name, a, b)
        {
            if (!(a === b))
            {
                this.complain(name);
            }
        },

        hexPointArrayEqual: function(name, a, b)
        {
            this.intEqual(name, a.length, b.length);
            for (var i = 0; i < a.length; i++)
            {
                this.hexPointEqual(name, a[i], b[i]);
            }
        },

        defaultHexPointTest: function()
        {
            Debug.writeln('defaultHexPointTest');
            var p1 = new HF.hexPoint();
            Debug.writeln('q: ' + p1.q);
            Debug.writeln('r: ' + p1.r);
            Debug.writeln('s: ' + p1.s);

            if (p1.q !== 0 || p1.r !== 0 || p1.s !== 0)
            {
                this.complain('defaultHexPointTest - Expected all coordinates to be 0');
            }

            Debug.writeln('');
        },

        hexPointArithmeticTest: function()
        {
            this.hexPointEqual('hex_add', new HF.hexPoint(4, -10, 6), new HF.hexPoint(1, -3, 2).add(new HF.hexPoint(3, -7, 4)));
            this.hexPointEqual('hex_subtract', new HF.hexPoint(-2, 4, -2), new HF.hexPoint(1, -3, 2).subtract(new HF.hexPoint(3, -7, 4)));
        },

        directionTest: function()
        {
            this.hexPointEqual('hex_direction', new HF.hexPoint(0, 1, -1), HF.directions.faceByIndex(4));
        },

        defaultVectorTest: function()
        {
            Debug.writeln('defaultVectorTest');
            var v1 = new HF.vector();
            Debug.writeln('q: ' + v1.direction.q);
            Debug.writeln('r: ' + v1.direction.r);
            Debug.writeln('s: ' + v1.direction.s);
            Debug.writeln('magnitude: ' + v1.magnitude);

            this.hexPointEqual('defaultVectorTest - all coordinates should be 0', v1.direction, new HF.hexPoint(0, 0, 0));
            this.intEqual('defaultVectorText - magnitude should be 0', v1.magnitude, 0);

            Debug.writeln('');
        },

        vectorAdditionTest: function()
        {
            Debug.writeln('vectorAdditionTest');
            var p1 = new HF.hexPoint(1, -1, 0);
            var p2 = HF.directions.axis('r');
            var v1 = new HF.vector(p1, 10);
            var v2 = new HF.vector(p2, 5);
            var v3 = v1.add(v2);
            Debug.writeln('q: ' + v3.direction.q);
            Debug.writeln('r: ' + v3.direction.r);
            Debug.writeln('s: ' + v3.direction.s);
            Debug.writeln('magnitude: ' + v3.magnitude);

            Debug.writeln('');
        },

        vectorDispersionTest: function()
        {
            Debug.writeln('vectorDispersionTest');
            var p1 = new HF.hexPoint(1, 1, -2).toUnit();
            var v1 = new HF.vector(p1, 10);
            var dispersedV1 = v1.disperse();
            var magnitude = 0;
            for (var i = 0; i < dispersedV1.length; i++)
            {
                var dispersedVector = dispersedV1[i];
                magnitude += dispersedVector.magnitude;
                Debug.writeln(dispersedVector.direction.toString() + ': ' + dispersedVector.magnitude);
            }
            Debug.writeln('dispersed magnitude: ' + magnitude);

            Debug.writeln('');
        },

        tileUpdateTest: function()
        {
            Debug.writeln('tileUpdateTest');
            Debug.writeln('Creating map of radius 1');
            var map = HF.hexMap(1);

            Debug.writeln('Initial map state');
            map.debugPrint();

            var origin = HF.hexTile(new HF.hexPoint(), 21, new HF.vector(HF.directions.face('ur'), 21), 'player1');
            var originUpdateList = HF.hexTileDictionary();

            originUpdateList.add(origin);
            map = map.updateTiles(originUpdateList);

            Debug.writeln('Updated origin to have 21 power, and flow 21 in the upper-right face direction');
            map.debugPrint();

            var updates = map.getTileAtPoint(new HF.hexPoint()).calcEffectOnNeighbors();

            Debug.writeln('Caluculated the effect on neighbors:');
            for (var i = 0; i < updates.length; i++)
            {
                var update = updates[i];
                Debug.writeln(update.location.toString() + ' ' + update.power);
            }

            var updateList = HF.hexTileDictionary();
            updateList.addMany(updates);

            map = map.updateTiles(updateList);

            Debug.writeln('Updated map state with new information');
            map.debugPrint();

            Debug.writeln('');
        },

        gameEngineTest: function()
        {
            if (HF.config.debug === true)
            {
                Debug.writeln('gameEngineTest');
                Debug.writeln('Creating map of radius 3');
            }

            //Initialization
            var player1 = HF.hexTile(new HF.hexPoint(-1, 0, 1), 100, new HF.vector(HF.directions.face('ur'), 50), '#FF0000', true);
            var player2 = HF.hexTile(new HF.hexPoint(1, 0, -1), 100, new HF.vector(HF.directions.face('ll'), 50), '#0000FF', true);
            var map = HF.hexMap(1, [player1, player2]);

            var engine = HF.engine(map, []);

            if (HF.config.debug === true)
            {
                Debug.writeln('Initial map state');
                engine.currentMap.debugPrint();
            }

            if (HF.config.debug === true)
            {
                engine.afterIterate = function()
                {
                    Debug.writeln('Updated map state with new information');
                    engine.currentMap.debugPrint();
                };
            }

            engine.run();
        },

        visualTest: function()
        {
            var map = HF.hexMap(3, [HF.hexTile(new HF.hexPoint(), 50)]);
            var scene = HF.visual.scene(HF.visual.point(500,300));
            scene.drawMap(map, 'body');
        }
    };
}();