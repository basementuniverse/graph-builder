import { TraversalDirection } from '../enums';
import type { Graph, NodeVisitor } from '../types';
export declare function getNeighbors<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown>(graph: Graph<TNodeData, TEdgeData, TPortData>, nodeId: string, direction?: TraversalDirection): string[];
export declare function traverseBFS<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown, TResult = void>(graph: Graph<TNodeData, TEdgeData, TPortData>, startNodeId: string, visitor: NodeVisitor<TNodeData, TEdgeData, TPortData, TResult>, direction?: TraversalDirection): TResult[];
export declare function traverseDFS<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown, TResult = void>(graph: Graph<TNodeData, TEdgeData, TPortData>, startNodeId: string, visitor: NodeVisitor<TNodeData, TEdgeData, TPortData, TResult>, direction?: TraversalDirection): TResult[];
export declare function traverseTopological<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown, TResult = void>(graph: Graph<TNodeData, TEdgeData, TPortData>, visitor: NodeVisitor<TNodeData, TEdgeData, TPortData, TResult>): TResult[] | null;
export declare function topologicalSort<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown>(graph: Graph<TNodeData, TEdgeData, TPortData>): string[] | null;
export declare function hasCycle<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown>(graph: Graph<TNodeData, TEdgeData, TPortData>): boolean;
//# sourceMappingURL=traversal.d.ts.map