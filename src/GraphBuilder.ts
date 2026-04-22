import Camera, { type CameraOptions } from '@basementuniverse/camera';
import FrameTimer from '@basementuniverse/frame-timer';
import InputManager from '@basementuniverse/input-manager';
import { vec2 } from '@basementuniverse/vec';
import {
  CAMERA_KEYBOARD_PAN_SPEED,
  CAMERA_ZOOM_STEP,
  DEFAULT_NODE_SIZE,
  DEFAULT_THEME,
  DELETE_BUTTON_SIZE,
  EDGE_CURVE_ENDPOINT_OFFSET,
  EDGE_CURVE_SAMPLE_DISTANCE,
  EDGE_HOVER_THRESHOLD,
  FPS_MIN,
  GRID_SIZE,
  NODE_EASE_AMOUNT,
  NODE_MAX_SIZE,
  NODE_MIN_SIZE,
  PORT_CONNECT_DISTANCE,
  PORT_HOVER_DISTANCE,
  RESIZE_HANDLE_SIZE,
} from './constants';
import EdgeTool from './EdgeTool';
import { PortSide, PortType, ToolMode } from './enums';
import EventBus from './events/EventBus';
import type { GraphBuilderEventMap } from './events/EventTypes';
import { layoutForceDirected, layoutLayered } from './layout';
import type {
  Edge,
  EdgeConnectionValidationResult,
  EdgeState,
  EdgeToolEndpoint,
  Graph,
  GraphBuilderCallbacks,
  GraphBuilderCapabilities,
  GraphBuilderOptions,
  GraphBuilderTheme,
  GraphDocument,
  GraphDomain,
  Node,
  NodeState,
  NodeTemplate,
  Port,
  PortRef,
  PortState,
} from './types';
import { GRAPH_SERIALIZATION_VERSION } from './types/SerializationFormats';
import type { TraversalDirection, VisitorControl } from './utils';
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
  topologicalSort,
  traverseBFS,
  traverseDFS,
} from './utils';

const DEFAULT_CAPABILITIES: Required<GraphBuilderCapabilities> = {
  createNodes: true,
  createEdges: true,
  deleteNodes: true,
  deleteEdges: true,
  resizeNodes: true,
  moveNodes: true,
};

type RequiredGraphBuilderOptions<TNodeData, TEdgeData, TPortData> = {
  gridSize: number;
  snapToGrid: boolean;
  showGrid: boolean;
  autoStart: boolean;
  canConnectPorts?: GraphBuilderOptions<
    TNodeData,
    TEdgeData,
    TPortData
  >['canConnectPorts'];
  camera: Partial<CameraOptions>;
  theme: GraphBuilderTheme;
  callbacks: GraphBuilderCallbacks;
  capabilities: Required<GraphBuilderCapabilities>;
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

  private options: RequiredGraphBuilderOptions<TNodeData, TEdgeData, TPortData>;

  private graph: Graph<TNodeData, TEdgeData, TPortData> = {
    nodes: [],
    edges: [],
  };

  private nodeState: Map<string, NodeState> = new Map();
  private edgeState: Map<string, EdgeState> = new Map();
  private portState: Map<string, PortState> = new Map();

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
      autoStart: options.autoStart ?? true,
      canConnectPorts: options.canConnectPorts,
      camera: options.camera ?? {},
      theme: { ...DEFAULT_THEME, ...options.theme },
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
    handler: (
      payload: GraphBuilderEventMap<TNodeData, TEdgeData, TPortData>[E]
    ) => void
  ) {
    return this.eventBus.on(event, handler);
  }

  public off<
    E extends keyof GraphBuilderEventMap<TNodeData, TEdgeData, TPortData>,
  >(
    event: E,
    handler: (
      payload: GraphBuilderEventMap<TNodeData, TEdgeData, TPortData>[E]
    ) => void
  ) {
    this.eventBus.off(event, handler);
  }

  public once<
    E extends keyof GraphBuilderEventMap<TNodeData, TEdgeData, TPortData>,
  >(
    event: E,
    handler: (
      payload: GraphBuilderEventMap<TNodeData, TEdgeData, TPortData>[E]
    ) => void
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
    this.options.gridSize = Math.max(1, size);
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

  public loadFromDomain(domain: GraphDomain<TNodeData, TEdgeData>) {
    if (domain.type !== 'graph-domain') {
      throw new Error('Invalid graph domain type');
    }

    const nodes: Node<TNodeData, TPortData>[] = domain.nodes.map(node => ({
      id: node.id,
      data: node.data,
      label: undefined,
      position: vec2(),
      size: vec2(DEFAULT_NODE_SIZE),
      ports: [],
      resizable: true,
      deletable: true,
    }));

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

    this.eventBus.emit('nodeCreating', {
      position: vec2(position),
      template: {
        ...source,
        size: vec2(source.size),
        ports: source.ports.map(port => ({ ...port })),
      },
    });

    const node: Node<TNodeData, TPortData> = {
      id: this.createId('node'),
      position: vec2(position),
      size: vec2(source.size ?? DEFAULT_NODE_SIZE),
      label: source.label,
      ports: source.ports.map(port => ({ ...port })),
      resizable: source.resizable ?? true,
      deletable: source.deletable ?? true,
      data: source.data,
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

    this.eventBus.emit('nodeRemoving', {
      nodeId,
      node: {
        ...node,
        position: vec2(node.position),
        size: vec2(node.size),
        ports: node.ports.map(port => ({ ...port })),
      },
    });

    this.graph.edges = this.graph.edges.filter(
      edge => edge.a.nodeId !== nodeId && edge.b.nodeId !== nodeId
    );
    this.graph.nodes = this.graph.nodes.filter(n => n.id !== nodeId);

    this.nodeState.delete(nodeId);
    for (const port of node.ports) {
      this.portState.delete(this.portKey(nodeId, port.id));
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

  public createEdge(a: PortRef, b: PortRef, data?: TEdgeData): boolean {
    if (!this.options.capabilities.createEdges) {
      return false;
    }

    const normalized = this.normalizeEdgeEndpoints(a, b, data);
    if (!normalized) {
      return false;
    }

    this.eventBus.emit('edgeCreating', {
      edge: {
        ...normalized,
        a: { ...normalized.a },
        b: { ...normalized.b },
      },
    });

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

    this.eventBus.emit('edgeRemoving', {
      edge: {
        ...existing,
        a: { ...existing.a },
        b: { ...existing.b },
      },
    });

    this.graph.edges = this.graph.edges.filter(
      edge =>
        !(
          this.portRefEq(edge.a, existing.a) &&
          this.portRefEq(edge.b, existing.b)
        )
    );
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

  public getNeighbors(nodeId: string, direction: TraversalDirection = 'both') {
    return getNeighbors(this.graph, nodeId, direction);
  }

  public traverseBFS<TResult = void>(
    startNodeId: string,
    visitor: (
      node: Node<TNodeData, TPortData>,
      depth: number
    ) => TResult | VisitorControl,
    direction: TraversalDirection = 'both'
  ) {
    return traverseBFS(this.graph, startNodeId, visitor, direction);
  }

  public traverseDFS<TResult = void>(
    startNodeId: string,
    visitor: (
      node: Node<TNodeData, TPortData>,
      depth: number
    ) => TResult | VisitorControl,
    direction: TraversalDirection = 'both'
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
    if (this.creatingEdge) {
      this.drawEdgePreviewPort();
      this.drawEdgePreview();
    }

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

    InputManager.update();
  }

  private loop() {
    this.frameTimer.update();
    this.update(this.frameTimer.elapsedTime);
    this.draw();

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

    const radius =
      this.tool === ToolMode.CreateEdge
        ? PORT_CONNECT_DISTANCE
        : PORT_HOVER_DISTANCE;
    const reversedNodes = [...this.graph.nodes].reverse();
    for (const node of reversedNodes) {
      for (const port of node.ports) {
        const state = this.ensurePortState(node.id, port.id, port.side);
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
    this.creatingEdge = new EdgeTool(endpoint);
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
          { nodeId: hovered.nodeId, portId: hovered.portId }
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
    if (a.nodeId === b.nodeId) {
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
    const bounds = this.camera.bounds;
    let { left: l, top: t, right: r, bottom: b } = bounds;
    [l, t, r, b] = [l, t, r, b].map(
      v => Math.floor(v / this.options.gridSize) * this.options.gridSize
    );

    const { theme, callbacks } = this.options;

    this.context.save();
    this.context.lineWidth = theme.gridDotLineWidth;
    this.context.strokeStyle = theme.gridDotColor;
    for (
      let y = t - this.options.gridSize;
      y < b + this.options.gridSize;
      y += this.options.gridSize
    ) {
      for (
        let x = l - this.options.gridSize;
        x < r + this.options.gridSize;
        x += this.options.gridSize
      ) {
        const position = vec2(x, y);
        if (callbacks.drawGridDot) {
          callbacks.drawGridDot(this.context, {
            position,
            gridSize: this.options.gridSize,
          });
        } else {
          plus(this.context, position, 8);
        }
      }
    }
    this.context.restore();
  }

  private drawNode(node: Node<TNodeData, TPortData>) {
    const state = this.ensureNodeState(node);
    const { theme, callbacks } = this.options;

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
        ? theme.nodeHoveredBorderColor
        : theme.nodeBorderColor;
      this.context.fillStyle = state.selected
        ? theme.nodeSelectedFillColor
        : theme.nodeFillColor;
      this.context.lineWidth = theme.nodeBorderWidth;
      roundedRect(
        this.context,
        state.actualPosition,
        state.actualSize,
        theme.nodeBorderRadius
      );
      this.context.fill();
      roundedRect(
        this.context,
        vec2.add(state.actualPosition, 1),
        vec2.sub(state.actualSize, 2),
        theme.nodeBorderRadius
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
          ? theme.deleteButtonHoveredColor
          : theme.deleteButtonColor;
        this.context.lineWidth =
          theme.deleteButtonLineWidth / DELETE_BUTTON_SIZE;
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
          ? theme.resizeHandleHoveredColor
          : theme.resizeHandleColor;
        this.context.lineWidth =
          theme.resizeHandleLineWidth / RESIZE_HANDLE_SIZE;
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
      this.context.fillStyle = theme.nodeLabelColor;
      this.context.font = theme.nodeLabelFont;
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
    const { theme, callbacks } = this.options;

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
      theme.portCutoutRadius,
      0,
      Math.PI * 2
    );
    this.context.fill();
    this.context.restore();

    const isInvalid = !state.connectable;

    this.context.save();
    this.context.strokeStyle = isInvalid
      ? theme.portInvalidBorderColor
      : state.hovered
        ? theme.portHoveredBorderColor
        : theme.portBorderColor;
    this.context.fillStyle = isInvalid
      ? theme.portInvalidFillColor
      : state.hovered
        ? theme.portHoveredFillColor
        : theme.portFillColor;
    this.context.lineWidth = theme.portBorderWidth;
    this.context.beginPath();
    this.context.arc(
      state.position.x,
      state.position.y,
      theme.portRadius,
      0,
      Math.PI * 2
    );
    this.context.fill();
    this.context.stroke();
    this.context.restore();

    if (state.hovered) {
      this.context.save();
      this.context.strokeStyle = isInvalid
        ? theme.portInvalidRingColor
        : theme.portHoverRingColor;
      this.context.lineWidth = theme.portHoverRingLineWidth;
      this.context.beginPath();
      this.context.arc(
        state.position.x,
        state.position.y,
        theme.portHoverRingRadius,
        0,
        Math.PI * 2
      );
      this.context.stroke();
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
    const { theme, callbacks } = this.options;

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
    this.context.strokeStyle = theme.edgePreviewColor;
    this.context.lineWidth = theme.edgePreviewLineWidth;
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
    this.context.strokeStyle = theme.edgePreviewOutlineColor;
    this.context.lineWidth = theme.edgePreviewOutlineLineWidth;
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
    const { theme, callbacks } = this.options;

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
      ? theme.edgeHoveredColor
      : theme.edgeColor;
    this.context.lineWidth = theme.edgeLineWidth;
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
      this.context.strokeStyle = theme.edgeHoverOutlineColor;
      this.context.lineWidth = theme.edgeHoverOutlineLineWidth;
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
