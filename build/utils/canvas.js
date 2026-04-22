"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundedRect = exports.line = exports.plus = exports.cross = void 0;
function cross(context, position, size) {
    const halfSize = size / 2;
    context.beginPath();
    context.moveTo(position.x - halfSize, position.y - halfSize);
    context.lineTo(position.x + halfSize, position.y + halfSize);
    context.moveTo(position.x + halfSize, position.y - halfSize);
    context.lineTo(position.x - halfSize, position.y + halfSize);
    context.stroke();
}
exports.cross = cross;
function plus(context, position, size) {
    const halfSize = size / 2;
    context.beginPath();
    context.moveTo(position.x - halfSize, position.y);
    context.lineTo(position.x + halfSize, position.y);
    context.moveTo(position.x, position.y - halfSize);
    context.lineTo(position.x, position.y + halfSize);
    context.stroke();
}
exports.plus = plus;
function line(context, a, b) {
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.stroke();
}
exports.line = line;
function roundedRect(context, position, size, borderRadius) {
    const x = position.x;
    const y = position.y;
    const width = size.x;
    const height = size.y;
    context.beginPath();
    context.moveTo(x + borderRadius, y);
    context.lineTo(x + width - borderRadius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
    context.lineTo(x + width, y + height - borderRadius);
    context.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
    context.lineTo(x + borderRadius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
    context.lineTo(x, y + borderRadius);
    context.quadraticCurveTo(x, y, x + borderRadius, y);
    context.closePath();
}
exports.roundedRect = roundedRect;
//# sourceMappingURL=canvas.js.map