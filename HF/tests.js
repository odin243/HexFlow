//HF Namespace
HF = this.HF != undefined ? this.HF : {};

HF.tests = function ()
{
    var p1 = HF.hexPoint(1, -1, 0);
    var p2 = HF.directions.unit['r'];
    var v1 = HF.vector(p1, 10);
    var v2 = HF.vector(p2, 5);
    var v3 = v1.add(v2);
    Debug.writeln("q: " + v3.direction.q);
    Debug.writeln("r: " + v3.direction.r);
    Debug.writeln("s: " + v3.direction.s);
    Debug.writeln("magnitude: " + v3.magnitude);
}