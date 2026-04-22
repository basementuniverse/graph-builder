"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointToQuadraticBezierDistance = exports.getCurveGeometry = exports.curveFromTo = void 0;
const utils_1 = require("@basementuniverse/utils");
const vec_1 = require("@basementuniverse/vec");
function curveFromTo(context, a, b, initialDirection, finalDirection, gridSize) {
    context.beginPath();
    const { cp1, cp2, join } = getCurveGeometry(a, b, initialDirection, finalDirection, gridSize);
    context.moveTo(a.x, a.y);
    context.quadraticCurveTo(cp1.x, cp1.y, join.x, join.y);
    context.quadraticCurveTo(cp2.x, cp2.y, b.x, b.y);
    context.stroke();
}
exports.curveFromTo = curveFromTo;
function getCurveGeometry(a, b, initialDirection, finalDirection, gridSize) {
    const distance = vec_1.vec2.len(vec_1.vec2.sub(a, b));
    const minDistance = gridSize * 4;
    let curveStrength = gridSize;
    if (distance < minDistance) {
        curveStrength = (0, utils_1.lerp)(0, gridSize, (0, utils_1.clamp)(distance / minDistance, 0, 1));
    }
    const cp1 = vec_1.vec2.add(a, vec_1.vec2.mul(initialDirection, curveStrength));
    const cp2 = vec_1.vec2.add(b, vec_1.vec2.mul(finalDirection, curveStrength));
    const join = vec_1.vec2.div(vec_1.vec2.add(cp1, cp2), 2);
    return { cp1, cp2, join };
}
exports.getCurveGeometry = getCurveGeometry;
function pointToQuadraticBezierDistance(p, a, cp, b, t) {
    const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cp.x + t * t * b.x;
    const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cp.y + t * t * b.y;
    return vec_1.vec2.len(vec_1.vec2.sub(p, { x, y }));
}
exports.pointToQuadraticBezierDistance = pointToQuadraticBezierDistance;
//# sourceMappingURL=curve.js.map