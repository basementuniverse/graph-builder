import { vec2 } from '@basementuniverse/vec';
export declare function curveFromTo(context: CanvasRenderingContext2D, a: vec2, b: vec2, initialDirection: vec2, finalDirection: vec2, gridSize: number): void;
export declare function getCurveGeometry(a: vec2, b: vec2, initialDirection: vec2, finalDirection: vec2, gridSize: number): {
    cp1: vec2;
    cp2: vec2;
    join: vec2;
};
export declare function sampleBezierChain(a: vec2, cp1: vec2, join: vec2, cp2: vec2, b: vec2, t: number): {
    position: vec2;
    tangent: vec2;
};
export declare function pointToQuadraticBezierDistance(p: vec2, a: vec2, cp: vec2, b: vec2, t: number): number;
//# sourceMappingURL=curve.d.ts.map