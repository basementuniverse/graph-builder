import {
  Animation,
  AnimationMode,
  RepeatMode,
} from '@basementuniverse/animation';
import Camera from '@basementuniverse/camera';
import Debug from '@basementuniverse/debug';
import FrameTimer from '@basementuniverse/frame-timer';
import InputManager from '@basementuniverse/input-manager';
import { vec2 } from '@basementuniverse/vec';
import { ViewPort } from '@basementuniverse/view-port';
import {
  CAMERA_KEYBOARD_PAN_SPEED,
  CAMERA_ZOOM_STEP,
  DEBUG,
  DEFAULT_CAPABILITIES,
  DEFAULT_EFFECTS,
  DEFAULT_NODE_SIZE,
  DEFAULT_THEME,
  DELETE_BUTTON_SIZE,
  EDGE_CURVE_ENDPOINT_OFFSET,
  EDGE_CURVE_SAMPLE_DISTANCE,
  EDGE_HOVER_THRESHOLD,
  FPS_MIN,
  GRAPH_SERIALIZATION_VERSION,
  GRID_SIZE,
  NODE_EASE_AMOUNT,
  NODE_MAX_SIZE,
  NODE_MIN_SIZE,
  PORT_CONNECT_MARGIN,
  PORT_HOVER_MARGIN,
  RESIZE_HANDLE_SIZE,
} from './constants';
import EdgeTool from './EdgeTool';
import { PortSide, PortType, ToolMode, TraversalDirection } from './enums';
import EventBus from './events/EventBus';
import { layoutForceDirected, layoutLayered } from './layout';
import type {
  Edge,
  EdgeConnectionValidationResult,
  EdgeDashEffectConfig,
  EdgeDashRuntimeState,
  EdgeDotEffectConfig,
  EdgeDotRuntimeInstance,
  EdgeDotRuntimeState,
  EdgeEffectTarget,
  EdgeState,
  EdgeTheme,
  EdgeToolEndpoint,
  EffectTriggerHandle,
  Graph,
  GraphBuilderCallbacks,
  GraphBuilderCapabilities,
  GraphBuilderEffectsController,
  GraphBuilderEventHandler,
  GraphBuilderEventMap,
  GraphBuilderOptions,
  GraphDocument,
  GraphDomain,
  GraphEffectChannel,
  LoadFromDomainOptions,
  Node,
  NodeState,
  NodeTemplate,
  NodeTheme,
  Port,
  PortPulseEffectConfig,
  PortPulseRuntimeInstance,
  PortPulseRuntimeState,
  PortRef,
  PortState,
  PortTheme,
  RequiredGraphBuilderOptions,
  VisitorControl,
} from './types';
import {
  clampVec,
  cross,
  curveFromTo,
  getCurveGeometry,
  getNeighbors,
  hasCycle,
  line,
  plus,
  pointInCircle,
  pointInRectangle,
  pointToQuadraticBezierDistance,
  roundedRect,
  roundVec,
  sampleBezierChain,
  topologicalSort,
  traverseBFS,
  traverseDFS,
  triangle,
} from './utils';

const GRID_CHUNK_CELLS = 16;
const GRID_DOT_SIZE = 8;
const GRID_CHUNK_PADDING = GRID_DOT_SIZE;

type GridChunk = {
  cell: vec2;
  origin: vec2;
  canvas: HTMLCanvasElement | null;
  renderRevision: number;
  draw: (
    context: CanvasRenderingContext2D,
    screen: vec2,
    camera: Camera
  ) => void;
};

type GridRenderConfig = {
  gridSize: number;
  gridDotLineWidth: number;
  gridDotColor: string;
  drawGridDot: GraphBuilderCallbacks['drawGridDot'];
};

export default class GraphBuilder<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
> {
  public static screen: vec2 = vec2();

  private static inputInitialised = false;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private frameTimer: FrameTimer;
  private camera: Camera;
  private frameHandle = 0;
  private running = false;

  private gridViewPort: ViewPort<GridChunk> | null = null;
  private gridRenderRevision = 0;
  private gridRenderConfig: GridRenderConfig | null = null;

  private options: RequiredGraphBuilderOptions<TNodeData, TEdgeData, TPortData>;

  private graph: Graph<TNodeData, TEdgeData, TPortData> = {
    nodes: [],
    edges: [],
  };

  private nodeState: Map<string, NodeState> = new Map();
  private edgeState: Map<string, EdgeState> = new Map();
  private portState: Map<string, PortState> = new Map();
  private edgeDashEffects: Map<string, EdgeDashRuntimeState> = new Map();
  private edgeDotEffects: Map<string, EdgeDotRuntimeState> = new Map();
  private portPulseEffects: Map<string, PortPulseRuntimeState> = new Map();
  private effectsPaused = false;

  private eventBus = new EventBus<
    GraphBuilderEventMap<TNodeData, TEdgeData, TPortData>
  >();

  private tool: ToolMode = ToolMode.Select;
  private previousTool: ToolMode | null = null;
  private createNodeTemplate: NodeTemplate<TNodeData, TPortData> | null = null;

  private hoveredNodeId: string | null = null;
  private hoveredEdgeId: string | null = null;
  private hoveredPort: PortRef | null = null;
  private selectedNodeId: string | null = null;

  private draggingNodeId: string | null = null;
  private resizingNodeId: string | null = null;
  private creatingEdge: EdgeTool | null = null;
  private panOffset: vec2 | null = null;

  public readonly effects: GraphBuilderEffectsController = {
    edgeDash: {
      get: (target, channel = 'default') =>
        this.getEdgeDashEffectConfig(target, channel),
      set: (target, patch, channel = 'default') =>
        this.setEdgeDashEffectConfig(target, patch, channel),
      start: (target, patch, channel = 'default') =>
        this.startEdgeDashEffect(target, patch, channel),
      stop: (target, channel = 'default') =>
        this.stopEdgeDashEffect(target, channel),
      clear: (target, channel = 'default') =>
        this.clearEdgeDashEffects(target, channel),
    },
    edgeDot: {
      get: (target, channel = 'default') =>
        this.getEdgeDotEffectConfig(target, channel),
      set: (target, patch, channel = 'default') =>
        this.setEdgeDotEffectConfig(target, patch, channel),
      trigger: (target, patch, channel = 'default') =>
        this.triggerEdgeDotEffect(target, patch, channel),
      start: (target, patch, channel = 'default') =>
        this.startEdgeDotEffect(target, patch, channel),
      stop: (target, channel = 'default') =>
        this.stopEdgeDotEffect(target, channel),
      clear: (target, channel = 'default') =>
        this.clearEdgeDotEffects(target, channel),
    },
    portPulse: {
      trigger: (target, patch, channel = 'default') =>
        this.triggerPortPulseEffect(target, patch, channel),
      clear: (target, channel = 'default') =>
        this.clearPortPulseEffects(target, channel),
    },
    global: {
      setEnabled: enabled => {
        this.options.effects.enabled = enabled;
      },
      setTimeScale: timeScale => {
        this.options.effects.timeScale = Math.max(0, timeScale);
      },
      pause: () => {
        this.effectsPaused = true;
      },
      resume: () => {
        this.effectsPaused = false;
      },
      clearAll: () => {
        this.clearAllEffects();
      },
    },
  };

  public constructor(
    canvas: HTMLElement | null,
    options: GraphBuilderOptions<TNodeData, TEdgeData, TPortData> = {}
  ) {
    if (canvas === null) {
      throw new Error('Canvas element not found');
    }
    if (canvas.tagName.toLowerCase() !== 'canvas') {
      throw new Error('Element is not a canvas');
    }
    this.canvas = canvas as HTMLCanvasElement;

    const context = this.canvas.getContext('2d');
    if (context === null) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.context = context;

    this.options = {
      gridSize: Math.max(1, options.gridSize ?? GRID_SIZE),
      snapToGrid: options.snapToGrid ?? false,
      showGrid: options.showGrid ?? true,
      showPortArrows: options.showPortArrows ?? false,
      showEdgeArrows: options.showEdgeArrows ?? false,
      autoStart: options.autoStart ?? true,
      allowSelfConnection: options.allowSelfConnection ?? false,
      canConnectPorts: options.canConnectPorts,
      resolveEdgeTheme: options.resolveEdgeTheme,
      camera: options.camera ?? {},
      theme: { ...DEFAULT_THEME, ...options.theme },
      effects: {
        ...DEFAULT_EFFECTS,
        ...options.effects,
        edgeDash: {
          ...DEFAULT_EFFECTS.edgeDash,
          ...options.effects?.edgeDash,
        },
        edgeDot: {
          ...DEFAULT_EFFECTS.edgeDot,
          ...options.effects?.edgeDot,
          animation: {
            ...DEFAULT_EFFECTS.edgeDot.animation,
            ...options.effects?.edgeDot?.animation,
          },
        },
        portPulse: {
          ...DEFAULT_EFFECTS.portPulse,
          ...options.effects?.portPulse,
          animation: {
            ...DEFAULT_EFFECTS.portPulse.animation,
            ...options.effects?.portPulse?.animation,
          },
        },
      },
      callbacks: options.callbacks ?? {},
      capabilities: { ...DEFAULT_CAPABILITIES, ...options.capabilities },
    };

    this.canvas.style.backgroundColor = this.options.theme.backgroundColor;

    this.camera = new Camera(vec2(), {
      moveEaseAmount: 0.9,
      scaleEaseAmount: 0.9,
      minScale: 0.5,
      maxScale: 5,
      ...this.options.camera,
    });

    this.frameTimer = new FrameTimer({ minFPS: FPS_MIN });
    Debug.initialise();

    if (!GraphBuilder.inputInitialised) {
      InputManager.initialise({
        element: this.canvas,
        preventContextMenu: true,
      });
      GraphBuilder.inputInitialised = true;
    }

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    if (this.options.autoStart) {
      this.start();
    }
  }

  public on<
    E extends keyof GraphBuilderEventMap<TNodeData, TEdgeData, TPortData>,
  >(
    event: E,
    handler: GraphBuilderEventHandler<TNodeData, TEdgeData, TPortData, E>
  ) {
    return this.eventBus.on(event, handler);
  }

  public off<
    E extends keyof GraphBuilderEventMap<TNodeData, TEdgeData, TPortData>,
  >(
    event: E,
    handler: GraphBuilderEventHandler<TNodeData, TEdgeData, TPortData, E>
  ) {
    this.eventBus.off(event, handler);
  }

  public once<
    E extends keyof GraphBuilderEventMap<TNodeData, TEdgeData, TPortData>,
  >(
    event: E,
    handler: GraphBuilderEventHandler<TNodeData, TEdgeData, TPortData, E>
  ) {
    return this.eventBus.once(event, handler);
  }

  public start() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.loop();
  }

  public stop() {
    this.running = false;
    if (this.frameHandle !== 0) {
      window.cancelAnimationFrame(this.frameHandle);
      this.frameHandle = 0;
    }
  }

  public dispose() {
    this.stop();
    this.clearAllEffects();
    this.resetGridViewPort();
    this.graph.nodes = [];
    this.graph.edges = [];
    this.nodeState.clear();
    this.edgeState.clear();
    this.portState.clear();
    this.eventBus.emit('graphCleared', {});
  }

  public resize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  public getTool() {
    return this.tool;
  }

  public setCapabilities(capabilities: Partial<GraphBuilderCapabilities>) {
    this.options.capabilities = {
      ...this.options.capabilities,
      ...capabilities,
    };
  }

  public setTool(tool: ToolMode, remember = false) {
    const previousTool = this.tool;
    if (remember) {
      this.previousTool = this.tool;
    }
    this.tool = tool;

    if (previousTool !== tool) {
      this.eventBus.emit('toolChanged', { from: previousTool, to: tool });
    }
  }

  public resetTool() {
    if (this.previousTool !== null) {
      this.setTool(this.previousTool);
      this.previousTool = null;
    }
  }

  public setCreateNodeTemplate(
    template: NodeTemplate<TNodeData, TPortData> | null
  ) {
    this.createNodeTemplate = template;
  }

  public setSnapToGrid(enabled: boolean) {
    this.options.snapToGrid = enabled;
  }

  public setGridSize(size: number) {
    const next = Math.max(1, size);
    if (this.options.gridSize === next) {
      return;
    }

    this.options.gridSize = next;
    this.resetGridViewPort();
  }

  public getCameraPosition() {
    return vec2(this.camera.position);
  }

  public setCameraPosition(position: vec2) {
    this.camera.positionImmediate = vec2(position);
  }

  public panCamera(offset: vec2) {
    this.camera.positionImmediate = vec2.add(this.camera.position, offset);
  }

  public getCameraZoom() {
    return this.camera.scale;
  }

  public setCameraZoom(zoom: number) {
    if (!Number.isFinite(zoom)) {
      throw new Error('Camera zoom must be a finite number');
    }

    this.camera.scale = zoom;
  }

  public zoomCamera(delta: number) {
    if (!Number.isFinite(delta)) {
      throw new Error('Camera zoom delta must be a finite number');
    }

    this.camera.scale += delta;
  }

  public getGraph(): Graph<TNodeData, TEdgeData, TPortData> {
    return this.serialize();
  }

  public serialize(): Graph<TNodeData, TEdgeData, TPortData> {
    return {
      nodes: this.graph.nodes.map(node => ({
        ...node,
        position: vec2(node.position),
        size: vec2(node.size),
        ports: node.ports.map(port => ({ ...port })),
      })),
      edges: this.graph.edges.map(edge => ({
        ...edge,
        a: { ...edge.a },
        b: { ...edge.b },
      })),
    };
  }

  public serializeFull(): GraphDocument<TNodeData, TEdgeData, TPortData> {
    return {
      version: GRAPH_SERIALIZATION_VERSION,
      type: 'graph-document',
      graph: this.serialize(),
      layout: {
        cameraPosition: vec2(this.camera.position),
        cameraScale: this.camera.scale,
        selectedNodeId: this.selectedNodeId,
      },
    };
  }

  public serializeRaw(): GraphDomain<TNodeData, TEdgeData> {
    return {
      version: GRAPH_SERIALIZATION_VERSION,
      type: 'graph-domain',
      nodes: this.graph.nodes.map(node => ({
        id: node.id,
        data: node.data,
      })),
      edges: this.graph.edges.map(edge => ({
        a: { ...edge.a },
        b: { ...edge.b },
        data: edge.data,
      })),
    };
  }

  public load(graph: Graph<TNodeData, TEdgeData, TPortData>) {
    this.clearAllEffects();
    this.graph = this.cloneGraph(graph);
    this.nodeState.clear();
    this.edgeState.clear();
    this.portState.clear();

    for (const node of this.graph.nodes) {
      this.ensureNodeState(node);
      for (const port of node.ports) {
        this.ensurePortState(node.id, port.id, port.side);
      }
    }

    for (const edge of this.graph.edges) {
      this.ensureEdgeState(edge);
    }

    this.hoveredNodeId = null;
    this.hoveredEdgeId = null;
    this.hoveredPort = null;
    this.draggingNodeId = null;
    this.resizingNodeId = null;
    this.creatingEdge = null;

    this.eventBus.emit('graphLoaded', {
      graph: this.serialize(),
    });
  }

  public loadFromDocument(
    document: GraphDocument<TNodeData, TEdgeData, TPortData>
  ) {
    if (document.type !== 'graph-document') {
      throw new Error('Invalid graph document type');
    }

    this.load(document.graph);
    if (document.layout) {
      this.camera.positionImmediate = vec2(document.layout.cameraPosition);
      this.camera.scale = document.layout.cameraScale;
      this.selectNode(document.layout.selectedNodeId);
    }
  }

  public loadFromDomain(
    domain: GraphDomain<TNodeData, TEdgeData>,
    options: LoadFromDomainOptions<TNodeData, TPortData> = {}
  ) {
    if (domain.type !== 'graph-domain') {
      throw new Error('Invalid graph domain type');
    }

    const nodes: Node<TNodeData, TPortData>[] = domain.nodes.map(domainNode => {
      const resolved = options.resolveNode?.(domainNode);
      return {
        id: domainNode.id,
        data: domainNode.data,
        label: resolved?.label,
        position: vec2(),
        size: vec2(resolved?.size ?? DEFAULT_NODE_SIZE),
        ports: resolved?.ports?.map(port => ({ ...port })) ?? [],
        resizable: resolved?.resizable ?? true,
        deletable: resolved?.deletable ?? true,
      };
    });

    const edges: Edge<TEdgeData>[] = domain.edges.map(edge => ({
      a: { ...edge.a },
      b: { ...edge.b },
      data: edge.data,
    }));

    this.load({ nodes, edges });
  }

  public createNode(
    position: vec2,
    template?: NodeTemplate<TNodeData, TPortData>
  ): Node<TNodeData, TPortData> {
    if (!this.options.capabilities.createNodes) {
      throw new Error('Node creation is disabled by capabilities');
    }

    const source = template ?? this.createNodeTemplate;
    if (!source) {
      throw new Error('No node template has been configured');
    }

    const nodeCreatingPayload: GraphBuilderEventMap<
      TNodeData,
      TEdgeData,
      TPortData
    >['nodeCreating'] = {
      position: vec2(position),
      template: {
        ...source,
        size: vec2(source.size),
        ports: source.ports.map(port => ({ ...port })),
      },
    };

    const nodeCreating = this.eventBus.emitCancellable(
      'nodeCreating',
      nodeCreatingPayload
    );
    if (nodeCreating.cancelled) {
      throw new Error('Node creation was cancelled by an event handler');
    }

    const node: Node<TNodeData, TPortData> = {
      id: this.createId('node'),
      position: vec2(position),
      size: vec2(source.size ?? DEFAULT_NODE_SIZE),
      label: source.label,
      ports: source.ports.map(port => ({ ...port })),
      resizable: source.resizable ?? true,
      deletable: source.deletable ?? true,
      data: source.data,
      theme: source.theme,
    };

    this.graph.nodes.push(node);
    this.ensureNodeState(node);
    for (const port of node.ports) {
      this.ensurePortState(node.id, port.id, port.side);
    }

    this.eventBus.emit('nodeCreated', { node: { ...node } });

    return node;
  }

  public addNode(node: Node<TNodeData, TPortData>): boolean {
    if (this.graph.nodes.some(n => n.id === node.id)) {
      return false;
    }

    const clonedNode: Node<TNodeData, TPortData> = {
      ...node,
      position: vec2(node.position),
      size: vec2(node.size),
      ports: node.ports.map(port => ({ ...port })),
    };

    this.graph.nodes.push(clonedNode);
    this.ensureNodeState(clonedNode);
    for (const port of clonedNode.ports) {
      this.ensurePortState(clonedNode.id, port.id, port.side);
    }

    this.eventBus.emit('nodeCreated', { node: { ...clonedNode } });

    return true;
  }

  public removeNode(nodeId: string): boolean {
    if (!this.options.capabilities.deleteNodes) {
      return false;
    }

    const node = this.graph.nodes.find(n => n.id === nodeId);
    if (!node) {
      return false;
    }

    const nodeRemovingPayload: GraphBuilderEventMap<
      TNodeData,
      TEdgeData,
      TPortData
    >['nodeRemoving'] = {
      nodeId,
      node: {
        ...node,
        position: vec2(node.position),
        size: vec2(node.size),
        ports: node.ports.map(port => ({ ...port })),
      },
    };

    const nodeRemoving = this.eventBus.emitCancellable(
      'nodeRemoving',
      nodeRemovingPayload
    );
    if (nodeRemoving.cancelled) {
      return false;
    }

    this.clearEdgeEffectsForNode(nodeId);

    this.graph.edges = this.graph.edges.filter(
      edge => edge.a.nodeId !== nodeId && edge.b.nodeId !== nodeId
    );
    this.graph.nodes = this.graph.nodes.filter(n => n.id !== nodeId);

    this.nodeState.delete(nodeId);
    for (const port of node.ports) {
      this.portState.delete(this.portKey(nodeId, port.id));
      this.clearPortPulseEffects({ nodeId, portId: port.id });
    }

    if (this.selectedNodeId === nodeId) {
      this.selectedNodeId = null;
    }
    if (this.hoveredNodeId === nodeId) {
      this.hoveredNodeId = null;
    }
    if (this.draggingNodeId === nodeId) {
      this.draggingNodeId = null;
    }
    if (this.resizingNodeId === nodeId) {
      this.resizingNodeId = null;
    }

    this.eventBus.emit('nodeRemoved', {
      nodeId,
      node: {
        ...node,
        position: vec2(node.position),
        size: vec2(node.size),
        ports: node.ports.map(port => ({ ...port })),
      },
    });

    return true;
  }

  public setNodeData(nodeId: string, data: TNodeData | undefined): boolean {
    const node = this.graph.nodes.find(n => n.id === nodeId);
    if (!node) {
      return false;
    }

    const from = node.data;
    node.data = data;

    this.eventBus.emit('nodeDataUpdated', {
      nodeId,
      from,
      to: node.data,
      node: {
        ...node,
        position: vec2(node.position),
        size: vec2(node.size),
        ports: node.ports.map(port => ({ ...port })),
      },
    });

    return true;
  }

  public updateNodeData(
    nodeId: string,
    updater: (
      current: TNodeData | undefined,
      node: Node<TNodeData, TPortData>
    ) => TNodeData | undefined
  ): boolean {
    const node = this.graph.nodes.find(n => n.id === nodeId);
    if (!node) {
      return false;
    }

    const next = updater(node.data, {
      ...node,
      position: vec2(node.position),
      size: vec2(node.size),
      ports: node.ports.map(port => ({ ...port })),
    });
    return this.setNodeData(nodeId, next);
  }

  public setPortData(target: PortRef, data: TPortData | undefined): boolean {
    const resolved = this.resolveNodeAndPort(target);
    if (!resolved) {
      return false;
    }

    const { node, port } = resolved;
    const from = port.data;
    port.data = data;

    this.eventBus.emit('portDataUpdated', {
      nodeId: node.id,
      portId: port.id,
      from,
      to: port.data,
      node: {
        ...node,
        position: vec2(node.position),
        size: vec2(node.size),
        ports: node.ports.map(existingPort => ({ ...existingPort })),
      },
      port: { ...port },
    });

    return true;
  }

  public updatePortData(
    target: PortRef,
    updater: (
      current: TPortData | undefined,
      port: Port<TPortData>,
      node: Node<TNodeData, TPortData>
    ) => TPortData | undefined
  ): boolean {
    const resolved = this.resolveNodeAndPort(target);
    if (!resolved) {
      return false;
    }

    const { node, port } = resolved;
    const next = updater(
      port.data,
      { ...port },
      {
        ...node,
        position: vec2(node.position),
        size: vec2(node.size),
        ports: node.ports.map(existingPort => ({ ...existingPort })),
      }
    );
    return this.setPortData(target, next);
  }

  public createEdge(
    a: PortRef,
    b: PortRef,
    data?: TEdgeData,
    options?: { theme?: Partial<EdgeTheme> }
  ): boolean {
    if (!this.options.capabilities.createEdges) {
      return false;
    }

    const aEndpoint = this.resolvePortEndpoint(a);
    const bEndpoint = this.resolvePortEndpoint(b);
    if (!aEndpoint || !bEndpoint) {
      return false;
    }

    const validation = this.validateConnection(aEndpoint, bEndpoint);
    if (!validation.allowed) {
      return false;
    }

    const normalized = this.normalizeEdgeEndpoints(a, b, data);
    if (!normalized) {
      return false;
    }

    const fromNodeAndPort = this.resolveNodeAndPort(normalized.a);
    const toNodeAndPort = this.resolveNodeAndPort(normalized.b);
    const resolvedTheme: Partial<EdgeTheme> = {
      ...(fromNodeAndPort?.port.edgeTheme ?? {}),
      ...(fromNodeAndPort && toNodeAndPort
        ? this.options.resolveEdgeTheme?.({
            fromNode: fromNodeAndPort.node,
            fromPort: fromNodeAndPort.port,
            toNode: toNodeAndPort.node,
            toPort: toNodeAndPort.port,
            data,
          })
        : undefined),
      ...(options?.theme ?? {}),
    };

    if (Object.keys(resolvedTheme).length > 0) {
      normalized.theme = resolvedTheme;
    }

    const edgeCreatingPayload: GraphBuilderEventMap<
      TNodeData,
      TEdgeData,
      TPortData
    >['edgeCreating'] = {
      edge: {
        ...normalized,
        a: { ...normalized.a },
        b: { ...normalized.b },
      },
    };

    const edgeCreating = this.eventBus.emitCancellable(
      'edgeCreating',
      edgeCreatingPayload
    );
    if (edgeCreating.cancelled) {
      return false;
    }

    if (this.edgeExists(normalized.a, normalized.b)) {
      return false;
    }

    this.graph.edges.push(normalized);
    this.ensureEdgeState(normalized);

    this.eventBus.emit('edgeCreated', {
      edge: {
        ...normalized,
        a: { ...normalized.a },
        b: { ...normalized.b },
      },
    });

    return true;
  }

  public removeEdge(a: PortRef, b: PortRef): boolean {
    if (!this.options.capabilities.deleteEdges) {
      return false;
    }

    const existing = this.findEdge(a, b);
    if (!existing) {
      return false;
    }

    const edgeRemovingPayload: GraphBuilderEventMap<
      TNodeData,
      TEdgeData,
      TPortData
    >['edgeRemoving'] = {
      edge: {
        ...existing,
        a: { ...existing.a },
        b: { ...existing.b },
      },
    };

    const edgeRemoving = this.eventBus.emitCancellable(
      'edgeRemoving',
      edgeRemovingPayload
    );
    if (edgeRemoving.cancelled) {
      return false;
    }

    this.graph.edges = this.graph.edges.filter(
      edge =>
        !(
          this.portRefEq(edge.a, existing.a) &&
          this.portRefEq(edge.b, existing.b)
        )
    );
    this.clearEdgeDashEffects({ a: existing.a, b: existing.b });
    this.clearEdgeDotEffects({ a: existing.a, b: existing.b });
    this.edgeState.delete(this.edgeKey(existing));

    this.eventBus.emit('edgeRemoved', {
      edge: {
        ...existing,
        a: { ...existing.a },
        b: { ...existing.b },
      },
    });

    return true;
  }

  public setEdgeData(
    a: PortRef,
    b: PortRef,
    data: TEdgeData | undefined
  ): boolean {
    const edge = this.findEdge(a, b);
    if (!edge) {
      return false;
    }

    const from = edge.data;
    edge.data = data;

    this.eventBus.emit('edgeDataUpdated', {
      from,
      to: edge.data,
      edge: {
        ...edge,
        a: { ...edge.a },
        b: { ...edge.b },
      },
    });

    return true;
  }

  public updateEdgeData(
    a: PortRef,
    b: PortRef,
    updater: (
      current: TEdgeData | undefined,
      edge: Edge<TEdgeData>
    ) => TEdgeData | undefined
  ): boolean {
    const edge = this.findEdge(a, b);
    if (!edge) {
      return false;
    }

    const next = updater(edge.data, {
      ...edge,
      a: { ...edge.a },
      b: { ...edge.b },
    });
    return this.setEdgeData(a, b, next);
  }

  public getNeighbors(
    nodeId: string,
    direction: TraversalDirection = TraversalDirection.Both
  ) {
    return getNeighbors(this.graph, nodeId, direction);
  }

  public traverseBFS<TResult = void>(
    startNodeId: string,
    visitor: (
      node: Node<TNodeData, TPortData>,
      depth: number
    ) => TResult | VisitorControl,
    direction: TraversalDirection = TraversalDirection.Both
  ) {
    return traverseBFS(this.graph, startNodeId, visitor, direction);
  }

  public traverseDFS<TResult = void>(
    startNodeId: string,
    visitor: (
      node: Node<TNodeData, TPortData>,
      depth: number
    ) => TResult | VisitorControl,
    direction: TraversalDirection = TraversalDirection.Both
  ) {
    return traverseDFS(this.graph, startNodeId, visitor, direction);
  }

  public topologicalSort() {
    return topologicalSort(this.graph);
  }

  public hasCycle() {
    return hasCycle(this.graph);
  }

  public snapAllToGrid(
    options: { snapPositions?: boolean; snapSizes?: boolean } = {}
  ) {
    const snapPositions = options.snapPositions ?? true;
    const snapSizes = options.snapSizes ?? true;

    for (const node of this.graph.nodes) {
      if (snapPositions) {
        const from = vec2(node.position);
        node.position = roundVec(node.position, this.options.gridSize);
        this.eventBus.emit('nodeMoved', {
          nodeId: node.id,
          from,
          to: vec2(node.position),
        });
      }

      if (snapSizes) {
        const from = vec2(node.size);
        node.size = roundVec(node.size, this.options.gridSize);
        this.eventBus.emit('nodeResized', {
          nodeId: node.id,
          from,
          to: vec2(node.size),
        });
      }
    }
  }

  public async arrangeForceDirected(
    options?: Parameters<typeof layoutForceDirected>[1]
  ) {
    const result = await layoutForceDirected(this.graph, options);

    for (const [nodeId, position] of result.nodePositions.entries()) {
      const node = this.graph.nodes.find(n => n.id === nodeId);
      if (!node) {
        continue;
      }
      node.position = vec2(position);
      this.ensureNodeState(node).actualPosition = vec2(position);
    }

    this.eventBus.emit('graphArranged', {
      strategy: 'forceDirected',
    });

    return result;
  }

  public async arrangeLayered(options?: Parameters<typeof layoutLayered>[1]) {
    const result = await layoutLayered(this.graph, options);
    if (!result) {
      this.eventBus.emit('graphArrangementFailed', {
        strategy: 'layered',
        reason: 'Graph contains cycles',
      });
      return null;
    }

    for (const [nodeId, position] of result.nodePositions.entries()) {
      const node = this.graph.nodes.find(n => n.id === nodeId);
      if (!node) {
        continue;
      }
      node.position = vec2(position);
      this.ensureNodeState(node).actualPosition = vec2(position);
    }

    this.eventBus.emit('graphArranged', {
      strategy: 'layered',
    });

    return result;
  }

  public async arrangeGraph(
    strategy: 'forceDirected' | 'layered',
    options?:
      | Parameters<typeof layoutForceDirected>[1]
      | Parameters<typeof layoutLayered>[1]
  ) {
    if (strategy === 'layered') {
      return this.arrangeLayered(
        options as Parameters<typeof layoutLayered>[1]
      );
    }

    return this.arrangeForceDirected(
      options as Parameters<typeof layoutForceDirected>[1]
    );
  }

  public draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.save();
    this.camera.setTransforms(this.context);

    if (this.options.showGrid) {
      this.drawGrid();
    }

    for (const node of this.graph.nodes) {
      this.drawNode(node);
    }
    for (const edge of this.graph.edges) {
      this.drawEdge(edge);
    }
    this.drawEffects();
    if (this.creatingEdge) {
      this.drawEdgePreviewPort();
      this.drawEdgePreview();
    }

    Debug.draw(this.context);
    this.context.restore();
  }

  public update(dt: number) {
    GraphBuilder.screen = vec2(this.canvas.width, this.canvas.height);

    if (InputManager.keyDown('Space') && this.tool !== ToolMode.Pan) {
      this.setTool(ToolMode.Pan, true);
    }
    if (InputManager.keyReleased('Space') && this.tool === ToolMode.Pan) {
      this.resetTool();
    }

    this.updateCamera(dt);
    this.camera.update(GraphBuilder.screen);

    const mouse = this.camera.screenToWorld(InputManager.mousePosition);

    this.updatePortStates(mouse);
    this.updateNodeStates(mouse);
    this.updateEdgeStates(mouse);
    this.handleInteractions(mouse);
    this.easeNodes();
    this.updateEffects(dt);

    InputManager.update();
  }

  private loop() {
    this.frameTimer.update();
    this.update(this.frameTimer.elapsedTime);
    this.draw();

    if (DEBUG) {
      Debug.value('FPS', this.frameTimer.frameRate, {
        align: 'right',
      });
    }

    if (this.running) {
      this.frameHandle = window.requestAnimationFrame(this.loop.bind(this));
    }
  }

  private updateCamera(dt: number) {
    if (this.tool === ToolMode.Pan && InputManager.mouseDown()) {
      const cameraPosition = this.camera.screenToWorld(
        InputManager.mousePosition
      );
      if (!this.panOffset) {
        this.panOffset = cameraPosition;
      }

      this.camera.positionImmediate = vec2.add(
        this.camera.position,
        vec2.sub(this.panOffset, cameraPosition)
      );
    }
    if (!InputManager.mouseDown()) {
      this.panOffset = null;
    }

    const pan = vec2(CAMERA_KEYBOARD_PAN_SPEED * dt, 0);
    if (InputManager.keyDown('KeyW') || InputManager.keyDown('ArrowUp')) {
      this.camera.positionImmediate = vec2.add(
        this.camera.position,
        vec2.rotf(pan, 1)
      );
    }
    if (InputManager.keyDown('KeyS') || InputManager.keyDown('ArrowDown')) {
      this.camera.positionImmediate = vec2.add(
        this.camera.position,
        vec2.rotf(pan, -1)
      );
    }
    if (InputManager.keyDown('KeyA') || InputManager.keyDown('ArrowLeft')) {
      this.camera.positionImmediate = vec2.add(
        this.camera.position,
        vec2.rotf(pan, 2)
      );
    }
    if (InputManager.keyDown('KeyD') || InputManager.keyDown('ArrowRight')) {
      this.camera.positionImmediate = vec2.add(
        this.camera.position,
        vec2.rotf(pan, 0)
      );
    }

    if (InputManager.mouseWheelUp()) {
      this.camera.scale -= CAMERA_ZOOM_STEP;
    }
    if (InputManager.mouseWheelDown()) {
      this.camera.scale += CAMERA_ZOOM_STEP;
    }
  }

  private updatePortStates(mouse: vec2) {
    this.hoveredPort = null;
    for (const node of this.graph.nodes) {
      for (const port of node.ports) {
        const state = this.ensurePortState(node.id, port.id, port.side);
        state.position = this.resolvePortPosition(node, port);
        state.direction = this.directionFromSide(port.side);
        state.hovered = false;
        state.connectable = true;
        state.invalidReason = null;
      }
    }

    if (this.creatingEdge) {
      this.ensurePortState(
        this.creatingEdge.a.nodeId,
        this.creatingEdge.a.portId,
        this.creatingEdge.a.side
      ).hovered = true;
    }

    const isConnectMode = this.tool === ToolMode.CreateEdge;
    const reversedNodes = [...this.graph.nodes].reverse();
    for (const node of reversedNodes) {
      for (const port of node.ports) {
        const state = this.ensurePortState(node.id, port.id, port.side);
        const effectiveRadius = this.effectivePortTheme(port).portRadius;
        const radius =
          effectiveRadius +
          (isConnectMode ? PORT_CONNECT_MARGIN : PORT_HOVER_MARGIN);
        const hovered = pointInCircle(mouse, {
          position: state.position,
          radius,
        });

        if (!hovered) {
          continue;
        }

        if (this.tool === ToolMode.CreateEdge && this.creatingEdge) {
          const start = this.creatingEdge.a;
          const end: EdgeToolEndpoint = {
            nodeId: node.id,
            portId: port.id,
            type: port.type,
            side: port.side,
            position: state.position,
            direction: state.direction,
          };

          const validation = this.validateConnection(start, end);
          if (!validation.allowed) {
            state.hovered = true;
            state.connectable = false;
            state.invalidReason =
              validation.reason ?? 'Connection is not allowed';
            continue;
          }
        }

        this.hoveredPort = { nodeId: node.id, portId: port.id };
        state.hovered = true;
        return;
      }
    }
  }

  private updateNodeStates(mouse: vec2) {
    this.hoveredNodeId = null;

    for (const node of this.graph.nodes) {
      const state = this.ensureNodeState(node);
      state.hovered = false;
      state.resizeHovered = false;
      state.deleteHovered = false;
    }

    const reversedNodes = [...this.graph.nodes].reverse();
    for (const node of reversedNodes) {
      const state = this.ensureNodeState(node);

      if (this.hoveredPort?.nodeId === node.id) {
        continue;
      }

      const hovered =
        [ToolMode.Select, ToolMode.ResizeNode].includes(this.tool) &&
        pointInRectangle(mouse, {
          position: node.position,
          size: node.size,
        });
      if (!hovered) {
        continue;
      }

      state.hovered = true;
      this.hoveredNodeId = node.id;
      break;
    }

    for (const node of this.graph.nodes) {
      const state = this.ensureNodeState(node);
      if (!state.hovered) {
        continue;
      }

      const deleteHovered =
        this.options.capabilities.deleteNodes &&
        (node.deletable ?? true) &&
        this.tool === ToolMode.Select &&
        pointInRectangle(mouse, {
          position: vec2.add(
            node.position,
            vec2(node.size.x - DELETE_BUTTON_SIZE, 0)
          ),
          size: vec2(DELETE_BUTTON_SIZE),
        });
      state.deleteHovered = deleteHovered;

      const resizeHovered =
        this.options.capabilities.resizeNodes &&
        (node.resizable ?? true) &&
        [ToolMode.Select, ToolMode.ResizeNode].includes(this.tool) &&
        pointInRectangle(mouse, {
          position: vec2.add(
            node.position,
            vec2.sub(node.size, RESIZE_HANDLE_SIZE)
          ),
          size: vec2(RESIZE_HANDLE_SIZE),
        });
      state.resizeHovered = resizeHovered;

      if (resizeHovered && this.tool !== ToolMode.ResizeNode) {
        this.setTool(ToolMode.ResizeNode, true);
      }
    }

    if (
      this.tool === ToolMode.ResizeNode &&
      this.graph.nodes.every(node => {
        const state = this.ensureNodeState(node);
        return !state.resizeHovered && !state.resizing;
      })
    ) {
      this.resetTool();
      if (this.tool === ToolMode.ResizeNode) {
        this.setTool(ToolMode.Select);
      }
    }
  }

  private updateEdgeStates(mouse: vec2) {
    this.hoveredEdgeId = null;
    for (const edge of this.graph.edges) {
      this.ensureEdgeState(edge).hovered = false;
    }

    if (
      [ToolMode.ResizeNode, ToolMode.CreateEdge].includes(this.tool) ||
      !!this.draggingNodeId
    ) {
      return;
    }

    const reversedEdges = [...this.graph.edges].reverse();
    for (const edge of reversedEdges) {
      const hit = this.edgeHitTest(edge, mouse);
      if (!hit) {
        continue;
      }

      for (const endpoint of [edge.a, edge.b]) {
        const resolved = this.resolvePortEndpoint(endpoint);
        if (!resolved) {
          continue;
        }

        this.ensurePortState(
          resolved.nodeId,
          resolved.portId,
          resolved.side
        ).hovered = true;
      }

      const key = this.edgeKey(edge);
      this.edgeState.get(key)!.hovered = true;
      this.hoveredEdgeId = key;
      break;
    }
  }

  private edgeHitTest(edge: Edge<TEdgeData>, mouse: vec2): boolean {
    const aEndpoint = this.resolvePortEndpoint(edge.a);
    const bEndpoint = this.resolvePortEndpoint(edge.b);
    if (!aEndpoint || !bEndpoint) {
      return false;
    }

    const a = vec2.add(
      aEndpoint.position,
      vec2.mul(aEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
    );
    const b = vec2.add(
      bEndpoint.position,
      vec2.mul(bEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
    );
    const { cp1, cp2, join } = getCurveGeometry(
      a,
      b,
      aEndpoint.direction,
      bEndpoint.direction,
      this.options.gridSize
    );

    const samples =
      Math.ceil(vec2.len(vec2.sub(a, b)) / EDGE_CURVE_SAMPLE_DISTANCE) + 1;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const d1 = pointToQuadraticBezierDistance(mouse, a, cp1, join, t);
      const d2 = pointToQuadraticBezierDistance(mouse, join, cp2, b, t);
      if (d1 < EDGE_HOVER_THRESHOLD || d2 < EDGE_HOVER_THRESHOLD) {
        return true;
      }
    }
    return false;
  }

  private handleInteractions(mouse: vec2) {
    const hoveredNode = this.hoveredNodeId
      ? (this.graph.nodes.find(node => node.id === this.hoveredNodeId) ?? null)
      : null;
    const hoveredNodeState = hoveredNode
      ? this.ensureNodeState(hoveredNode)
      : null;
    const hoveredPort = this.hoveredPort
      ? this.resolvePortEndpoint(this.hoveredPort)
      : null;

    if (
      this.tool === ToolMode.Select &&
      InputManager.mousePressed() &&
      !hoveredNode &&
      !hoveredPort
    ) {
      this.selectNode(null);
    }

    if (
      hoveredNode &&
      hoveredNodeState &&
      hoveredNodeState.selected &&
      InputManager.mousePressed() &&
      InputManager.keyDown('ControlLeft')
    ) {
      this.removeNode(hoveredNode.id);
      return;
    }

    if (
      hoveredNode &&
      hoveredNodeState?.deleteHovered &&
      InputManager.mouseDown()
    ) {
      this.removeNode(hoveredNode.id);
      return;
    }

    if (
      this.options.capabilities.createNodes &&
      this.tool === ToolMode.CreateNode &&
      this.createNodeTemplate &&
      !hoveredNode &&
      !hoveredPort &&
      InputManager.mousePressed()
    ) {
      this.createNode(mouse);
    }

    if (
      this.options.capabilities.createEdges &&
      hoveredPort &&
      InputManager.mousePressed()
    ) {
      const incoming = this.findIncomingEdgeForPort({
        nodeId: hoveredPort.nodeId,
        portId: hoveredPort.portId,
      });

      if (hoveredPort.type === PortType.Input && incoming) {
        this.removeEdge(incoming.a, incoming.b);
        const source = this.resolvePortEndpoint(incoming.a);
        if (source) {
          this.startCreatingEdge(source);
        }
      } else {
        this.startCreatingEdge(hoveredPort);
      }
    }

    if (
      this.options.capabilities.moveNodes &&
      this.tool === ToolMode.Select &&
      hoveredNode &&
      hoveredNodeState &&
      !hoveredPort &&
      !this.draggingNodeId &&
      InputManager.mouseDown()
    ) {
      this.selectNode(hoveredNode.id);
      this.draggingNodeId = hoveredNode.id;
      hoveredNodeState.dragging = true;
      hoveredNodeState.dragOffset = vec2.sub(mouse, hoveredNode.position);
    }

    if (
      this.options.capabilities.resizeNodes &&
      this.tool === ToolMode.ResizeNode &&
      hoveredNode &&
      hoveredNodeState &&
      hoveredNodeState.resizeHovered &&
      !this.resizingNodeId &&
      InputManager.mouseDown()
    ) {
      this.resizingNodeId = hoveredNode.id;
      hoveredNodeState.resizing = true;
      hoveredNodeState.resizeOffset = vec2.sub(
        mouse,
        vec2.add(hoveredNode.position, hoveredNode.size)
      );
    }

    if (this.draggingNodeId) {
      const node = this.graph.nodes.find(n => n.id === this.draggingNodeId);
      const state = node ? this.ensureNodeState(node) : null;
      if (node && state) {
        const from = vec2(node.position);
        node.position = vec2.sub(mouse, state.dragOffset);
        if (this.options.snapToGrid) {
          node.position = roundVec(node.position, this.options.gridSize);
        }

        if (from.x !== node.position.x || from.y !== node.position.y) {
          this.eventBus.emit('nodeMoved', {
            nodeId: node.id,
            from,
            to: vec2(node.position),
          });
        }
      }
    }

    if (this.resizingNodeId) {
      const node = this.graph.nodes.find(n => n.id === this.resizingNodeId);
      const state = node ? this.ensureNodeState(node) : null;
      if (node && state) {
        const from = vec2(node.size);
        node.size = clampVec(
          vec2.sub(vec2.sub(mouse, node.position), state.resizeOffset),
          vec2(NODE_MIN_SIZE),
          vec2(NODE_MAX_SIZE)
        );
        if (this.options.snapToGrid) {
          node.size = roundVec(node.size, this.options.gridSize);
        }

        if (from.x !== node.size.x || from.y !== node.size.y) {
          this.eventBus.emit('nodeResized', {
            nodeId: node.id,
            from,
            to: vec2(node.size),
          });
        }
      }
    }

    if (this.creatingEdge) {
      const hovered = this.hoveredPort
        ? this.resolvePortEndpoint(this.hoveredPort)
        : null;

      this.creatingEdge.update(
        hovered ? vec2(hovered.position) : vec2(mouse),
        hovered ? hovered.direction : null
      );
    }

    if (!InputManager.mouseDown()) {
      if (this.draggingNodeId) {
        const node = this.graph.nodes.find(n => n.id === this.draggingNodeId);
        if (node) {
          this.ensureNodeState(node).dragging = false;
        }
      }
      this.draggingNodeId = null;

      if (this.resizingNodeId) {
        const node = this.graph.nodes.find(n => n.id === this.resizingNodeId);
        if (node) {
          this.ensureNodeState(node).resizing = false;
        }
      }
      this.resizingNodeId = null;

      this.stopCreatingEdge();
    }
  }

  private startCreatingEdge(endpoint: EdgeToolEndpoint) {
    this.setTool(ToolMode.CreateEdge, true);
    const sourceNode = this.graph.nodes.find(n => n.id === endpoint.nodeId);
    const sourcePort = sourceNode?.ports.find(p => p.id === endpoint.portId);
    this.creatingEdge = new EdgeTool(endpoint, sourcePort?.edgeTheme);
  }

  private stopCreatingEdge() {
    if (!this.creatingEdge) {
      return;
    }

    const start = this.creatingEdge.a;
    const hovered = this.hoveredPort
      ? this.resolvePortEndpoint(this.hoveredPort)
      : null;

    if (hovered) {
      const validation = this.validateConnection(start, hovered);
      if (validation.allowed) {
        this.createEdge(
          { nodeId: start.nodeId, portId: start.portId },
          { nodeId: hovered.nodeId, portId: hovered.portId },
          undefined,
          this.creatingEdge.theme
            ? { theme: this.creatingEdge.theme }
            : undefined
        );
      } else {
        this.eventBus.emit('edgeConnectionRejected', {
          from: { nodeId: start.nodeId, portId: start.portId },
          to: { nodeId: hovered.nodeId, portId: hovered.portId },
          reason: validation.reason ?? 'Connection is not allowed',
        });
      }
    }

    this.creatingEdge = null;
    this.resetTool();
    if (this.tool === ToolMode.CreateEdge) {
      this.setTool(ToolMode.Select);
    }
  }

  private validateConnection(
    a: EdgeToolEndpoint,
    b: EdgeToolEndpoint
  ): EdgeConnectionValidationResult {
    if (!this.options.allowSelfConnection && a.nodeId === b.nodeId) {
      return {
        allowed: false,
        reason: 'Cannot connect a node to itself',
      };
    }

    if (a.type === b.type) {
      return {
        allowed: false,
        reason: 'Cannot connect input-to-input or output-to-output',
      };
    }

    const normalized = this.normalizeEdgeEndpoints(
      { nodeId: a.nodeId, portId: a.portId },
      { nodeId: b.nodeId, portId: b.portId }
    );
    if (!normalized) {
      return {
        allowed: false,
        reason: 'Invalid edge endpoints',
      };
    }

    const incoming = this.findIncomingEdgeForPort(normalized.b);
    if (incoming) {
      return {
        allowed: false,
        reason: 'Input port already has an incoming edge',
      };
    }

    if (this.edgeExists(normalized.a, normalized.b)) {
      return {
        allowed: false,
        reason: 'Edge already exists',
      };
    }

    if (!this.options.canConnectPorts) {
      return { allowed: true };
    }

    const from = this.resolveNodeAndPort(normalized.a);
    const to = this.resolveNodeAndPort(normalized.b);
    if (!from || !to) {
      return {
        allowed: false,
        reason: 'Could not resolve edge endpoints',
      };
    }

    return this.options.canConnectPorts({
      fromNode: from.node,
      fromPort: from.port,
      toNode: to.node,
      toPort: to.port,
      edge: normalized,
    });
  }

  private canConnectEndpoints(
    a: EdgeToolEndpoint,
    b: EdgeToolEndpoint
  ): boolean {
    return this.validateConnection(a, b).allowed;
  }

  private easeNodes() {
    for (const node of this.graph.nodes) {
      const state = this.ensureNodeState(node);
      state.actualPosition = vec2.add(
        state.actualPosition,
        vec2.mul(
          vec2.sub(node.position, state.actualPosition),
          NODE_EASE_AMOUNT
        )
      );
      state.actualSize = vec2.add(
        state.actualSize,
        vec2.mul(vec2.sub(node.size, state.actualSize), NODE_EASE_AMOUNT)
      );
    }
  }

  private drawGrid() {
    const { theme, callbacks } = this.options;
    const nextConfig: GridRenderConfig = {
      gridSize: this.options.gridSize,
      gridDotLineWidth: theme.gridDotLineWidth,
      gridDotColor: theme.gridDotColor,
      drawGridDot: callbacks.drawGridDot,
    };
    const previousConfig = this.gridRenderConfig;

    if (previousConfig && previousConfig.gridSize !== nextConfig.gridSize) {
      this.resetGridViewPort();
    }

    if (
      !previousConfig ||
      previousConfig.gridDotLineWidth !== nextConfig.gridDotLineWidth ||
      previousConfig.gridDotColor !== nextConfig.gridDotColor ||
      previousConfig.drawGridDot !== nextConfig.drawGridDot
    ) {
      this.gridRenderRevision += 1;
    }
    this.gridRenderConfig = nextConfig;

    this.ensureGridViewPort();
    if (!this.gridViewPort) {
      return;
    }

    const screen = vec2(this.canvas.width, this.canvas.height);

    this.context.save();
    this.context.lineWidth = theme.gridDotLineWidth;
    this.context.strokeStyle = theme.gridDotColor;
    this.gridViewPort.update(0, screen, this.camera);
    this.gridViewPort.draw(this.context, screen, this.camera);
    this.context.restore();
  }

  private ensureGridViewPort() {
    if (this.gridViewPort) {
      return;
    }

    const chunkSize = this.gridChunkWorldSize();
    this.gridViewPort = new ViewPort<GridChunk>({
      gridSize: vec2(chunkSize, chunkSize),
      generator: cell => this.createGridChunk(cell, chunkSize),
      border: 1,
      bufferAmount: 32,
      maxElementsToGenerate: 64,
      spatialHashMaxElements: 2000,
      spatialHashMaxElementsToRemove: 200,
    });
  }

  private resetGridViewPort() {
    this.gridViewPort = null;
    this.gridRenderRevision = 0;
    this.gridRenderConfig = null;
  }

  private createGridChunk(cell: vec2, chunkSize: number): GridChunk {
    const origin = vec2(cell.x * chunkSize, cell.y * chunkSize);
    const chunk: GridChunk = {
      cell: vec2(cell),
      origin,
      canvas: null,
      renderRevision: -1,
      draw: context => {
        this.drawGridChunk(context, chunk);
      },
    };
    return chunk;
  }

  private drawGridChunk(context: CanvasRenderingContext2D, chunk: GridChunk) {
    const drawGridDot = this.options.callbacks.drawGridDot;
    if (drawGridDot) {
      this.drawGridChunkDynamic(context, chunk, drawGridDot);
      return;
    }

    this.drawGridChunkCached(context, chunk);
  }

  private drawGridChunkDynamic(
    context: CanvasRenderingContext2D,
    chunk: GridChunk,
    drawGridDot: NonNullable<GraphBuilderCallbacks['drawGridDot']>
  ) {
    const gridSize = this.options.gridSize;
    for (let y = 0; y < GRID_CHUNK_CELLS; y++) {
      for (let x = 0; x < GRID_CHUNK_CELLS; x++) {
        const position = vec2(
          chunk.origin.x + x * gridSize,
          chunk.origin.y + y * gridSize
        );
        drawGridDot(context, {
          position,
          gridSize,
        });
      }
    }
  }

  private drawGridChunkCached(
    context: CanvasRenderingContext2D,
    chunk: GridChunk
  ) {
    const chunkCanvasSize = this.gridChunkWorldSize() + GRID_CHUNK_PADDING * 2;

    if (
      !chunk.canvas ||
      chunk.canvas.width !== chunkCanvasSize ||
      chunk.canvas.height !== chunkCanvasSize ||
      chunk.renderRevision !== this.gridRenderRevision
    ) {
      this.renderGridChunkToCanvas(chunk, chunkCanvasSize);
    }

    if (!chunk.canvas) {
      return;
    }

    context.drawImage(
      chunk.canvas,
      chunk.origin.x - GRID_CHUNK_PADDING,
      chunk.origin.y - GRID_CHUNK_PADDING
    );
  }

  private renderGridChunkToCanvas(chunk: GridChunk, chunkCanvasSize: number) {
    const canvas = chunk.canvas ?? document.createElement('canvas');
    canvas.width = chunkCanvasSize;
    canvas.height = chunkCanvasSize;

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = this.options.theme.gridDotLineWidth;
    context.strokeStyle = this.options.theme.gridDotColor;

    const gridSize = this.options.gridSize;
    for (let y = 0; y < GRID_CHUNK_CELLS; y++) {
      for (let x = 0; x < GRID_CHUNK_CELLS; x++) {
        plus(
          context,
          vec2(
            GRID_CHUNK_PADDING + x * gridSize,
            GRID_CHUNK_PADDING + y * gridSize
          ),
          GRID_DOT_SIZE
        );
      }
    }

    chunk.canvas = canvas;
    chunk.renderRevision = this.gridRenderRevision;
  }

  private gridChunkWorldSize() {
    return this.options.gridSize * GRID_CHUNK_CELLS;
  }

  private drawNode(node: Node<TNodeData, TPortData>) {
    const state = this.ensureNodeState(node);
    const nodeTheme = this.effectiveNodeTheme(node);
    const { callbacks } = this.options;

    if (callbacks.drawNodeFrame) {
      callbacks.drawNodeFrame(this.context, {
        node,
        position: vec2(state.actualPosition),
        size: vec2(state.actualSize),
        hovered: state.hovered,
        selected: state.selected,
      });
    } else {
      this.context.save();
      this.context.strokeStyle = state.hovered
        ? nodeTheme.nodeHoveredBorderColor
        : nodeTheme.nodeBorderColor;
      this.context.fillStyle = state.selected
        ? nodeTheme.nodeSelectedFillColor
        : nodeTheme.nodeFillColor;
      this.context.lineWidth = nodeTheme.nodeBorderWidth;
      roundedRect(
        this.context,
        state.actualPosition,
        state.actualSize,
        nodeTheme.nodeBorderRadius
      );
      this.context.fill();
      roundedRect(
        this.context,
        vec2.add(state.actualPosition, 1),
        vec2.sub(state.actualSize, 2),
        nodeTheme.nodeBorderRadius
      );
      this.context.stroke();
      this.context.restore();
    }

    if (node.deletable ?? true) {
      if (callbacks.drawDeleteButton) {
        callbacks.drawDeleteButton(this.context, {
          node,
          position: vec2(state.actualPosition),
          size: vec2(state.actualSize),
          hovered: state.deleteHovered,
        });
      } else {
        this.context.save();
        this.context.strokeStyle = state.deleteHovered
          ? nodeTheme.deleteButtonHoveredColor
          : nodeTheme.deleteButtonColor;
        this.context.lineWidth =
          nodeTheme.deleteButtonLineWidth / DELETE_BUTTON_SIZE;
        this.context.translate(
          state.actualPosition.x + state.actualSize.x - DELETE_BUTTON_SIZE / 2,
          state.actualPosition.y + DELETE_BUTTON_SIZE / 2
        );
        this.context.scale(DELETE_BUTTON_SIZE, DELETE_BUTTON_SIZE);
        cross(this.context, vec2(), 0.4);
        this.context.restore();
      }
    }

    if (node.resizable ?? true) {
      if (callbacks.drawResizeHandle) {
        callbacks.drawResizeHandle(this.context, {
          node,
          position: vec2(state.actualPosition),
          size: vec2(state.actualSize),
          hovered: state.resizeHovered,
        });
      } else {
        this.context.save();
        this.context.strokeStyle = state.resizeHovered
          ? nodeTheme.resizeHandleHoveredColor
          : nodeTheme.resizeHandleColor;
        this.context.lineWidth =
          nodeTheme.resizeHandleLineWidth / RESIZE_HANDLE_SIZE;
        this.context.translate(
          state.actualPosition.x + state.actualSize.x - RESIZE_HANDLE_SIZE,
          state.actualPosition.y + state.actualSize.y - RESIZE_HANDLE_SIZE
        );
        this.context.scale(RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
        line(this.context, vec2(0, 0.8), vec2(0.8, 0));
        line(this.context, vec2(0.3, 0.8), vec2(0.8, 0.3));
        line(this.context, vec2(0.6, 0.8), vec2(0.8, 0.6));
        this.context.restore();
      }
    }

    for (const port of node.ports) {
      const portState = this.ensurePortState(node.id, port.id, port.side);
      portState.position = this.resolvePortPosition(node, port);
      this.drawPort(node, port, portState);
    }

    if (callbacks.drawNodeContent) {
      callbacks.drawNodeContent(this.context, {
        node,
        position: vec2(state.actualPosition),
        size: vec2(state.actualSize),
        hovered: state.hovered,
        selected: state.selected,
      });
    } else if (node.label) {
      this.context.save();
      this.context.fillStyle = nodeTheme.nodeLabelColor;
      this.context.font = nodeTheme.nodeLabelFont;
      this.context.textAlign = 'left';
      this.context.textBaseline = 'top';
      this.context.fillText(
        node.label,
        state.actualPosition.x + 5,
        state.actualPosition.y + 5
      );
      this.context.restore();
    }
  }

  private drawPort(
    node: Node<TNodeData, TPortData> | null,
    port: Port<TPortData> | null,
    stateOverride?: Pick<
      PortState,
      'position' | 'hovered' | 'connectable' | 'invalidReason'
    >
  ) {
    const state =
      stateOverride ??
      (() => {
        if (!node || !port) {
          throw new Error(
            'Node and port are required when no state override is provided'
          );
        }
        return this.ensurePortState(node.id, port.id, port.side);
      })();

    const direction =
      port && node
        ? this.ensurePortState(node.id, port.id, port.side).direction
        : vec2(0, -1);

    const isPreview = stateOverride !== undefined && node === null;
    const portTheme = this.effectivePortTheme(port);
    const { callbacks } = this.options;

    if (callbacks.drawPort) {
      callbacks.drawPort(this.context, {
        node,
        port,
        position: vec2(state.position),
        direction,
        hovered: state.hovered,
        connectable: state.connectable,
        invalidReason: state.invalidReason,
        isPreview,
      });
      return;
    }

    this.context.globalCompositeOperation = 'source-over';

    this.context.save();
    this.context.globalCompositeOperation = 'destination-out';
    this.context.fillStyle = 'black';
    this.context.beginPath();
    this.context.arc(
      state.position.x,
      state.position.y,
      portTheme.portCutoutRadius,
      0,
      Math.PI * 2
    );
    this.context.fill();
    this.context.restore();

    const isInvalid = !state.connectable;

    this.context.save();
    this.context.strokeStyle = isInvalid
      ? portTheme.portInvalidBorderColor
      : state.hovered
        ? portTheme.portHoveredBorderColor
        : portTheme.portBorderColor;
    this.context.fillStyle = isInvalid
      ? portTheme.portInvalidFillColor
      : state.hovered
        ? portTheme.portHoveredFillColor
        : portTheme.portFillColor;
    this.context.lineWidth = portTheme.portBorderWidth;
    this.context.beginPath();
    this.context.arc(
      state.position.x,
      state.position.y,
      portTheme.portRadius,
      0,
      Math.PI * 2
    );
    this.context.fill();
    this.context.stroke();
    this.context.restore();

    if (state.hovered) {
      this.context.save();
      this.context.strokeStyle = isInvalid
        ? portTheme.portInvalidRingColor
        : portTheme.portHoverRingColor;
      this.context.lineWidth = portTheme.portHoverRingLineWidth;
      this.context.beginPath();
      this.context.arc(
        state.position.x,
        state.position.y,
        portTheme.portHoverRingRadius,
        0,
        Math.PI * 2
      );
      this.context.stroke();
      this.context.restore();
    }

    if (this.options.showPortArrows && port !== null && !isPreview) {
      const arrowDir =
        port.type === PortType.Output ? direction : vec2.mul(direction, -1);
      const base = vec2.add(
        state.position,
        vec2.mul(arrowDir, portTheme.portArrowOffset)
      );
      this.context.save();
      this.context.fillStyle = portTheme.portArrowColor;
      triangle(this.context, base, arrowDir, portTheme.portArrowSize);
      this.context.fill();
      this.context.restore();
    }
  }

  private drawEdgePreviewPort() {
    if (!this.creatingEdge) {
      return;
    }

    this.drawPort(null, null, {
      position: vec2(this.creatingEdge.pointer),
      hovered: true,
      connectable: true,
      invalidReason: null,
    });
  }

  private drawEdgePreview() {
    if (!this.creatingEdge) {
      return;
    }

    const { from, to, fromDirection, toDirection } =
      this.creatingEdge.getDrawData();
    const sourceTheme = this.creatingEdge.theme ?? {};
    const previewTheme: EdgeTheme = {
      ...this.options.theme,
      ...sourceTheme,
      edgePreviewColor:
        sourceTheme.edgePreviewColor ??
        sourceTheme.edgeColor ??
        this.options.theme.edgePreviewColor,
      edgePreviewLineWidth:
        sourceTheme.edgePreviewLineWidth ??
        sourceTheme.edgeLineWidth ??
        this.options.theme.edgePreviewLineWidth,
      edgePreviewOutlineColor:
        sourceTheme.edgePreviewOutlineColor ??
        sourceTheme.edgeHoverOutlineColor ??
        this.options.theme.edgePreviewOutlineColor,
      edgePreviewOutlineLineWidth:
        sourceTheme.edgePreviewOutlineLineWidth ??
        sourceTheme.edgeHoverOutlineLineWidth ??
        this.options.theme.edgePreviewOutlineLineWidth,
    };
    const { callbacks } = this.options;

    if (callbacks.drawEdgePreview) {
      callbacks.drawEdgePreview(this.context, {
        from,
        to,
        fromDirection,
        toDirection,
      });
      return;
    }

    this.context.save();
    this.context.strokeStyle = previewTheme.edgePreviewColor;
    this.context.lineWidth = previewTheme.edgePreviewLineWidth;
    curveFromTo(
      this.context,
      from,
      to,
      fromDirection,
      toDirection,
      this.options.gridSize
    );
    this.context.stroke();
    this.context.restore();

    this.context.save();
    this.context.strokeStyle = previewTheme.edgePreviewOutlineColor;
    this.context.lineWidth = previewTheme.edgePreviewOutlineLineWidth;
    curveFromTo(
      this.context,
      from,
      to,
      fromDirection,
      toDirection,
      this.options.gridSize
    );
    this.context.stroke();
    this.context.restore();
  }

  private drawEdge(edge: Edge<TEdgeData>) {
    const aEndpoint = this.resolvePortEndpoint(edge.a);
    const bEndpoint = this.resolvePortEndpoint(edge.b);
    if (!aEndpoint || !bEndpoint) {
      return;
    }

    const a = vec2.add(
      aEndpoint.position,
      vec2.mul(aEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
    );
    const b = vec2.add(
      bEndpoint.position,
      vec2.mul(bEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
    );
    const hovered = this.ensureEdgeState(edge).hovered;
    const edgeTheme = this.effectiveEdgeTheme(edge);
    const { callbacks } = this.options;

    if (callbacks.drawEdge) {
      callbacks.drawEdge(this.context, {
        edge,
        from: a,
        to: b,
        fromDirection: aEndpoint.direction,
        toDirection: bEndpoint.direction,
        hovered,
      });
      return;
    }

    this.context.save();
    this.context.strokeStyle = hovered
      ? edgeTheme.edgeHoveredColor
      : edgeTheme.edgeColor;
    this.context.lineWidth = edgeTheme.edgeLineWidth;
    curveFromTo(
      this.context,
      a,
      b,
      aEndpoint.direction,
      bEndpoint.direction,
      this.options.gridSize
    );
    this.context.stroke();
    this.context.restore();

    if (hovered) {
      this.context.save();
      this.context.strokeStyle = edgeTheme.edgeHoverOutlineColor;
      this.context.lineWidth = edgeTheme.edgeHoverOutlineLineWidth;
      curveFromTo(
        this.context,
        a,
        b,
        aEndpoint.direction,
        bEndpoint.direction,
        this.options.gridSize
      );
      this.context.stroke();
      this.context.restore();
    }

    if (this.options.showEdgeArrows) {
      const { cp1, cp2, join } = getCurveGeometry(
        a,
        b,
        aEndpoint.direction,
        bEndpoint.direction,
        this.options.gridSize
      );
      const { position: arrowPos, tangent: arrowDir } = sampleBezierChain(
        a,
        cp1,
        join,
        cp2,
        b,
        edgeTheme.edgeArrowOffset
      );
      this.context.save();
      this.context.fillStyle = edgeTheme.edgeArrowColor;
      triangle(this.context, arrowPos, arrowDir, edgeTheme.edgeArrowSize);
      this.context.fill();
      this.context.restore();
    }
  }

  private drawEffects() {
    for (const state of this.edgeDashEffects.values()) {
      if (!state.config.running) {
        continue;
      }

      const edge = this.findEdgeByKey(state.edgeKey);
      if (!edge) {
        continue;
      }
      this.drawEdgeDashEffect(edge, state);
    }

    for (const state of this.edgeDotEffects.values()) {
      const edge = this.findEdgeByKey(state.edgeKey);
      if (!edge) {
        continue;
      }
      this.drawEdgeDotEffect(edge, state);
    }

    for (const state of this.portPulseEffects.values()) {
      this.drawPortPulseEffect(state);
    }
  }

  private updateEffects(dt: number) {
    if (!this.options.effects.enabled || this.effectsPaused) {
      return;
    }

    const scaledDt = dt * this.options.effects.timeScale;
    if (scaledDt <= 0) {
      return;
    }

    for (const state of this.edgeDashEffects.values()) {
      if (!state.config.running) {
        continue;
      }
      state.config.phase += state.config.speed * scaledDt;
    }

    for (const state of this.edgeDotEffects.values()) {
      if (state.config.running && state.config.loop) {
        state.spawnElapsed += scaledDt;
        const spawnInterval = Math.max(0.01, state.config.spawnInterval);
        while (state.spawnElapsed >= spawnInterval) {
          state.spawnElapsed -= spawnInterval;
          this.addEdgeDotInstance(state, state.config);
        }
      }

      for (const instance of state.instances) {
        instance.animation.update(scaledDt);
      }

      const completed = state.instances.filter(
        instance => instance.animation.finished
      );
      state.instances = state.instances.filter(
        instance => !instance.animation.finished
      );
      for (const instance of completed) {
        const edge = this.findEdgeByKey(state.edgeKey);
        if (!edge) {
          continue;
        }
        this.eventBus.emit('effectCompleted', {
          kind: 'edgeDot',
          channel: state.channel,
          target: { a: { ...edge.a }, b: { ...edge.b } },
          id: instance.id,
        });
      }
    }

    for (const state of this.portPulseEffects.values()) {
      for (const instance of state.instances) {
        instance.animation.update(scaledDt);
      }

      const completed = state.instances.filter(
        instance => instance.animation.finished
      );
      state.instances = state.instances.filter(
        instance => !instance.animation.finished
      );
      for (const instance of completed) {
        const portRef = this.portRefFromKey(state.portKey);
        if (!portRef) {
          continue;
        }
        this.eventBus.emit('effectCompleted', {
          kind: 'portPulse',
          channel: state.channel,
          target: portRef,
          id: instance.id,
        });
      }
    }
  }

  private drawEdgeDashEffect(
    edge: Edge<TEdgeData>,
    state: EdgeDashRuntimeState
  ) {
    const geometry = this.resolveEdgeGeometry(edge);
    if (!geometry) {
      return;
    }

    const { callbacks } = this.options;
    if (callbacks.drawEdgeDashEffect) {
      callbacks.drawEdgeDashEffect(this.context, {
        edge,
        channel: state.channel,
        from: vec2(geometry.from),
        to: vec2(geometry.to),
        fromDirection: vec2(geometry.fromDirection),
        toDirection: vec2(geometry.toDirection),
        phase: state.config.phase,
        config: { ...state.config },
      });
      return;
    }

    this.context.save();
    this.context.globalCompositeOperation = state.config.blendMode;
    this.context.globalAlpha = Math.max(0, Math.min(1, state.config.opacity));
    this.context.strokeStyle = state.config.color;
    this.context.lineWidth = Math.max(0.1, state.config.lineWidth);
    this.context.setLineDash(state.config.dashPattern);
    this.context.lineDashOffset = -state.config.phase;
    curveFromTo(
      this.context,
      geometry.from,
      geometry.to,
      geometry.fromDirection,
      geometry.toDirection,
      this.options.gridSize
    );
    this.context.stroke();
    this.context.restore();
  }

  private drawEdgeDotEffect(edge: Edge<TEdgeData>, state: EdgeDotRuntimeState) {
    const geometry = this.resolveEdgeGeometry(edge);
    if (!geometry) {
      return;
    }

    const { callbacks } = this.options;
    const { cp1, cp2, join } = getCurveGeometry(
      geometry.from,
      geometry.to,
      geometry.fromDirection,
      geometry.toDirection,
      this.options.gridSize
    );

    for (const instance of state.instances) {
      const progress = instance.animation.current;
      const sample = sampleBezierChain(
        geometry.from,
        cp1,
        join,
        cp2,
        geometry.to,
        progress
      );

      if (callbacks.drawEdgeDotEffect) {
        callbacks.drawEdgeDotEffect(this.context, {
          edge,
          channel: state.channel,
          id: instance.id,
          position: vec2(sample.position),
          direction: vec2(sample.tangent),
          progress,
          config: { ...state.config },
        });
        continue;
      }

      this.context.save();
      this.context.globalCompositeOperation = state.config.blendMode;
      this.context.globalAlpha = Math.max(0, Math.min(1, state.config.opacity));
      this.context.fillStyle = state.config.color;
      this.context.beginPath();
      this.context.arc(
        sample.position.x,
        sample.position.y,
        Math.max(0.1, state.config.radius),
        0,
        Math.PI * 2
      );
      this.context.fill();
      this.context.restore();
    }
  }

  private drawPortPulseEffect(state: PortPulseRuntimeState) {
    const resolved = this.resolvePortFromKey(state.portKey);
    if (!resolved) {
      return;
    }

    const { node, port } = resolved;
    const portState = this.ensurePortState(node.id, port.id, port.side);
    const { callbacks } = this.options;

    for (const instance of state.instances) {
      const config = instance.config;
      const progress = instance.animation.current;
      const radius = this.lerp(config.fromRadius, config.toRadius, progress);
      const opacity = Math.max(0, 1 - progress) * config.maxOpacity;

      if (callbacks.drawPortPulseEffect) {
        callbacks.drawPortPulseEffect(this.context, {
          node,
          port,
          channel: state.channel,
          id: instance.id,
          position: vec2(portState.position),
          progress,
          radius,
          opacity,
          config: { ...config },
        });
        continue;
      }

      this.context.save();
      this.context.globalCompositeOperation = config.blendMode;
      this.context.globalAlpha = Math.max(0, Math.min(1, opacity));
      this.context.strokeStyle = config.color;
      this.context.lineWidth = Math.max(0.1, config.lineWidth);
      this.context.beginPath();
      this.context.arc(
        portState.position.x,
        portState.position.y,
        radius,
        0,
        Math.PI * 2
      );
      this.context.stroke();
      this.context.restore();
    }
  }

  private getEdgeDashEffectConfig(
    target: EdgeEffectTarget,
    channel: GraphEffectChannel
  ): EdgeDashEffectConfig | null {
    const resolved = this.resolveEdgeTarget(target);
    if (!resolved) {
      return null;
    }

    const key = this.effectKey(resolved.edgeKey, channel);
    const existing = this.edgeDashEffects.get(key);
    return existing ? { ...existing.config } : null;
  }

  private setEdgeDashEffectConfig(
    target: EdgeEffectTarget,
    patch: Partial<EdgeDashEffectConfig>,
    channel: GraphEffectChannel
  ): boolean {
    const resolved = this.resolveEdgeTarget(target);
    if (!resolved) {
      return false;
    }

    const edgeTheme = this.effectiveEdgeTheme(resolved.edge);
    const key = this.effectKey(resolved.edgeKey, channel);
    const existing = this.edgeDashEffects.get(key);
    const config: EdgeDashEffectConfig = {
      ...this.options.effects.edgeDash,
      color: edgeTheme.edgeDashColor,
      lineWidth: edgeTheme.edgeDashLineWidth,
      ...(existing?.config ?? {}),
      ...patch,
    };

    this.edgeDashEffects.set(key, {
      edgeKey: resolved.edgeKey,
      channel,
      config,
    });

    return true;
  }

  private startEdgeDashEffect(
    target: EdgeEffectTarget,
    patch: Partial<EdgeDashEffectConfig> = {},
    channel: GraphEffectChannel
  ): boolean {
    const updated = this.setEdgeDashEffectConfig(
      target,
      { ...patch, running: true },
      channel
    );
    if (!updated) {
      return false;
    }

    this.eventBus.emit('effectStarted', {
      kind: 'edgeDash',
      channel,
      target,
    });
    return true;
  }

  private stopEdgeDashEffect(
    target: EdgeEffectTarget,
    channel: GraphEffectChannel
  ): boolean {
    const resolved = this.resolveEdgeTarget(target);
    if (!resolved) {
      return false;
    }
    const key = this.effectKey(resolved.edgeKey, channel);
    const existing = this.edgeDashEffects.get(key);
    if (!existing) {
      return false;
    }

    existing.config.running = false;
    this.eventBus.emit('effectStopped', {
      kind: 'edgeDash',
      channel,
      target: { a: { ...resolved.edge.a }, b: { ...resolved.edge.b } },
    });
    return true;
  }

  private clearEdgeDashEffects(
    target?: EdgeEffectTarget,
    channel: GraphEffectChannel = 'default'
  ) {
    if (!target) {
      for (const [key, state] of this.edgeDashEffects.entries()) {
        if (channel !== '*' && state.channel !== channel) {
          continue;
        }
        const edge = this.findEdgeByKey(state.edgeKey);
        if (edge) {
          this.eventBus.emit('effectCleared', {
            kind: 'edgeDash',
            channel: state.channel,
            target: { a: { ...edge.a }, b: { ...edge.b } },
          });
        }
        this.edgeDashEffects.delete(key);
      }
      return;
    }

    const resolved = this.resolveEdgeTarget(target);
    if (!resolved) {
      return;
    }

    const key = this.effectKey(resolved.edgeKey, channel);
    if (this.edgeDashEffects.delete(key)) {
      this.eventBus.emit('effectCleared', {
        kind: 'edgeDash',
        channel,
        target: { a: { ...resolved.edge.a }, b: { ...resolved.edge.b } },
      });
    }
  }

  private getEdgeDotEffectConfig(
    target: EdgeEffectTarget,
    channel: GraphEffectChannel
  ): EdgeDotEffectConfig | null {
    const resolved = this.resolveEdgeTarget(target);
    if (!resolved) {
      return null;
    }

    const key = this.effectKey(resolved.edgeKey, channel);
    const existing = this.edgeDotEffects.get(key);
    return existing ? { ...existing.config } : null;
  }

  private setEdgeDotEffectConfig(
    target: EdgeEffectTarget,
    patch: Partial<EdgeDotEffectConfig>,
    channel: GraphEffectChannel
  ): boolean {
    const resolved = this.resolveEdgeTarget(target);
    if (!resolved) {
      return false;
    }

    const edgeTheme = this.effectiveEdgeTheme(resolved.edge);
    const key = this.effectKey(resolved.edgeKey, channel);
    const existing = this.edgeDotEffects.get(key);
    const config: EdgeDotEffectConfig = {
      ...this.options.effects.edgeDot,
      color: edgeTheme.edgeDotColor,
      radius: edgeTheme.edgeDotRadius,
      opacity: edgeTheme.edgeDotOpacity,
      ...(existing?.config ?? {}),
      ...patch,
      animation: {
        ...this.options.effects.edgeDot.animation,
        ...(existing?.config.animation ?? {}),
        ...(patch.animation ?? {}),
      },
    };

    this.edgeDotEffects.set(key, {
      edgeKey: resolved.edgeKey,
      channel,
      config,
      spawnElapsed: existing?.spawnElapsed ?? 0,
      instances: existing?.instances ?? [],
    });

    return true;
  }

  private triggerEdgeDotEffect(
    target: EdgeEffectTarget,
    patch: Partial<EdgeDotEffectConfig> = {},
    channel: GraphEffectChannel
  ): EffectTriggerHandle | null {
    const updated = this.setEdgeDotEffectConfig(target, patch, channel);
    if (!updated) {
      return null;
    }

    const resolved = this.resolveEdgeTarget(target);
    if (!resolved) {
      return null;
    }

    const key = this.effectKey(resolved.edgeKey, channel);
    const state = this.edgeDotEffects.get(key);
    if (!state) {
      return null;
    }

    const instance = this.addEdgeDotInstance(state, state.config);
    if (!instance) {
      return null;
    }

    this.eventBus.emit('effectStarted', {
      kind: 'edgeDot',
      channel,
      target: { a: { ...resolved.edge.a }, b: { ...resolved.edge.b } },
      id: instance.id,
    });

    return {
      id: instance.id,
      stop: () => this.stopEdgeDotInstance(key, instance.id),
    };
  }

  private startEdgeDotEffect(
    target: EdgeEffectTarget,
    patch: Partial<EdgeDotEffectConfig> = {},
    channel: GraphEffectChannel
  ): boolean {
    const updated = this.setEdgeDotEffectConfig(
      target,
      { ...patch, running: true, loop: true },
      channel
    );
    if (!updated) {
      return false;
    }

    this.eventBus.emit('effectStarted', {
      kind: 'edgeDot',
      channel,
      target,
    });
    return true;
  }

  private stopEdgeDotEffect(
    target: EdgeEffectTarget,
    channel: GraphEffectChannel
  ): boolean {
    const resolved = this.resolveEdgeTarget(target);
    if (!resolved) {
      return false;
    }

    const key = this.effectKey(resolved.edgeKey, channel);
    const state = this.edgeDotEffects.get(key);
    if (!state) {
      return false;
    }

    state.config.running = false;
    state.config.loop = false;
    this.eventBus.emit('effectStopped', {
      kind: 'edgeDot',
      channel,
      target: { a: { ...resolved.edge.a }, b: { ...resolved.edge.b } },
    });
    return true;
  }

  private clearEdgeDotEffects(
    target?: EdgeEffectTarget,
    channel: GraphEffectChannel = 'default'
  ) {
    if (!target) {
      for (const [key, state] of this.edgeDotEffects.entries()) {
        if (channel !== '*' && state.channel !== channel) {
          continue;
        }
        const edge = this.findEdgeByKey(state.edgeKey);
        if (edge) {
          this.eventBus.emit('effectCleared', {
            kind: 'edgeDot',
            channel: state.channel,
            target: { a: { ...edge.a }, b: { ...edge.b } },
          });
        }
        this.edgeDotEffects.delete(key);
      }
      return;
    }

    const resolved = this.resolveEdgeTarget(target);
    if (!resolved) {
      return;
    }

    const key = this.effectKey(resolved.edgeKey, channel);
    if (this.edgeDotEffects.delete(key)) {
      this.eventBus.emit('effectCleared', {
        kind: 'edgeDot',
        channel,
        target: { a: { ...resolved.edge.a }, b: { ...resolved.edge.b } },
      });
    }
  }

  private triggerPortPulseEffect(
    target: PortRef,
    patch: Partial<PortPulseEffectConfig> = {},
    channel: GraphEffectChannel
  ): EffectTriggerHandle | null {
    const resolved = this.resolveNodeAndPort(target);
    if (!resolved) {
      return null;
    }

    const key = this.effectKey(
      this.portKey(target.nodeId, target.portId),
      channel
    );
    const config: PortPulseEffectConfig = {
      ...this.options.effects.portPulse,
      color: this.effectivePortTheme(resolved.port).portPulseColor,
      lineWidth: this.effectivePortTheme(resolved.port).portPulseLineWidth,
      fromRadius: this.effectivePortTheme(resolved.port).portPulseFromRadius,
      toRadius: this.effectivePortTheme(resolved.port).portPulseToRadius,
      maxOpacity: this.effectivePortTheme(resolved.port).portPulseMaxOpacity,
      ...patch,
      animation: {
        ...this.options.effects.portPulse.animation,
        ...(patch.animation ?? {}),
      },
    };

    const state = this.portPulseEffects.get(key) ?? {
      portKey: this.portKey(target.nodeId, target.portId),
      channel,
      instances: [],
    };

    const id = this.createId('effect-port-pulse');
    const duration = Math.max(0.01, config.duration);
    const instance: PortPulseRuntimeInstance = {
      id,
      channel,
      animation: this.createUnitAnimation(duration, config.animation),
      config,
    };
    instance.animation.start();

    if (state.instances.length >= this.options.effects.maxPortPulseInstances) {
      state.instances.shift();
    }
    state.instances.push(instance);
    this.portPulseEffects.set(key, state);

    this.eventBus.emit('effectStarted', {
      kind: 'portPulse',
      channel,
      target,
      id,
    });

    return {
      id,
      stop: () => this.stopPortPulseInstance(key, id),
    };
  }

  private clearPortPulseEffects(
    target?: PortRef,
    channel: GraphEffectChannel = 'default'
  ) {
    if (!target) {
      for (const [key, state] of this.portPulseEffects.entries()) {
        if (channel !== '*' && state.channel !== channel) {
          continue;
        }

        const portRef = this.portRefFromKey(state.portKey);
        if (portRef) {
          this.eventBus.emit('effectCleared', {
            kind: 'portPulse',
            channel: state.channel,
            target: portRef,
          });
        }

        this.portPulseEffects.delete(key);
      }
      return;
    }

    const key = this.effectKey(
      this.portKey(target.nodeId, target.portId),
      channel
    );
    if (this.portPulseEffects.delete(key)) {
      this.eventBus.emit('effectCleared', {
        kind: 'portPulse',
        channel,
        target,
      });
    }
  }

  private clearAllEffects() {
    this.clearEdgeDashEffects(undefined, '*');
    this.clearEdgeDotEffects(undefined, '*');
    this.clearPortPulseEffects(undefined, '*');
  }

  private clearEdgeEffectsForNode(nodeId: string) {
    for (const edge of this.graph.edges) {
      if (edge.a.nodeId !== nodeId && edge.b.nodeId !== nodeId) {
        continue;
      }
      this.clearEdgeDashEffects({ a: edge.a, b: edge.b });
      this.clearEdgeDotEffects({ a: edge.a, b: edge.b });
    }
  }

  private addEdgeDotInstance(
    state: EdgeDotRuntimeState,
    config: EdgeDotEffectConfig
  ): EdgeDotRuntimeInstance | null {
    if (state.instances.length >= this.options.effects.maxEdgeDotInstances) {
      state.instances.shift();
    }

    const id = this.createId('effect-edge-dot');
    const duration = Math.max(0.01, config.duration);
    const instance: EdgeDotRuntimeInstance = {
      id,
      channel: state.channel,
      animation: this.createUnitAnimation(duration, config.animation),
    };
    instance.animation.start();

    state.instances.push(instance);
    return instance;
  }

  private stopEdgeDotInstance(effectKey: string, id: string): boolean {
    const state = this.edgeDotEffects.get(effectKey);
    if (!state) {
      return false;
    }

    const previousLength = state.instances.length;
    state.instances = state.instances.filter(instance => instance.id !== id);
    if (state.instances.length === previousLength) {
      return false;
    }

    const edge = this.findEdgeByKey(state.edgeKey);
    if (edge) {
      this.eventBus.emit('effectStopped', {
        kind: 'edgeDot',
        channel: state.channel,
        target: { a: { ...edge.a }, b: { ...edge.b } },
        id,
      });
    }

    return true;
  }

  private stopPortPulseInstance(effectKey: string, id: string): boolean {
    const state = this.portPulseEffects.get(effectKey);
    if (!state) {
      return false;
    }

    const previousLength = state.instances.length;
    state.instances = state.instances.filter(instance => instance.id !== id);
    if (state.instances.length === previousLength) {
      return false;
    }

    const target = this.portRefFromKey(state.portKey);
    if (target) {
      this.eventBus.emit('effectStopped', {
        kind: 'portPulse',
        channel: state.channel,
        target,
        id,
      });
    }

    return true;
  }

  private resolveEdgeTarget(target: EdgeEffectTarget) {
    const edge = this.findEdge(target.a, target.b);
    if (!edge) {
      return null;
    }

    return {
      edge,
      edgeKey: this.edgeKey(edge),
    };
  }

  private resolveEdgeGeometry(edge: Edge<TEdgeData>) {
    const aEndpoint = this.resolvePortEndpoint(edge.a);
    const bEndpoint = this.resolvePortEndpoint(edge.b);
    if (!aEndpoint || !bEndpoint) {
      return null;
    }

    return {
      from: vec2.add(
        aEndpoint.position,
        vec2.mul(aEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
      ),
      to: vec2.add(
        bEndpoint.position,
        vec2.mul(bEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
      ),
      fromDirection: aEndpoint.direction,
      toDirection: bEndpoint.direction,
    };
  }

  private findEdgeByKey(edgeKey: string): Edge<TEdgeData> | null {
    return (
      this.graph.edges.find(edge => this.edgeKey(edge) === edgeKey) ?? null
    );
  }

  private resolvePortFromKey(portKey: string) {
    const target = this.portRefFromKey(portKey);
    if (!target) {
      return null;
    }
    const resolved = this.resolveNodeAndPort(target);
    if (!resolved) {
      return null;
    }

    return {
      ...resolved,
      target,
    };
  }

  private effectKey(baseKey: string, channel: GraphEffectChannel) {
    return `${baseKey}::${channel}`;
  }

  private portRefFromKey(portKey: string): PortRef | null {
    const split = portKey.indexOf(':');
    if (split === -1) {
      return null;
    }

    return {
      nodeId: portKey.slice(0, split),
      portId: portKey.slice(split + 1),
    };
  }

  private lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  private createUnitAnimation(
    duration: number,
    options:
      | EdgeDotEffectConfig['animation']
      | PortPulseEffectConfig['animation']
  ) {
    return new Animation<number>({
      initialValue: 0,
      targetValue: 1,
      mode: AnimationMode.Trigger,
      repeat: RepeatMode.Once,
      duration,
      ...options,
    });
  }

  private selectNode(nodeId: string | null) {
    this.selectedNodeId = nodeId;
    for (const node of this.graph.nodes) {
      const state = this.ensureNodeState(node);
      state.selected = node.id === nodeId;
    }

    if (nodeId !== null) {
      const index = this.graph.nodes.findIndex(node => node.id === nodeId);
      if (index !== -1) {
        const node = this.graph.nodes[index];
        this.graph.nodes.splice(index, 1);
        this.graph.nodes.push(node);
      }
    }

    this.eventBus.emit('nodeSelected', { nodeId });
  }

  private findIncomingEdgeForPort(portRef: PortRef): Edge<TEdgeData> | null {
    return (
      this.graph.edges.find(edge => this.portRefEq(edge.b, portRef)) ?? null
    );
  }

  private findEdge(a: PortRef, b: PortRef): Edge<TEdgeData> | null {
    return (
      this.graph.edges.find(
        edge =>
          (this.portRefEq(edge.a, a) && this.portRefEq(edge.b, b)) ||
          (this.portRefEq(edge.a, b) && this.portRefEq(edge.b, a))
      ) ?? null
    );
  }

  private edgeExists(a: PortRef, b: PortRef) {
    return this.findEdge(a, b) !== null;
  }

  private normalizeEdgeEndpoints(
    a: PortRef,
    b: PortRef,
    data?: TEdgeData
  ): Edge<TEdgeData> | null {
    const aEndpoint = this.resolvePortEndpoint(a);
    const bEndpoint = this.resolvePortEndpoint(b);
    if (!aEndpoint || !bEndpoint) {
      return null;
    }
    if (aEndpoint.type === bEndpoint.type) {
      return null;
    }

    if (aEndpoint.type === PortType.Output) {
      return { a: { ...a }, b: { ...b }, data };
    }
    return { a: { ...b }, b: { ...a }, data };
  }

  private resolvePortEndpoint(portRef: PortRef): EdgeToolEndpoint | null {
    const node = this.graph.nodes.find(n => n.id === portRef.nodeId);
    if (!node) {
      return null;
    }

    const port = node.ports.find(p => p.id === portRef.portId);
    if (!port) {
      return null;
    }

    const state = this.ensurePortState(node.id, port.id, port.side);
    return {
      nodeId: node.id,
      portId: port.id,
      type: port.type,
      side: port.side,
      position: state.position,
      direction: state.direction,
    };
  }

  private resolveNodeAndPort(portRef: PortRef) {
    const node = this.graph.nodes.find(n => n.id === portRef.nodeId);
    if (!node) {
      return null;
    }

    const port = node.ports.find(p => p.id === portRef.portId);
    if (!port) {
      return null;
    }

    return { node, port };
  }

  private resolvePortPosition(
    node: Node<TNodeData, TPortData>,
    port: Port<TPortData>
  ): vec2 {
    const nodePortsSameSide = node.ports.filter(p => p.side === port.side);
    const index = nodePortsSameSide.findIndex(p => p.id === port.id);
    const state = this.ensureNodeState(node);

    switch (port.side) {
      case PortSide.Top:
        return vec2.add(
          state.actualPosition,
          vec2(
            ((index + 1) / (nodePortsSameSide.length + 1)) * state.actualSize.x,
            0
          )
        );
      case PortSide.Right:
        return vec2.add(
          state.actualPosition,
          vec2(
            state.actualSize.x,
            ((index + 1) / (nodePortsSameSide.length + 1)) * state.actualSize.y
          )
        );
      case PortSide.Bottom:
        return vec2.add(
          state.actualPosition,
          vec2(
            ((index + 1) / (nodePortsSameSide.length + 1)) * state.actualSize.x,
            state.actualSize.y
          )
        );
      case PortSide.Left:
      default:
        return vec2.add(
          state.actualPosition,
          vec2(
            0,
            ((index + 1) / (nodePortsSameSide.length + 1)) * state.actualSize.y
          )
        );
    }
  }

  private directionFromSide(side: PortSide): vec2 {
    return (
      {
        [PortSide.Top]: vec2(0, -1),
        [PortSide.Right]: vec2(1, 0),
        [PortSide.Bottom]: vec2(0, 1),
        [PortSide.Left]: vec2(-1, 0),
      } as const
    )[side];
  }

  private ensureNodeState(node: Node<TNodeData, TPortData>): NodeState {
    const existing = this.nodeState.get(node.id);
    if (existing) {
      return existing;
    }

    const state: NodeState = {
      hovered: false,
      selected: false,
      dragging: false,
      resizing: false,
      resizeHovered: false,
      deleteHovered: false,
      dragOffset: vec2(),
      resizeOffset: vec2(),
      actualPosition: vec2(node.position),
      actualSize: vec2(node.size),
    };

    this.nodeState.set(node.id, state);
    return state;
  }

  private ensureEdgeState(edge: Edge<TEdgeData>): EdgeState {
    const key = this.edgeKey(edge);
    const existing = this.edgeState.get(key);
    if (existing) {
      return existing;
    }

    const state: EdgeState = {
      hovered: false,
    };
    this.edgeState.set(key, state);
    return state;
  }

  private ensurePortState(
    nodeId: string,
    portId: string,
    side: PortSide
  ): PortState {
    const key = this.portKey(nodeId, portId);
    const existing = this.portState.get(key);
    if (existing) {
      return existing;
    }

    const state: PortState = {
      position: vec2(),
      direction: this.directionFromSide(side),
      hovered: false,
      connectable: true,
      invalidReason: null,
    };
    this.portState.set(key, state);
    return state;
  }

  private cloneGraph(
    graph: Graph<TNodeData, TEdgeData, TPortData>
  ): Graph<TNodeData, TEdgeData, TPortData> {
    return {
      nodes: graph.nodes.map(node => ({
        ...node,
        position: vec2(node.position),
        size: vec2(node.size),
        ports: node.ports.map(port => ({ ...port })),
      })),
      edges: graph.edges.map(edge => ({
        ...edge,
        a: { ...edge.a },
        b: { ...edge.b },
      })),
    };
  }

  private portRefEq(a: PortRef, b: PortRef) {
    return a.nodeId === b.nodeId && a.portId === b.portId;
  }

  private edgeKey(edge: Edge<TEdgeData>) {
    return `${edge.a.nodeId}:${edge.a.portId}->${edge.b.nodeId}:${edge.b.portId}`;
  }

  private portKey(nodeId: string, portId: string) {
    return `${nodeId}:${portId}`;
  }

  private effectiveNodeTheme(node: Node<TNodeData, TPortData>): NodeTheme {
    return { ...this.options.theme, ...node.theme };
  }

  private effectivePortTheme(port: Port<TPortData> | null): PortTheme {
    return { ...this.options.theme, ...(port?.theme ?? {}) };
  }

  private effectiveEdgeTheme(edge: Edge<TEdgeData>): EdgeTheme {
    return { ...this.options.theme, ...edge.theme };
  }

  private createId(prefix: string) {
    if (
      typeof globalThis.crypto !== 'undefined' &&
      globalThis.crypto.randomUUID
    ) {
      return globalThis.crypto.randomUUID();
    }
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  }
}
