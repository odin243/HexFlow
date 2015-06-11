//HF Namespace
window.HF = window.HF || {};

//Singleton
HF.tests = function () {
    return {
        runAllTests: function () {
            this.vectorAdditionTest();
            this.defaultHexPointTest();
            this.defaultVectorTest();
        },

        vectorAdditionTest: function () {
            Debug.writeln("vectorAdditionTest");
            var p1 = HF.hexPoint(1, -1, 0);
            var p2 = HF.directions.unit['r'];
            var v1 = HF.vector(p1, 10);
            var v2 = HF.vector(p2, 5);
            var v3 = v1.add(v2);
            Debug.writeln("q: " + v3.direction.q);
            Debug.writeln("r: " + v3.direction.r);
            Debug.writeln("s: " + v3.direction.s);
            Debug.writeln("magnitude: " + v3.magnitude);

            Debug.writeln("");
        },

        defaultHexPointTest: function () {
            Debug.writeln("defaultHexPointTest");
            var p1 = HF.hexPoint();
            Debug.writeln("q: " + p1.q);
            Debug.writeln("r: " + p1.r);
            Debug.writeln("s: " + p1.s);

            if (p1.q != 0 || p1.r != 0 || p1.s != 0) {
                console.error("defaultHexPointTest - Expected all coordinates to be 0");
            }

            Debug.writeln("");
        },

        defaultVectorTest: function () {
            Debug.writeln("defaultVectorTest");
            var v1 = HF.vector();
            Debug.writeln("q: " + v1.direction.q);
            Debug.writeln("r: " + v1.direction.r);
            Debug.writeln("s: " + v1.direction.s);
            Debug.writeln("magnitude: " + v1.magnitude);

            if (v1.direction.q != 0 || v1.direction.r != 0 || v1.direction.s != 0 || v1.magnitude != 0) {
                console.error("defaultVectorTest - Expected all direction coordinates and magnitude to be 0");
            }

            Debug.writeln("");
        }
    };
}();