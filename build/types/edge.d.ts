import type { PortRef } from './port';
export type Edge<TEdgeData = unknown> = {
    a: PortRef;
    b: PortRef;
    data?: TEdgeData;
};
export type EdgeState = {
    hovered: boolean;
};
//# sourceMappingURL=edge.d.ts.map