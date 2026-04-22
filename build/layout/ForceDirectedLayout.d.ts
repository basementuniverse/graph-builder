import { vec2 } from '@basementuniverse/vec';
import type { Graph } from '../types/Graph';
export type ForceDirectedLayoutOptions = {
    iterations: number;
    timeBudgetMs?: number;
    repulsionStrength: number;
    attractionStrength: number;
    minNodeSpacing: number;
    damping: number;
    maxStep: number;
};
export type ForceDirectedLayoutResult = {
    nodePositions: Map<string, vec2>;
    converged: boolean;
    iterationsCompleted: number;
};
export declare function layoutForceDirected<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown>(graph: Graph<TNodeData, TEdgeData, TPortData>, options?: Partial<ForceDirectedLayoutOptions>): Promise<ForceDirectedLayoutResult>;
//# sourceMappingURL=ForceDirectedLayout.d.ts.map