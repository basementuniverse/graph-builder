"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutLayered = void 0;
const constants_1 = require("../constants");
const utils_1 = require("../utils");
async function layoutLayered(graph, options = {}) {
    var _a, _b, _c, _d;
    const settings = { ...constants_1.DEFAULT_LAYERED_LAYOUT_OPTIONS, ...options };
    const topo = (0, utils_1.topologicalSort)(graph);
    if (!topo) {
        return null;
    }
    const incoming = new Map();
    for (const node of graph.nodes) {
        incoming.set(node.id, new Set());
    }
    for (const edge of graph.edges) {
        (_a = incoming.get(edge.b.nodeId)) === null || _a === void 0 ? void 0 : _a.add(edge.a.nodeId);
    }
    const layerByNode = new Map();
    for (const nodeId of topo) {
        const parents = [...((_b = incoming.get(nodeId)) !== null && _b !== void 0 ? _b : new Set())];
        if (parents.length === 0) {
            layerByNode.set(nodeId, 0);
            continue;
        }
        let layer = 0;
        for (const parent of parents) {
            layer = Math.max(layer, ((_c = layerByNode.get(parent)) !== null && _c !== void 0 ? _c : 0) + 1);
        }
        layerByNode.set(nodeId, layer);
    }
    const layers = [];
    for (const nodeId of topo) {
        const layer = (_d = layerByNode.get(nodeId)) !== null && _d !== void 0 ? _d : 0;
        if (!layers[layer]) {
            layers[layer] = [];
        }
        layers[layer].push(nodeId);
    }
    const nodePositions = new Map();
    for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
        const layer = layers[layerIndex];
        for (let nodeIndex = 0; nodeIndex < layer.length; nodeIndex++) {
            const nodeId = layer[nodeIndex];
            nodePositions.set(nodeId, (0, utils_1.toPosition)(settings.direction, layerIndex, nodeIndex, settings.layerSpacing, settings.nodeSpacing));
        }
        await Promise.resolve();
    }
    return {
        nodePositions,
        layers,
        crossings: 0,
    };
}
exports.layoutLayered = layoutLayered;
//# sourceMappingURL=LayeredLayout.js.map