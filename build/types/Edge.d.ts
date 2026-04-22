import type { PortRef } from './Port';
export type Edge<TEdgeData = unknown> = {
    a: PortRef;
    b: PortRef;
    data?: TEdgeData;
};
export type EdgeState = {
    hovered: boolean;
};
//# sourceMappingURL=Edge.d.ts.map