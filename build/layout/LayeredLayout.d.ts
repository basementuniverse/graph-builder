import { vec2 } from '@basementuniverse/vec';
import type { Graph } from '../types/Graph';
export type LayeredLayoutDirection = 'topDown' | 'bottomUp' | 'leftRight' | 'rightLeft';
export type LayeredLayoutOptions = {
    direction: LayeredLayoutDirection;
    layerSpacing: number;
    nodeSpacing: number;
};
export type LayeredLayoutResult = {
    nodePositions: Map<string, vec2>;
    layers: string[][];
    crossings: number;
};
export declare function layoutLayered<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown>(graph: Graph<TNodeData, TEdgeData, TPortData>, options?: Partial<LayeredLayoutOptions>): Promise<LayeredLayoutResult | null>;
//# sourceMappingURL=LayeredLayout.d.ts.map