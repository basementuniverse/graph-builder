import type { Edge } from './edge';
import type { Node } from './node';
import type { Port } from './port';
export type VisitorControl = {
    skip?: boolean;
    stop?: boolean;
};
export type TraversalConnectedEdge<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown> = Edge<TEdgeData> & {
    otherNode: Node<TNodeData, TPortData>;
};
export type TraversalPort<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown> = Port<TPortData> & {
    connectedEdge: TraversalConnectedEdge<TNodeData, TEdgeData, TPortData> | null;
    connectedEdges: TraversalConnectedEdge<TNodeData, TEdgeData, TPortData>[];
};
export type TraversalNode<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown> = Omit<Node<TNodeData, TPortData>, 'ports'> & {
    ports: TraversalPort<TNodeData, TEdgeData, TPortData>[];
    adjacentNodes: Node<TNodeData, TPortData>[];
    adjacentEdges: TraversalConnectedEdge<TNodeData, TEdgeData, TPortData>[];
};
export type NodeVisitor<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown, TResult = void> = (node: TraversalNode<TNodeData, TEdgeData, TPortData>, depth: number) => TResult | VisitorControl;
export type Adjacency = {
    outgoing: Map<string, Set<string>>;
    incoming: Map<string, Set<string>>;
};
//# sourceMappingURL=traversal.d.ts.map