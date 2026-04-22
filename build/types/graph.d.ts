import type { Edge } from './edge';
import type { Node } from './node';
export type Graph<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown> = {
    nodes: Node<TNodeData, TPortData>[];
    edges: Edge<TEdgeData>[];
};
//# sourceMappingURL=graph.d.ts.map