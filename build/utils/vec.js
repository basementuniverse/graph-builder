"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundVec = exports.clampVec = void 0;
const vec_1 = require("@basementuniverse/vec");
function clampVec(value, min, max) {
    return (0, vec_1.vec2)(Math.min(Math.max(value.x, min.x), max.x), Math.min(Math.max(value.y, min.y), max.y));
}
exports.clampVec = clampVec;
function roundVec(value, step) {
    return (0, vec_1.vec2)(Math.round(value.x / step) * step, Math.round(value.y / step) * step);
}
exports.roundVec = roundVec;
//# sourceMappingURL=vec.js.map