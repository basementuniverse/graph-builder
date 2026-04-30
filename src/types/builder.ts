import type { CameraOptions } from '@basementuniverse/camera';
import type { vec2 } from '@basementuniverse/vec';
import type { Edge } from './edge';
import type {
  EdgeDashEffectConfig,
  EdgeDotEffectConfig,
  GraphBuilderEffectsOptions,
  GraphBuilderEffectsOptionsInput,
  GraphEffectChannel,
  PortPulseEffectConfig,
} from './effects';
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

export type GraphBuilderOptions<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
> = {
  gridSize?: number;
  snapToGrid?: boolean;
  showGrid?: boolean;
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
  autoStart: boolean;
  allowSelfConnection: boolean;
  canConnectPorts?: GraphBuilderOptions<
    TNodeData,
    TEdgeData,
    TPortData
  >['canConnectPorts'];
  resolveEdgeTheme?: GraphBuilderOptions<
    TNodeData,
    TEdgeData,
    TPortData
  >['resolveEdgeTheme'];
  camera: Partial<CameraOptions>;
  theme: GraphBuilderTheme;
  effects: GraphBuilderEffectsOptions;
  callbacks: GraphBuilderCallbacks;
  capabilities: Required<GraphBuilderCapabilities>;
};

/**
 * Draw context passed to the `drawGridDot` callback.
 * Represents a single grid intersection point.
 */
export type GridDrawContext = {
  /**
   * World-space position of the grid dot.
   */
  position: vec2;

  /**
   * Current grid size in world units.
   */
  gridSize: number;
};

/**
 * Draw context passed to the `drawNodeFrame` callback.
 * Contains the eased (smoothed) position and size so the frame stays
 * visually in sync with node movement/resizing animations.
 */
export type NodeFrameDrawContext = {
  node: Node;

  /**
   * Eased (animation-smoothed) world-space position.
   */
  position: vec2;

  /**
   * Eased (animation-smoothed) size.
   */
  size: vec2;
  hovered: boolean;
  selected: boolean;
};

/**
 * Draw context passed to the `drawNodeContent` callback.
 * Use this to render custom labels, icons, or other per-node UI inside the
 * node's bounding rectangle.
 */
export type NodeContentDrawContext = {
  node: Node;

  /**
   * Eased (animation-smoothed) world-space position.
   */
  position: vec2;

  /**
   * Eased (animation-smoothed) size.
   */
  size: vec2;
  hovered: boolean;
  selected: boolean;
};

/**
 * Draw context passed to the `drawDeleteButton` callback.
 */
export type DeleteButtonDrawContext = {
  node: Node;

  /**
   * Eased (animation-smoothed) world-space position of the node.
   */
  position: vec2;

  /**
   * Eased (animation-smoothed) size of the node.
   */
  size: vec2;
  hovered: boolean;
};

/**
 * Draw context passed to the `drawResizeHandle` callback.
 */
export type ResizeHandleDrawContext = {
  node: Node;

  /**
   * Eased (animation-smoothed) world-space position of the node.
   */
  position: vec2;

  /**
   * Eased (animation-smoothed) size of the node.
   */
  size: vec2;
  hovered: boolean;
};

/**
 * Draw context passed to the `drawPort` callback.
 * When `isPreview` is true the port represents the floating endpoint of an
 * edge that is currently being dragged; in that case `node` and `port` are
 * null.
 */
export type PortDrawContext = {
  node: Node | null;
  port: Port | null;

  /**
   * World-space centre of the port.
   */
  position: vec2;

  /**
   * Unit vector pointing outward from the node side this port belongs to.
   */
  direction: vec2;
  hovered: boolean;
  connectable: boolean;
  invalidReason: string | null;

  /**
   * True when this is the ghost "pointer" port shown while dragging a new edge.
   */
  isPreview: boolean;
};

/**
 * Draw context passed to the `drawEdge` callback.
 * `from` and `to` are the curve start/end points, already offset from the
 * port centres by `EDGE_CURVE_ENDPOINT_OFFSET`.
 */
export type EdgeDrawContext = {
  edge: Edge;

  /**
   * Curve start point (port position + direction offset).
   */
  from: vec2;

  /**
   * Curve end point (port position + direction offset).
   */
  to: vec2;
  fromDirection: vec2;
  toDirection: vec2;
  hovered: boolean;
};

/**
 * Draw context passed to the `drawEdgePreview` callback.
 * Mirrors `EdgeDrawContext` but for the in-progress edge being dragged from
 * a port before it has been connected.
 */
export type EdgePreviewDrawContext = {
  /**
   * Curve start point (source port position + direction offset).
   */
  from: vec2;

  /**
   * Curve end point (pointer position + smoothed direction offset).
   */
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

export type GraphBuilderCallbackRenderMode = 'replace' | 'overlay';

export type GraphBuilderRenderCallbackName =
  | 'drawGridDot'
  | 'drawNodeFrame'
  | 'drawNodeContent'
  | 'drawDeleteButton'
  | 'drawResizeHandle'
  | 'drawPort'
  | 'drawEdge'
  | 'drawEdgePreview'
  | 'drawEdgeDashEffect'
  | 'drawEdgeDotEffect'
  | 'drawPortPulseEffect';

export type GraphBuilderCallbackRenderModes = Partial<
  Record<GraphBuilderRenderCallbackName, GraphBuilderCallbackRenderMode>
>;

export type GraphBuilderRenderCallback<TDrawContext> = (
  context: CanvasRenderingContext2D,
  drawContext: TDrawContext,
  drawDefault: () => void
) => void | boolean;

/**
 * Optional rendering callbacks that can be supplied via `GraphBuilderOptions`.
 * Callbacks can either replace built-in drawing or be composited as overlays.
 * The canvas `context` is passed as the first argument followed by a
 * draw-context object containing all relevant state for that element, and a
 * `drawDefault` callback that runs the built-in renderer.
 *
 * The context transform has already been applied (camera pan + zoom) when
 * these callbacks are invoked, so all coordinates are in world space.
 *
 * In `replace` mode (default), returning `false` from a callback falls back to
 * built-in rendering.
 */
export type GraphBuilderCallbacks = {
  /**
   * Controls how each draw callback composes with the built-in renderer.
   *
   * - `replace` (default): callback replaces built-in rendering unless it
   *   calls `drawDefault()` or returns `false`.
   * - `overlay`: built-in rendering runs first, then callback runs.
   */
  renderModes?: GraphBuilderCallbackRenderModes;

  /**
   * Called once per grid dot.
   * Replaces the default cross/plus marker drawn at each grid intersection.
   */
  drawGridDot?: GraphBuilderRenderCallback<GridDrawContext>;

  /**
   * Called once per node.
   * Replaces the default rounded-rectangle background and border.
   */
  drawNodeFrame?: GraphBuilderRenderCallback<NodeFrameDrawContext>;

  /**
   * Called once per node after the frame (and ports) have been drawn.
   * Replaces the default label rendering.
   * Use this to render custom content inside the node bounds.
   */
  drawNodeContent?: GraphBuilderRenderCallback<NodeContentDrawContext>;

  /**
   * Called for each deletable node to render its delete button.
   * Replaces the default cross icon in the top-right corner.
   */
  drawDeleteButton?: GraphBuilderRenderCallback<DeleteButtonDrawContext>;

  /**
   * Called for each resizable node to render its resize handle.
   * Replaces the default diagonal-lines icon in the bottom-right corner.
   */
  drawResizeHandle?: GraphBuilderRenderCallback<ResizeHandleDrawContext>;

  /**
   * Called once per port (and once for the floating preview port while
   * dragging a new edge).
   * Replaces the default circular port marker.
   */
  drawPort?: GraphBuilderRenderCallback<PortDrawContext>;

  /**
   * Called once per edge in the graph.
   * Replaces the default bezier curve rendering.
   */
  drawEdge?: GraphBuilderRenderCallback<EdgeDrawContext>;

  /**
   * Called while the user is dragging to create a new edge, to render the
   * in-progress preview curve.
   * Replaces the default dashed/translucent preview curve.
   */
  drawEdgePreview?: GraphBuilderRenderCallback<EdgePreviewDrawContext>;

  /**
   * Called for each active edge dash effect.
   * Replaces the default animated dashed curve rendering.
   */
  drawEdgeDashEffect?: GraphBuilderRenderCallback<EdgeDashEffectDrawContext>;

  /**
   * Called for each active edge moving dot instance.
   * Replaces the default moving dot rendering.
   */
  drawEdgeDotEffect?: GraphBuilderRenderCallback<EdgeDotEffectDrawContext>;

  /**
   * Called for each active port pulse instance.
   * Replaces the default expanding pulse ring rendering.
   */
  drawPortPulseEffect?: GraphBuilderRenderCallback<PortPulseEffectDrawContext>;
};
