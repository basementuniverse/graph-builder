"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutLayered = void 0;
const vec_1 = require("@basementuniverse/vec");
const Traversal_1 = require("../utils/Traversal");
const DEFAULT_OPTIONS = {
    direction: 'topDown',
    layerSpacing: 220,
    nodeSpacing: 180,
};
function toPosition(direction, layerIndex, nodeIndex, layerSpacing, nodeSpacing) {
    switch (direction) {
        case 'bottomUp':
            return (0, vec_1.vec2)(nodeIndex * nodeSpacing, -layerIndex * layerSpacing);
        case 'leftRight':
            return (0, vec_1.vec2)(layerIndex * layerSpacing, nodeIndex * nodeSpacing);
        case 'rightLeft':
            return (0, vec_1.vec2)(-layerIndex * layerSpacing, nodeIndex * nodeSpacing);
        case 'topDown':
        default:
            return (0, vec_1.vec2)(nodeIndex * nodeSpacing, layerIndex * layerSpacing);
    }
}
async function layoutLayered(graph, options = {}) {
    var _a, _b, _c, _d;
    const settings = { ...DEFAULT_OPTIONS, ...options };
    const topo = (0, Traversal_1.topologicalSort)(graph);
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
            nodePositions.set(nodeId, toPosition(settings.direction, layerIndex, nodeIndex, settings.layerSpacing, settings.nodeSpacing));
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