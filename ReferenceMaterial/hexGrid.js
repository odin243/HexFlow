﻿window.HF = window.HF || {};

HF.point = function(x, y) {
    return { x: x, y: y };
};

HF.orientation = function(f0, f1, f2, f3, b0, b1, b2, b3, startAngle) {
    return { f0: f0, f1: f1, f2: f2, f3: f3, b0: b0, b1: b1, b2: b2, b3: b3, startAngle: startAngle };
};

HF.hexGrid = function(size, origin) {
    return {
        orientation: HF.orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0),
        size: size,
        origin: origin,
        pixelToHex: function(point) {
            var m = this.orientation;
            var s = this.size;
            var o = this.origin;
            var pt = HF.point((point.x - o.x) / s.x, (point.y - o.y) / s.y);
            var q = m.b0 * pt.x + m.b1 * pt.y;
            var r = m.b2 * pt.x + m.b3 * pt.y;
            return HF.hex(q, r, -q - r);
        },
        hexToPixel: function(hex) {
            var orientation = this.orientation;
            var s = this.size;
            var o = this.origin;
            var x = (orientation.f0 * hex.q + orientation.f1 * hex.r) * s.x;
            var y = (orientation.f2 * hex.q + orientation.f3 * hex.r) * s.y;
            return HF.point(x + o.x, y + o.y);
        },
        hexCornerOffset: function(cornerIndex) {
            var m = this.orientation;
            var s = this.size;
            var angle = 2.0 * Math.PI * (cornerIndex + m.start_angle) / 6;
            return HF.point(s.x * Math.cos(angle), s.y * Math.sin(angle));
        },
        polygonCorners: function(hex) {
            var corners = [];
            var center = this.hexToPixel(hex);
            for (var i = 0; i < 6; i++) {
                var offset = this.hexCornerOffset(i);
                corners.push(HF.point(center.x + offset.x, center.y + offset.y));
            }
            return corners;
        }
    };
};