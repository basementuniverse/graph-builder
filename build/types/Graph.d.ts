import type { Edge } from './Edge';
import type { Node } from './Node';
export type Graph<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown> = {
    nodes: Node<TNodeData, TPortData>[];
    edges: Edge<TEdgeData>[];
};
//# sourceMappingURL=Graph.d.ts.map