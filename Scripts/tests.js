window.HF = window.HF || {};

// Tests
HF.tests = function () {
    var Hex = HF.hex;
    return {
        complain: function(name) {
            console.log("FAIL", name);
        },

        equal_hex: function(name, a, b) {
            if (!(a.q === b.q && a.s === b.s && a.r === b.r))
            {
                complain(name);
            }
        },

        equal_offsetcoord: function(name, a, b) {
            if (!(a.col === b.col && a.row === b.row))
            {
                complain(name);
            }
        },

        equal_int: function(name, a, b) {
            if (!(a === b))
            {
                complain(name);
            }
        },

        equal_hex_array: function(name, a, b) {
            equal_int(name, a.length, b.length);
            for (var i = 0; i < a.length; i++)
            {
                equal_hex(name, a[i], b[i]);
            }
        },

        test_hex_arithmetic: function() {
            equal_hex("hex_add", Hex(4, -10, 6), Hex(1, -3, 2).add(Hex(3, -7, 4)));
            equal_hex("hex_subtract", Hex(-2, 4, -2), Hex(1, -3, 2).subtract(Hex(3, -7, 4)));
        },

        test_hex_direction: function() {
            equal_hex("hex_direction", Hex(0, -1, 1), HF.hexDirection(2));
        },

        test_hex_neighbor: function() {
            equal_hex("hex_neighbor", Hex(1, -3, 2), Hex(1, -2, 1).neighbor(2));
        },

        test_hex_diagonal: function() {
            equal_hex("hex_diagonal", Hex(-1, -1, 2), Hex(1, -2, 1).diagonalNeighbor(3));
        },

        test_hex_distance: function() {
            equal_int("hex_distance", 7, Hex(3, -7, 4).distance(Hex(0, 0, 0)));
        },

        test_hex_round: function() {
            var a = Hex(0, 0, 0);
            var b = Hex(1, -1, 0);
            var c = Hex(0, -1, 1);
            equal_hex("hex_round 1", Hex(5, -10, 5), Hex(0, 0, 0).lerp(Hex(10, -20, 10), 0.5).round());
            equal_hex("hex_round 2", a, a.lerp(b, 0.499).round());
            equal_hex("hex_round 3", b, a.lerp(b, 0.501).round());
            equal_hex("hex_round 4", a, Hex(a.q * 0.4 + b.q * 0.3 + c.q * 0.3, a.r * 0.4 + b.r * 0.3 + c.r * 0.3, a.s * 0.4 + b.s * 0.3 + c.s * 0.3).round());
            equal_hex("hex_round 5", c, Hex(a.q * 0.3 + b.q * 0.3 + c.q * 0.4, a.r * 0.3 + b.r * 0.3 + c.r * 0.4, a.s * 0.3 + b.s * 0.3 + c.s * 0.4).round());
        },

        test_hex_linedraw: function() {
            equal_hex_array("hex_linedraw", [Hex(0, 0, 0), Hex(0, -1, 1), Hex(0, -2, 2), Hex(1, -3, 2), Hex(1, -4, 3), Hex(1, -5, 4)], Hex(0, 0, 0).linedraw(Hex(1, -5, 4)));
        },

        test_layout: function() {
            var h = Hex(3, 4, -7);
            //var flat = Layout(layout_flat, Point(10, 15), Point(35, 71));
            //equal_hex("layout", h, hex_round(pixel_to_hex(flat, hex_to_pixel(flat, h))));
            var hexGrid = HF.hexGrid(HF.point(10, 15), HF.point(35, 71));
            equal_hex("layout", h, hexGrid.pixelToHex(hexGrid.hexToPixel(h)).round());
        },

        //test_conversion_roundtrip: function() {
        //    var a = Hex(3, 4, -7);
        //    var b = OffsetCoord(1, -3);
        //    equal_hex("conversion_roundtrip even-q", a, qoffset_to_cube(EVEN, qoffset_from_cube(EVEN, a)));
        //    equal_offsetcoord("conversion_roundtrip even-q", b, qoffset_from_cube(EVEN, qoffset_to_cube(EVEN, b)));
        //    equal_hex("conversion_roundtrip odd-q", a, qoffset_to_cube(ODD, qoffset_from_cube(ODD, a)));
        //    equal_offsetcoord("conversion_roundtrip odd-q", b, qoffset_from_cube(ODD, qoffset_to_cube(ODD, b)));
        //    equal_hex("conversion_roundtrip even-r", a, roffset_to_cube(EVEN, roffset_from_cube(EVEN, a)));
        //    equal_offsetcoord("conversion_roundtrip even-r", b, roffset_from_cube(EVEN, roffset_to_cube(EVEN, b)));
        //    equal_hex("conversion_roundtrip odd-r", a, roffset_to_cube(ODD, roffset_from_cube(ODD, a)));
        //    equal_offsetcoord("conversion_roundtrip odd-r", b, roffset_from_cube(ODD, roffset_to_cube(ODD, b)));
        //},

        //test_offset_from_cube: function() {
        //    equal_offsetcoord("offset_from_cube even-q", OffsetCoord(1, 3), qoffset_from_cube(EVEN, Hex(1, 2, -3)));
        //    equal_offsetcoord("offset_from_cube odd-q", OffsetCoord(1, 2), qoffset_from_cube(ODD, Hex(1, 2, -3)));
        //},

        //test_offset_to_cube: function() {
        //    equal_hex("offset_to_cube even-", Hex(1, 2, -3), qoffset_to_cube(EVEN, OffsetCoord(1, 3)));
        //    equal_hex("offset_to_cube odd-q", Hex(1, 2, -3), qoffset_to_cube(ODD, OffsetCoord(1, 2)));
        //},

        runAllTests: function() {
            test_hex_arithmetic();
            test_hex_direction();
            test_hex_neighbor();
            test_hex_diagonal();
            test_hex_distance();
            test_hex_round();
            test_hex_linedraw();
            test_layout();
            //test_conversion_roundtrip();
            //test_offset_from_cube();
            //test_offset_to_cube();
        }
    }
}
