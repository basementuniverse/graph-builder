"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCycle = exports.topologicalSort = exports.traverseDFS = exports.traverseBFS = exports.getNeighbors = void 0;
function resolveEdgeNodeIds(edge) {
    return {
        from: edge.a.nodeId,
        to: edge.b.nodeId,
    };
}
function buildAdjacency(graph) {
    const outgoing = new Map();
    const incoming = new Map();
    for (const node of graph.nodes) {
        outgoing.set(node.id, new Set());
        incoming.set(node.id, new Set());
    }
    for (const edge of graph.edges) {
        const { from, to } = resolveEdgeNodeIds(edge);
        if (!outgoing.has(from)) {
            outgoing.set(from, new Set());
        }
        if (!incoming.has(to)) {
            incoming.set(to, new Set());
        }
        outgoing.get(from).add(to);
        incoming.get(to).add(from);
    }
    return { outgoing, incoming };
}
function getNeighbors(graph, nodeId, direction = 'both') {
    var _a, _b, _c, _d;
    const { outgoing, incoming } = buildAdjacency(graph);
    if (direction === 'out') {
        return [...((_a = outgoing.get(nodeId)) !== null && _a !== void 0 ? _a : new Set())];
    }
    if (direction === 'in') {
        return [...((_b = incoming.get(nodeId)) !== null && _b !== void 0 ? _b : new Set())];
    }
    return [
        ...new Set([
            ...((_c = outgoing.get(nodeId)) !== null && _c !== void 0 ? _c : new Set()),
            ...((_d = incoming.get(nodeId)) !== null && _d !== void 0 ? _d : new Set()),
        ]),
    ];
}
exports.getNeighbors = getNeighbors;
function traverseBFS(graph, startNodeId, visitor, direction = 'both') {
    const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
    if (!nodesById.has(startNodeId)) {
        return [];
    }
    const results = [];
    const visited = new Set();
    const queue = [
        { nodeId: startNodeId, depth: 0 },
    ];
    while (queue.length > 0) {
        const current = queue.shift();
        if (visited.has(current.nodeId)) {
            continue;
        }
        visited.add(current.nodeId);
        const node = nodesById.get(current.nodeId);
        const response = visitor(node, current.depth);
        if (response !== undefined &&
            response !== null &&
            typeof response === 'object') {
            if ('stop' in response && response.stop) {
                return results;
            }
            if ('skip' in response && response.skip) {
                continue;
            }
        }
        else if (response !== undefined) {
            results.push(response);
        }
        for (const neighbor of getNeighbors(graph, current.nodeId, direction)) {
            if (!visited.has(neighbor)) {
                queue.push({ nodeId: neighbor, depth: current.depth + 1 });
            }
        }
    }
    return results;
}
exports.traverseBFS = traverseBFS;
function traverseDFS(graph, startNodeId, visitor, direction = 'both') {
    const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
    if (!nodesById.has(startNodeId)) {
        return [];
    }
    const results = [];
    const visited = new Set();
    const walk = (nodeId, depth) => {
        if (visited.has(nodeId)) {
            return false;
        }
        visited.add(nodeId);
        const node = nodesById.get(nodeId);
        if (!node) {
            return false;
        }
        const response = visitor(node, depth);
        if (response !== undefined &&
            response !== null &&
            typeof response === 'object') {
            if ('stop' in response && response.stop) {
                return true;
            }
            if ('skip' in response && response.skip) {
                return false;
            }
        }
        else if (response !== undefined) {
            results.push(response);
        }
        for (const neighbor of getNeighbors(graph, nodeId, direction)) {
            if (walk(neighbor, depth + 1)) {
                return true;
            }
        }
        return false;
    };
    walk(startNodeId, 0);
    return results;
}
exports.traverseDFS = traverseDFS;
function topologicalSort(graph) {
    var _a, _b, _c;
    const { outgoing, incoming } = buildAdjacency(graph);
    const inDegree = new Map();
    for (const node of graph.nodes) {
        inDegree.set(node.id, ((_a = incoming.get(node.id)) !== null && _a !== void 0 ? _a : new Set()).size);
    }
    const queue = [...inDegree.entries()]
        .filter(([, degree]) => degree === 0)
        .map(([nodeId]) => nodeId);
    const sorted = [];
    while (queue.length > 0) {
        const nodeId = queue.shift();
        sorted.push(nodeId);
        for (const neighbor of (_b = outgoing.get(nodeId)) !== null && _b !== void 0 ? _b : new Set()) {
            const nextDegree = ((_c = inDegree.get(neighbor)) !== null && _c !== void 0 ? _c : 0) - 1;
            inDegree.set(neighbor, nextDegree);
            if (nextDegree === 0) {
                queue.push(neighbor);
            }
        }
    }
    return sorted.length === graph.nodes.length ? sorted : null;
}
exports.topologicalSort = topologicalSort;
function hasCycle(graph) {
    return topologicalSort(graph) === null;
}
exports.hasCycle = hasCycle;
//# sourceMappingURL=Traversal.js.map