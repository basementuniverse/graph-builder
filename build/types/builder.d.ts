import type { CameraOptions } from '@basementuniverse/camera';
import type { vec2 } from '@basementuniverse/vec';
import type { Edge } from './edge';
import type { EdgeDashEffectConfig, EdgeDotEffectConfig, GraphBuilderEffectsOptions, GraphBuilderEffectsOptionsInput, GraphEffectChannel, PortPulseEffectConfig } from './effects';
import type { Node } from './node';
import type { Port } from './port';
import { EdgeTheme, GraphBuilderTheme } from './theme';
export type GraphBuilderCapabilities = {
    createNodes?: boolean;
    createEdges?: boolean;
    deleteNodes?: boolean;
    deleteEdges?: boolean;
    resizeNodes?: boolean;
    moveNodes?: boolean;
};
export type EdgeConnectionValidationResult = {
    allowed: boolean;
    reason?: string;
};
export type GraphBuilderOptions<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown> = {
    gridSize?: number;
    snapToGrid?: boolean;
    showGrid?: boolean;
    showPortArrows?: boolean;
    showEdgeArrows?: boolean;
    camera?: Partial<CameraOptions>;
    autoStart?: boolean;
    theme?: Partial<GraphBuilderTheme>;
    effects?: GraphBuilderEffectsOptionsInput;
    callbacks?: GraphBuilderCallbacks;
    capabilities?: GraphBuilderCapabilities;
    allowSelfConnection?: boolean;
    canConnectPorts?: (params: {
        fromNode: Node<TNodeData, TPortData>;
        fromPort: Port<TPortData>;
        toNode: Node<TNodeData, TPortData>;
        toPort: Port<TPortData>;
        edge?: Edge<TEdgeData>;
    }) => EdgeConnectionValidationResult;
    resolveEdgeTheme?: (params: {
        fromNode: Node<TNodeData, TPortData>;
        fromPort: Port<TPortData>;
        toNode: Node<TNodeData, TPortData>;
        toPort: Port<TPortData>;
        data?: TEdgeData;
    }) => Partial<EdgeTheme> | undefined;
};
export type RequiredGraphBuilderOptions<TNodeData, TEdgeData, TPortData> = {
    gridSize: number;
    snapToGrid: boolean;
    showGrid: boolean;
    showPortArrows: boolean;
    showEdgeArrows: boolean;
    autoStart: boolean;
    allowSelfConnection: boolean;
    canConnectPorts?: GraphBuilderOptions<TNodeData, TEdgeData, TPortData>['canConnectPorts'];
    resolveEdgeTheme?: GraphBuilderOptions<TNodeData, TEdgeData, TPortData>['resolveEdgeTheme'];
    camera: Partial<CameraOptions>;
    theme: GraphBuilderTheme;
    effects: GraphBuilderEffectsOptions;
    callbacks: GraphBuilderCallbacks;
    capabilities: Required<GraphBuilderCapabilities>;
};
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
export type EdgeDashEffectDrawContext = {
    edge: Edge;
    channel: GraphEffectChannel;
    from: vec2;
    to: vec2;
    fromDirection: vec2;
    toDirection: vec2;
    phase: number;
    config: EdgeDashEffectConfig;
};
export type EdgeDotEffectDrawContext = {
    edge: Edge;
    channel: GraphEffectChannel;
    id: string;
    position: vec2;
    direction: vec2;
    progress: number;
    config: EdgeDotEffectConfig;
};
export type PortPulseEffectDrawContext = {
    node: Node;
    port: Port;
    channel: GraphEffectChannel;
    id: string;
    position: vec2;
    progress: number;
    radius: number;
    opacity: number;
    config: PortPulseEffectConfig;
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
    drawEdgeDashEffect?: (context: CanvasRenderingContext2D, drawContext: EdgeDashEffectDrawContext) => void;
    drawEdgeDotEffect?: (context: CanvasRenderingContext2D, drawContext: EdgeDotEffectDrawContext) => void;
    drawPortPulseEffect?: (context: CanvasRenderingContext2D, drawContext: PortPulseEffectDrawContext) => void;
};
//# sourceMappingURL=builder.d.ts.map