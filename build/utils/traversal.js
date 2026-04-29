"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCycle = exports.topologicalSort = exports.traverseTopological = exports.traverseDFS = exports.traverseBFS = exports.getNeighbors = void 0;
const enums_1 = require("../enums");
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
function getNeighborsFromAdjacency(adjacency, nodeId, direction) {
    var _a, _b, _c, _d;
    const { outgoing, incoming } = adjacency;
    if (direction === enums_1.TraversalDirection.Out) {
        return [...((_a = outgoing.get(nodeId)) !== null && _a !== void 0 ? _a : new Set())];
    }
    if (direction === enums_1.TraversalDirection.In) {
        return [...((_b = incoming.get(nodeId)) !== null && _b !== void 0 ? _b : new Set())];
    }
    return [
        ...new Set([
            ...((_c = outgoing.get(nodeId)) !== null && _c !== void 0 ? _c : new Set()),
            ...((_d = incoming.get(nodeId)) !== null && _d !== void 0 ? _d : new Set()),
        ]),
    ];
}
function cloneEdge(edge) {
    return {
        ...edge,
        a: { ...edge.a },
        b: { ...edge.b },
    };
}
function cloneNode(node) {
    return {
        ...node,
        position: { ...node.position },
        size: { ...node.size },
        ports: node.ports.map(port => ({ ...port })),
    };
}
function buildTraversalConnections(graph) {
    const byNodeId = new Map();
    const byNodePortKey = new Map();
    const ensureByNodeId = (nodeId) => {
        let connections = byNodeId.get(nodeId);
        if (!connections) {
            connections = [];
            byNodeId.set(nodeId, connections);
        }
        return connections;
    };
    const ensureByNodePortKey = (nodeId, portId) => {
        const key = `${nodeId}:${portId}`;
        let connections = byNodePortKey.get(key);
        if (!connections) {
            connections = [];
            byNodePortKey.set(key, connections);
        }
        return connections;
    };
    for (const node of graph.nodes) {
        ensureByNodeId(node.id);
        for (const port of node.ports) {
            ensureByNodePortKey(node.id, port.id);
        }
    }
    for (const edge of graph.edges) {
        const edgeFromA = {
            edge,
            portId: edge.a.portId,
            otherNodeId: edge.b.nodeId,
        };
        ensureByNodeId(edge.a.nodeId).push(edgeFromA);
        ensureByNodePortKey(edge.a.nodeId, edge.a.portId).push(edgeFromA);
        const edgeFromB = {
            edge,
            portId: edge.b.portId,
            otherNodeId: edge.a.nodeId,
        };
        ensureByNodeId(edge.b.nodeId).push(edgeFromB);
        ensureByNodePortKey(edge.b.nodeId, edge.b.portId).push(edgeFromB);
    }
    return {
        byNodeId,
        byNodePortKey,
    };
}
function hydrateTraversalNode(nodeId, nodesById, connections) {
    var _a;
    const node = nodesById.get(nodeId);
    if (!node) {
        return null;
    }
    const nodeConnections = (_a = connections.byNodeId.get(nodeId)) !== null && _a !== void 0 ? _a : [];
    const adjacentNodeIds = new Set();
    const adjacentEdges = nodeConnections.flatMap(connection => {
        const otherNode = nodesById.get(connection.otherNodeId);
        if (!otherNode) {
            return [];
        }
        adjacentNodeIds.add(otherNode.id);
        return [
            {
                ...cloneEdge(connection.edge),
                otherNode: cloneNode(otherNode),
            },
        ];
    });
    const adjacentNodes = [...adjacentNodeIds]
        .map(id => nodesById.get(id))
        .filter((adjacent) => adjacent !== undefined)
        .map(adjacent => cloneNode(adjacent));
    const ports = node.ports.map(port => {
        var _a, _b;
        const portConnections = (_a = connections.byNodePortKey.get(`${node.id}:${port.id}`)) !== null && _a !== void 0 ? _a : [];
        const connectedEdges = portConnections.flatMap(connection => {
            const otherNode = nodesById.get(connection.otherNodeId);
            if (!otherNode) {
                return [];
            }
            return [
                {
                    ...cloneEdge(connection.edge),
                    otherNode: cloneNode(otherNode),
                },
            ];
        });
        return {
            ...port,
            connectedEdge: (_b = connectedEdges[0]) !== null && _b !== void 0 ? _b : null,
            connectedEdges,
        };
    });
    return {
        ...cloneNode(node),
        ports,
        adjacentNodes,
        adjacentEdges,
    };
}
function getNeighbors(graph, nodeId, direction = enums_1.TraversalDirection.Both) {
    return getNeighborsFromAdjacency(buildAdjacency(graph), nodeId, direction);
}
exports.getNeighbors = getNeighbors;
function traverseBFS(graph, startNodeId, visitor, direction = enums_1.TraversalDirection.Both) {
    const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
    if (!nodesById.has(startNodeId)) {
        return [];
    }
    const adjacency = buildAdjacency(graph);
    const traversalConnections = buildTraversalConnections(graph);
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
        const node = hydrateTraversalNode(current.nodeId, nodesById, traversalConnections);
        if (!node) {
            continue;
        }
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
        for (const neighbor of getNeighborsFromAdjacency(adjacency, current.nodeId, direction)) {
            if (!visited.has(neighbor)) {
                queue.push({ nodeId: neighbor, depth: current.depth + 1 });
            }
        }
    }
    return results;
}
exports.traverseBFS = traverseBFS;
function traverseDFS(graph, startNodeId, visitor, direction = enums_1.TraversalDirection.Both) {
    const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
    if (!nodesById.has(startNodeId)) {
        return [];
    }
    const adjacency = buildAdjacency(graph);
    const traversalConnections = buildTraversalConnections(graph);
    const results = [];
    const visited = new Set();
    const walk = (nodeId, depth) => {
        if (visited.has(nodeId)) {
            return false;
        }
        visited.add(nodeId);
        const node = hydrateTraversalNode(nodeId, nodesById, traversalConnections);
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
        for (const neighbor of getNeighborsFromAdjacency(adjacency, nodeId, direction)) {
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
function traverseTopological(graph, visitor) {
    var _a, _b, _c;
    const order = topologicalSort(graph);
    if (!order) {
        return null;
    }
    const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
    const adjacency = buildAdjacency(graph);
    const traversalConnections = buildTraversalConnections(graph);
    const depthByNodeId = new Map();
    for (const nodeId of order) {
        const incoming = (_a = adjacency.incoming.get(nodeId)) !== null && _a !== void 0 ? _a : new Set();
        let depth = 0;
        for (const parentId of incoming) {
            depth = Math.max(depth, ((_b = depthByNodeId.get(parentId)) !== null && _b !== void 0 ? _b : 0) + 1);
        }
        depthByNodeId.set(nodeId, depth);
    }
    const results = [];
    for (const nodeId of order) {
        const node = hydrateTraversalNode(nodeId, nodesById, traversalConnections);
        if (!node) {
            continue;
        }
        const response = visitor(node, (_c = depthByNodeId.get(nodeId)) !== null && _c !== void 0 ? _c : 0);
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
    }
    return results;
}
exports.traverseTopological = traverseTopological;
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
//# sourceMappingURL=traversal.js.map