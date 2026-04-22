import type { Graph, LayeredLayoutOptions, LayeredLayoutResult } from '../types';
export declare function layoutLayered<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown>(graph: Graph<TNodeData, TEdgeData, TPortData>, options?: Partial<LayeredLayoutOptions>): Promise<LayeredLayoutResult | null>;
//# sourceMappingURL=LayeredLayout.d.ts.map