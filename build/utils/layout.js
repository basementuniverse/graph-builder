"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPosition = void 0;
const vec_1 = require("@basementuniverse/vec");
const enums_1 = require("../enums");
function toPosition(direction, layerIndex, nodeIndex, layerSpacing, nodeSpacing) {
    switch (direction) {
        case enums_1.LayeredLayoutDirection.BottomUp:
            return (0, vec_1.vec2)(nodeIndex * nodeSpacing, -layerIndex * layerSpacing);
        case enums_1.LayeredLayoutDirection.LeftRight:
            return (0, vec_1.vec2)(layerIndex * layerSpacing, nodeIndex * nodeSpacing);
        case enums_1.LayeredLayoutDirection.RightLeft:
            return (0, vec_1.vec2)(-layerIndex * layerSpacing, nodeIndex * nodeSpacing);
        case enums_1.LayeredLayoutDirection.TopDown:
        default:
            return (0, vec_1.vec2)(nodeIndex * nodeSpacing, layerIndex * layerSpacing);
    }
}
exports.toPosition = toPosition;
//# sourceMappingURL=layout.js.map