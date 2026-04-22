import { vec2 } from '@basementuniverse/vec';
import { EdgeToolEndpoint } from './types';
export default class EdgeTool {
    a: EdgeToolEndpoint;
    private static readonly FINAL_DIRECTION_EASE;
    pointer: vec2;
    pointerDirection: vec2 | null;
    smoothedFinalDirection: vec2;
    constructor(a: EdgeToolEndpoint);
    update(pointer: vec2, pointerDirection?: vec2 | null): void;
    getDrawData(): {
        from: vec2;
        to: vec2;
        fromDirection: vec2;
        toDirection: vec2;
    };
    private normalizedDirectionOrFallback;
    private quantizedDirectionFromPointer;
    private easeDirection;
}
//# sourceMappingURL=EdgeTool.d.ts.map