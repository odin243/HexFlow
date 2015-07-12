//HF Namespace
window.HF = window.HF || {};

HF.levelManager =
{
    levels: {},
    registerLevel: function (name, level)
    {
        this.levels = this.levels || {};

        this.levels[name] = level;
    },

    loadLevel: function (name)
    {
        if (this.levels.hasOwnProperty(name))
            HF.state.initialize(this.levels[name]);
    }
};

HF.levels = function ()
{
    var player1 = new HF.hexTile(new HF.hexPoint(-10, 0, 10), 1000, new HF.vector(), '#FF0000', 100);
    var player2 = new HF.hexTile(new HF.hexPoint(0, 10, -10), 1000, new HF.vector(), '#0000FF', 100);
    var player3 = new HF.hexTile(new HF.hexPoint(10, -10, 0), 1000, new HF.vector(), '#00FF00', 100);
    var neutralSource = new HF.hexTile(new HF.hexPoint(), 0, new HF.vector(), null, 300);
    var map = HF.hexMapGenerator.radius(10);
    var level = HF.level(map, [player1, player2, player3, neutralSource]);

    HF.levelManager.registerLevel('test-3-corners', level);

    var level2 = HF.level(HF.hexMapGenerator.radius(10), [new HF.hexTile(new HF.hexPoint(0, 0, 0), 1, new HF.vector(HF.directions.face('r'), 1), '#FF0000', 1)]);
    HF.levelManager.registerLevel('test-dispersion', level2);
}();