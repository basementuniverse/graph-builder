import type { Edge } from '../types/Edge';
import type { Graph } from '../types/Graph';
import type { Node } from '../types/Node';

export type TraversalDirection = 'in' | 'out' | 'both';

export type VisitorControl = {
  skip?: boolean;
  stop?: boolean;
};

export type NodeVisitor<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
  TResult = void,
> = (
  node: Node<TNodeData, TPortData>,
  depth: number
) => TResult | VisitorControl;

type Adjacency = {
  outgoing: Map<string, Set<string>>;
  incoming: Map<string, Set<string>>;
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

export function getNeighbors<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
>(
  graph: Graph<TNodeData, TEdgeData, TPortData>,
  nodeId: string,
  direction: TraversalDirection = 'both'
): string[] {
  const { outgoing, incoming } = buildAdjacency(graph);

  if (direction === 'out') {
    return [...(outgoing.get(nodeId) ?? new Set<string>())];
  }
  if (direction === 'in') {
    return [...(incoming.get(nodeId) ?? new Set<string>())];
  }

  return [
    ...new Set([
      ...(outgoing.get(nodeId) ?? new Set<string>()),
      ...(incoming.get(nodeId) ?? new Set<string>()),
    ]),
  ];
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
  direction: TraversalDirection = 'both'
): TResult[] {
  const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
  if (!nodesById.has(startNodeId)) {
    return [];
  }

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

    const node = nodesById.get(current.nodeId)!;
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

    for (const neighbor of getNeighbors(graph, current.nodeId, direction)) {
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
  direction: TraversalDirection = 'both'
): TResult[] {
  const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
  if (!nodesById.has(startNodeId)) {
    return [];
  }

  const results: TResult[] = [];
  const visited = new Set<string>();

  const walk = (nodeId: string, depth: number): boolean => {
    if (visited.has(nodeId)) {
      return false;
    }
    visited.add(nodeId);

    const node = nodesById.get(nodeId);
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
