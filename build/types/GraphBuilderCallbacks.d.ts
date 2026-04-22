import type { vec2 } from '@basementuniverse/vec';
import type { Edge } from './Edge';
import type { Node } from './Node';
import type { Port } from './Port';
export type GridDrawContext = {
    position: vec2;
    gridSize: number;
};
export type NodeFrameDrawContext = {
    node: Node;
    position: vec2;
    size: vec2;
    hovered: boolean;
    selected: boolean;
};
export type NodeContentDrawContext = {
    node: Node;
    position: vec2;
    size: vec2;
    hovered: boolean;
    selected: boolean;
};
export type DeleteButtonDrawContext = {
    node: Node;
    position: vec2;
    size: vec2;
    hovered: boolean;
};
export type ResizeHandleDrawContext = {
    node: Node;
    position: vec2;
    size: vec2;
    hovered: boolean;
};
export type PortDrawContext = {
    node: Node | null;
    port: Port | null;
    position: vec2;
    direction: vec2;
    hovered: boolean;
    connectable: boolean;
    invalidReason: string | null;
    isPreview: boolean;
};
export type EdgeDrawContext = {
    edge: Edge;
    from: vec2;
    to: vec2;
    fromDirection: vec2;
    toDirection: vec2;
    hovered: boolean;
};
export type EdgePreviewDrawContext = {
    from: vec2;
    to: vec2;
    fromDirection: vec2;
    toDirection: vec2;
};
export type GraphBuilderCallbacks = {
    drawGridDot?: (context: CanvasRenderingContext2D, drawContext: GridDrawContext) => void;
    drawNodeFrame?: (context: CanvasRenderingContext2D, drawContext: NodeFrameDrawContext) => void;
    drawNodeContent?: (context: CanvasRenderingContext2D, drawContext: NodeContentDrawContext) => void;
    drawDeleteButton?: (context: CanvasRenderingContext2D, drawContext: DeleteButtonDrawContext) => void;
    drawResizeHandle?: (context: CanvasRenderingContext2D, drawContext: ResizeHandleDrawContext) => void;
    drawPort?: (context: CanvasRenderingContext2D, drawContext: PortDrawContext) => void;
    drawEdge?: (context: CanvasRenderingContext2D, drawContext: EdgeDrawContext) => void;
    drawEdgePreview?: (context: CanvasRenderingContext2D, drawContext: EdgePreviewDrawContext) => void;
};
//# sourceMappingURL=GraphBuilderCallbacks.d.ts.map