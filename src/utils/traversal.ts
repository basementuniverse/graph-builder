import { TraversalDirection } from '../enums';
import type { Adjacency, Edge, Graph, NodeVisitor } from '../types';

type NodeEdgeConnection<TEdgeData = unknown> = {
  edge: Edge<TEdgeData>;
  portId: string;
  otherNodeId: string;
};

function resolveEdgeNodeIds<TEdgeData = unknown>(edge: Edge<TEdgeData>) {
  return {
    from: edge.a.nodeId,
    to: edge.b.nodeId,
  };
}

function buildAdjacency<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
>(graph: Graph<TNodeData, TEdgeData, TPortData>): Adjacency {
  const outgoing = new Map<string, Set<string>>();
  const incoming = new Map<string, Set<string>>();

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
    outgoing.get(from)!.add(to);
    incoming.get(to)!.add(from);
  }

  return { outgoing, incoming };
}

function getNeighborsFromAdjacency(
  adjacency: Adjacency,
  nodeId: string,
  direction: TraversalDirection
): string[] {
  const { outgoing, incoming } = adjacency;

  if (direction === TraversalDirection.Out) {
    return [...(outgoing.get(nodeId) ?? new Set<string>())];
  }
  if (direction === TraversalDirection.In) {
    return [...(incoming.get(nodeId) ?? new Set<string>())];
  }

  return [
    ...new Set([
      ...(outgoing.get(nodeId) ?? new Set<string>()),
      ...(incoming.get(nodeId) ?? new Set<string>()),
    ]),
  ];
}

function cloneEdge<TEdgeData = unknown>(
  edge: Edge<TEdgeData>
): Edge<TEdgeData> {
  return {
    ...edge,
    a: { ...edge.a },
    b: { ...edge.b },
  };
}

function cloneNode<TNodeData = unknown, TPortData = unknown>(
  node: Graph<TNodeData, unknown, TPortData>['nodes'][number]
) {
  return {
    ...node,
    position: { ...node.position },
    size: { ...node.size },
    ports: node.ports.map(port => ({ ...port })),
  };
}

function buildTraversalConnections<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
>(graph: Graph<TNodeData, TEdgeData, TPortData>) {
  const byNodeId = new Map<string, NodeEdgeConnection<TEdgeData>[]>();
  const byNodePortKey = new Map<string, NodeEdgeConnection<TEdgeData>[]>();

  const ensureByNodeId = (nodeId: string) => {
    let connections = byNodeId.get(nodeId);
    if (!connections) {
      connections = [];
      byNodeId.set(nodeId, connections);
    }
    return connections;
  };

  const ensureByNodePortKey = (nodeId: string, portId: string) => {
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
    const edgeFromA: NodeEdgeConnection<TEdgeData> = {
      edge,
      portId: edge.a.portId,
      otherNodeId: edge.b.nodeId,
    };
    ensureByNodeId(edge.a.nodeId).push(edgeFromA);
    ensureByNodePortKey(edge.a.nodeId, edge.a.portId).push(edgeFromA);

    const edgeFromB: NodeEdgeConnection<TEdgeData> = {
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

function hydrateTraversalNode<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
>(
  nodeId: string,
  nodesById: Map<
    string,
    Graph<TNodeData, TEdgeData, TPortData>['nodes'][number]
  >,
  connections: ReturnType<
    typeof buildTraversalConnections<TNodeData, TEdgeData, TPortData>
  >
) {
  const node = nodesById.get(nodeId);
  if (!node) {
    return null;
  }

  const nodeConnections = connections.byNodeId.get(nodeId) ?? [];
  const adjacentNodeIds = new Set<string>();

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
    .filter(
      (
        adjacent
      ): adjacent is Graph<TNodeData, TEdgeData, TPortData>['nodes'][number] =>
        adjacent !== undefined
    )
    .map(adjacent => cloneNode(adjacent));

  const ports = node.ports.map(port => {
    const portConnections =
      connections.byNodePortKey.get(`${node.id}:${port.id}`) ?? [];
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
      connectedEdge: connectedEdges[0] ?? null,
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

export function getNeighbors<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
>(
  graph: Graph<TNodeData, TEdgeData, TPortData>,
  nodeId: string,
  direction: TraversalDirection = TraversalDirection.Both
): string[] {
  return getNeighborsFromAdjacency(buildAdjacency(graph), nodeId, direction);
}

export function traverseBFS<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
  TResult = void,
>(
  graph: Graph<TNodeData, TEdgeData, TPortData>,
  startNodeId: string,
  visitor: NodeVisitor<TNodeData, TEdgeData, TPortData, TResult>,
  direction: TraversalDirection = TraversalDirection.Both
): TResult[] {
  const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
  if (!nodesById.has(startNodeId)) {
    return [];
  }

  const adjacency = buildAdjacency(graph);
  const traversalConnections = buildTraversalConnections(graph);

  const results: TResult[] = [];
  const visited = new Set<string>();
  const queue: Array<{ nodeId: string; depth: number }> = [
    { nodeId: startNodeId, depth: 0 },
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current.nodeId)) {
      continue;
    }
    visited.add(current.nodeId);

    const node = hydrateTraversalNode(
      current.nodeId,
      nodesById,
      traversalConnections
    );
    if (!node) {
      continue;
    }
    const response = visitor(node, current.depth);

    if (
      response !== undefined &&
      response !== null &&
      typeof response === 'object'
    ) {
      if ('stop' in response && response.stop) {
        return results;
      }
      if ('skip' in response && response.skip) {
        continue;
      }
    } else if (response !== undefined) {
      results.push(response);
    }

    for (const neighbor of getNeighborsFromAdjacency(
      adjacency,
      current.nodeId,
      direction
    )) {
      if (!visited.has(neighbor)) {
        queue.push({ nodeId: neighbor, depth: current.depth + 1 });
      }
    }
  }

  return results;
}

export function traverseDFS<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
  TResult = void,
>(
  graph: Graph<TNodeData, TEdgeData, TPortData>,
  startNodeId: string,
  visitor: NodeVisitor<TNodeData, TEdgeData, TPortData, TResult>,
  direction: TraversalDirection = TraversalDirection.Both
): TResult[] {
  const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
  if (!nodesById.has(startNodeId)) {
    return [];
  }

  const adjacency = buildAdjacency(graph);
  const traversalConnections = buildTraversalConnections(graph);

  const results: TResult[] = [];
  const visited = new Set<string>();

  const walk = (nodeId: string, depth: number): boolean => {
    if (visited.has(nodeId)) {
      return false;
    }
    visited.add(nodeId);

    const node = hydrateTraversalNode(nodeId, nodesById, traversalConnections);
    if (!node) {
      return false;
    }

    const response = visitor(node, depth);

    if (
      response !== undefined &&
      response !== null &&
      typeof response === 'object'
    ) {
      if ('stop' in response && response.stop) {
        return true;
      }
      if ('skip' in response && response.skip) {
        return false;
      }
    } else if (response !== undefined) {
      results.push(response);
    }

    for (const neighbor of getNeighborsFromAdjacency(
      adjacency,
      nodeId,
      direction
    )) {
      if (walk(neighbor, depth + 1)) {
        return true;
      }
    }

    return false;
  };

  walk(startNodeId, 0);
  return results;
}

export function traverseTopological<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
  TResult = void,
>(
  graph: Graph<TNodeData, TEdgeData, TPortData>,
  visitor: NodeVisitor<TNodeData, TEdgeData, TPortData, TResult>
): TResult[] | null {
  const order = topologicalSort(graph);
  if (!order) {
    return null;
  }

  const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
  const adjacency = buildAdjacency(graph);
  const traversalConnections = buildTraversalConnections(graph);
  const depthByNodeId = new Map<string, number>();

  for (const nodeId of order) {
    const incoming = adjacency.incoming.get(nodeId) ?? new Set<string>();
    let depth = 0;
    for (const parentId of incoming) {
      depth = Math.max(depth, (depthByNodeId.get(parentId) ?? 0) + 1);
    }
    depthByNodeId.set(nodeId, depth);
  }

  const results: TResult[] = [];
  for (const nodeId of order) {
    const node = hydrateTraversalNode(nodeId, nodesById, traversalConnections);
    if (!node) {
      continue;
    }

    const response = visitor(node, depthByNodeId.get(nodeId) ?? 0);

    if (
      response !== undefined &&
      response !== null &&
      typeof response === 'object'
    ) {
      if ('stop' in response && response.stop) {
        return results;
      }
      if ('skip' in response && response.skip) {
        continue;
      }
    } else if (response !== undefined) {
      results.push(response);
    }
  }

  return results;
}

export function topologicalSort<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
>(graph: Graph<TNodeData, TEdgeData, TPortData>): string[] | null {
  const { outgoing, incoming } = buildAdjacency(graph);
  const inDegree = new Map<string, number>();

  for (const node of graph.nodes) {
    inDegree.set(node.id, (incoming.get(node.id) ?? new Set()).size);
  }

  const queue = [...inDegree.entries()]
    .filter(([, degree]) => degree === 0)
    .map(([nodeId]) => nodeId);
  const sorted: string[] = [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    sorted.push(nodeId);

    for (const neighbor of outgoing.get(nodeId) ?? new Set<string>()) {
      const nextDegree = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, nextDegree);
      if (nextDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  return sorted.length === graph.nodes.length ? sorted : null;
}

export function hasCycle<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
>(graph: Graph<TNodeData, TEdgeData, TPortData>): boolean {
  return topologicalSort(graph) === null;
}
