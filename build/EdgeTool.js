"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec_1 = require("@basementuniverse/vec");
const constants_1 = require("./constants");
class EdgeTool {
    constructor(a, theme) {
        this.a = a;
        this.pointerDirection = null;
        this.theme = theme;
        this.pointer = (0, vec_1.vec2)(a.position);
        this.smoothedFinalDirection = vec_1.vec2.mul(a.direction, -1);
    }
    update(pointer, pointerDirection = null) {
        this.pointer = (0, vec_1.vec2)(pointer);
        this.pointerDirection = pointerDirection ? (0, vec_1.vec2)(pointerDirection) : null;
        const quantizedDirection = this.quantizedDirectionFromPointer(this.pointer);
        const targetDirection = this.pointerDirection
            ? this.normalizedDirectionOrFallback(this.pointerDirection, quantizedDirection)
            : quantizedDirection;
        this.smoothedFinalDirection = this.easeDirection(this.smoothedFinalDirection, targetDirection, EdgeTool.FINAL_DIRECTION_EASE);
    }
    getDrawData() {
        const from = vec_1.vec2.add(this.a.position, vec_1.vec2.mul(this.a.direction, constants_1.EDGE_CURVE_ENDPOINT_OFFSET));
        const toDirection = this.smoothedFinalDirection;
        const to = vec_1.vec2.add(this.pointer, vec_1.vec2.mul(toDirection, constants_1.EDGE_CURVE_ENDPOINT_OFFSET));
        return { from, to, fromDirection: this.a.direction, toDirection };
    }
    normalizedDirectionOrFallback(direction, fallback) {
        const directionLength = vec_1.vec2.len(direction);
        if (directionLength > 0) {
            return vec_1.vec2.div(direction, directionLength);
        }
        const fallbackLength = vec_1.vec2.len(fallback);
        if (fallbackLength > 0) {
            return vec_1.vec2.div(fallback, fallbackLength);
        }
        return (0, vec_1.vec2)(0, -1);
    }
    quantizedDirectionFromPointer(pointer) {
        const start = vec_1.vec2.add(this.a.position, vec_1.vec2.mul(this.a.direction, constants_1.EDGE_CURVE_ENDPOINT_OFFSET));
        const toPointer = vec_1.vec2.sub(pointer, start);
        const xDominant = Math.abs(toPointer.x) >= Math.abs(toPointer.y);
        if (xDominant) {
            return toPointer.x >= 0 ? (0, vec_1.vec2)(-1, 0) : (0, vec_1.vec2)(1, 0);
        }
        return toPointer.y >= 0 ? (0, vec_1.vec2)(0, -1) : (0, vec_1.vec2)(0, 1);
    }
    easeDirection(from, to, amount) {
        const blended = vec_1.vec2.add(vec_1.vec2.mul(from, 1 - amount), vec_1.vec2.mul(to, amount));
        return this.normalizedDirectionOrFallback(blended, to);
    }
}
exports.default = EdgeTool;
EdgeTool.FINAL_DIRECTION_EASE = 0.2;
//# sourceMappingURL=EdgeTool.js.map