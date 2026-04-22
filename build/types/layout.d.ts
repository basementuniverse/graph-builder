import { vec2 } from '@basementuniverse/vec';
import { LayeredLayoutDirection } from '../enums';
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
//# sourceMappingURL=layout.d.ts.map