"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointInCircle = exports.pointInRectangle = void 0;
const vec_1 = require("@basementuniverse/vec");
function pointInRectangle(point, rectangle) {
    return (point.x >= rectangle.position.x &&
        point.x <= rectangle.position.x + rectangle.size.x &&
        point.y >= rectangle.position.y &&
        point.y <= rectangle.position.y + rectangle.size.y);
}
exports.pointInRectangle = pointInRectangle;
function pointInCircle(point, circle) {
    return vec_1.vec2.len(vec_1.vec2.sub(point, circle.position)) <= circle.radius;
}
exports.pointInCircle = pointInCircle;
//# sourceMappingURL=point.js.map