import type { Graph } from '../types/Graph';
import type { Node } from '../types/Node';
export type TraversalDirection = 'in' | 'out' | 'both';
export type VisitorControl = {
    skip?: boolean;
    stop?: boolean;
};
export type NodeVisitor<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown, TResult = void> = (node: Node<TNodeData, TPortData>, depth: number) => TResult | VisitorControl;
export declare function getNeighbors<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown>(graph: Graph<TNodeData, TEdgeData, TPortData>, nodeId: string, direction?: TraversalDirection): string[];
export declare function traverseBFS<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown, TResult = void>(graph: Graph<TNodeData, TEdgeData, TPortData>, startNodeId: string, visitor: NodeVisitor<TNodeData, TEdgeData, TPortData, TResult>, direction?: TraversalDirection): TResult[];
export declare function traverseDFS<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown, TResult = void>(graph: Graph<TNodeData, TEdgeData, TPortData>, startNodeId: string, visitor: NodeVisitor<TNodeData, TEdgeData, TPortData, TResult>, direction?: TraversalDirection): TResult[];
export declare function topologicalSort<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown>(graph: Graph<TNodeData, TEdgeData, TPortData>): string[] | null;
export declare function hasCycle<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown>(graph: Graph<TNodeData, TEdgeData, TPortData>): boolean;
//# sourceMappingURL=Traversal.d.ts.map