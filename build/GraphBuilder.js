"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const animation_1 = require("@basementuniverse/animation");
const camera_1 = __importDefault(require("@basementuniverse/camera"));
const debug_1 = __importDefault(require("@basementuniverse/debug"));
const frame_timer_1 = __importDefault(require("@basementuniverse/frame-timer"));
const input_manager_1 = __importDefault(require("@basementuniverse/input-manager"));
const vec_1 = require("@basementuniverse/vec");
const view_port_1 = require("@basementuniverse/view-port");
const constants_1 = require("./constants");
const EdgeTool_1 = __importDefault(require("./EdgeTool"));
const enums_1 = require("./enums");
const EventBus_1 = __importDefault(require("./events/EventBus"));
const layout_1 = require("./layout");
const utils_1 = require("./utils");
const GRID_CHUNK_CELLS = 16;
const GRID_DOT_SIZE = 8;
const GRID_CHUNK_PADDING = GRID_DOT_SIZE;
class GraphBuilder {
    constructor(canvas, options = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        this.frameHandle = 0;
        this.running = false;
        this.gridViewPort = null;
        this.gridRenderRevision = 0;
        this.gridRenderConfig = null;
        this.graph = {
            nodes: [],
            edges: [],
        };
        this.nodeState = new Map();
        this.edgeState = new Map();
        this.portState = new Map();
        this.edgeDashEffects = new Map();
        this.edgeDotEffects = new Map();
        this.portPulseEffects = new Map();
        this.effectsPaused = false;
        this.eventBus = new EventBus_1.default();
        this.tool = enums_1.ToolMode.Select;
        this.previousTool = null;
        this.createNodeTemplate = null;
        this.hoveredNodeId = null;
        this.hoveredEdgeId = null;
        this.hoveredPort = null;
        this.selectedNodeId = null;
        this.draggingNodeId = null;
        this.resizingNodeId = null;
        this.creatingEdge = null;
        this.panOffset = null;
        this.effects = {
            edgeDash: {
                get: (target, channel = 'default') => this.getEdgeDashEffectConfig(target, channel),
                set: (target, patch, channel = 'default') => this.setEdgeDashEffectConfig(target, patch, channel),
                start: (target, patch, channel = 'default') => this.startEdgeDashEffect(target, patch, channel),
                stop: (target, channel = 'default') => this.stopEdgeDashEffect(target, channel),
                clear: (target, channel = 'default') => this.clearEdgeDashEffects(target, channel),
            },
            edgeDot: {
                get: (target, channel = 'default') => this.getEdgeDotEffectConfig(target, channel),
                set: (target, patch, channel = 'default') => this.setEdgeDotEffectConfig(target, patch, channel),
                trigger: (target, patch, channel = 'default') => this.triggerEdgeDotEffect(target, patch, channel),
                start: (target, patch, channel = 'default') => this.startEdgeDotEffect(target, patch, channel),
                stop: (target, channel = 'default') => this.stopEdgeDotEffect(target, channel),
                clear: (target, channel = 'default') => this.clearEdgeDotEffects(target, channel),
            },
            portPulse: {
                trigger: (target, patch, channel = 'default') => this.triggerPortPulseEffect(target, patch, channel),
                clear: (target, channel = 'default') => this.clearPortPulseEffects(target, channel),
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
        if (canvas === null) {
            throw new Error('Canvas element not found');
        }
        if (canvas.tagName.toLowerCase() !== 'canvas') {
            throw new Error('Element is not a canvas');
        }
        this.canvas = canvas;
        const context = this.canvas.getContext('2d');
        if (context === null) {
            throw new Error('Could not get 2D context from canvas');
        }
        this.context = context;
        this.options = {
            gridSize: Math.max(1, (_a = options.gridSize) !== null && _a !== void 0 ? _a : constants_1.GRID_SIZE),
            snapToGrid: (_b = options.snapToGrid) !== null && _b !== void 0 ? _b : false,
            showGrid: (_c = options.showGrid) !== null && _c !== void 0 ? _c : true,
            showPortArrows: (_d = options.showPortArrows) !== null && _d !== void 0 ? _d : false,
            showEdgeArrows: (_e = options.showEdgeArrows) !== null && _e !== void 0 ? _e : false,
            autoStart: (_f = options.autoStart) !== null && _f !== void 0 ? _f : true,
            allowSelfConnection: (_g = options.allowSelfConnection) !== null && _g !== void 0 ? _g : false,
            canConnectPorts: options.canConnectPorts,
            resolveEdgeTheme: options.resolveEdgeTheme,
            camera: (_h = options.camera) !== null && _h !== void 0 ? _h : {},
            theme: { ...constants_1.DEFAULT_THEME, ...options.theme },
            effects: {
                ...constants_1.DEFAULT_EFFECTS,
                ...options.effects,
                edgeDash: {
                    ...constants_1.DEFAULT_EFFECTS.edgeDash,
                    ...(_j = options.effects) === null || _j === void 0 ? void 0 : _j.edgeDash,
                },
                edgeDot: {
                    ...constants_1.DEFAULT_EFFECTS.edgeDot,
                    ...(_k = options.effects) === null || _k === void 0 ? void 0 : _k.edgeDot,
                    animation: {
                        ...constants_1.DEFAULT_EFFECTS.edgeDot.animation,
                        ...(_m = (_l = options.effects) === null || _l === void 0 ? void 0 : _l.edgeDot) === null || _m === void 0 ? void 0 : _m.animation,
                    },
                },
                portPulse: {
                    ...constants_1.DEFAULT_EFFECTS.portPulse,
                    ...(_o = options.effects) === null || _o === void 0 ? void 0 : _o.portPulse,
                    animation: {
                        ...constants_1.DEFAULT_EFFECTS.portPulse.animation,
                        ...(_q = (_p = options.effects) === null || _p === void 0 ? void 0 : _p.portPulse) === null || _q === void 0 ? void 0 : _q.animation,
                    },
                },
            },
            callbacks: (_r = options.callbacks) !== null && _r !== void 0 ? _r : {},
            capabilities: { ...constants_1.DEFAULT_CAPABILITIES, ...options.capabilities },
        };
        this.canvas.style.backgroundColor = this.options.theme.backgroundColor;
        this.camera = new camera_1.default((0, vec_1.vec2)(), {
            moveEaseAmount: 0.9,
            scaleEaseAmount: 0.9,
            minScale: 0.5,
            maxScale: 5,
            ...this.options.camera,
        });
        this.frameTimer = new frame_timer_1.default({ minFPS: constants_1.FPS_MIN });
        debug_1.default.initialise();
        if (!GraphBuilder.inputInitialised) {
            input_manager_1.default.initialise({
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
    on(event, handler) {
        return this.eventBus.on(event, handler);
    }
    off(event, handler) {
        this.eventBus.off(event, handler);
    }
    once(event, handler) {
        return this.eventBus.once(event, handler);
    }
    start() {
        if (this.running) {
            return;
        }
        this.running = true;
        this.loop();
    }
    stop() {
        this.running = false;
        if (this.frameHandle !== 0) {
            window.cancelAnimationFrame(this.frameHandle);
            this.frameHandle = 0;
        }
    }
    dispose() {
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
    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }
    getTool() {
        return this.tool;
    }
    setCapabilities(capabilities) {
        this.options.capabilities = {
            ...this.options.capabilities,
            ...capabilities,
        };
    }
    setTool(tool, remember = false) {
        const previousTool = this.tool;
        if (remember) {
            this.previousTool = this.tool;
        }
        this.tool = tool;
        if (previousTool !== tool) {
            this.eventBus.emit('toolChanged', { from: previousTool, to: tool });
        }
    }
    resetTool() {
        if (this.previousTool !== null) {
            this.setTool(this.previousTool);
            this.previousTool = null;
        }
    }
    setCreateNodeTemplate(template) {
        this.createNodeTemplate = template;
    }
    setSnapToGrid(enabled) {
        this.options.snapToGrid = enabled;
    }
    setGridSize(size) {
        const next = Math.max(1, size);
        if (this.options.gridSize === next) {
            return;
        }
        this.options.gridSize = next;
        this.resetGridViewPort();
    }
    getCameraPosition() {
        return (0, vec_1.vec2)(this.camera.position);
    }
    setCameraPosition(position) {
        this.camera.positionImmediate = (0, vec_1.vec2)(position);
    }
    panCamera(offset) {
        this.camera.positionImmediate = vec_1.vec2.add(this.camera.position, offset);
    }
    getCameraZoom() {
        return this.camera.scale;
    }
    setCameraZoom(zoom) {
        if (!Number.isFinite(zoom)) {
            throw new Error('Camera zoom must be a finite number');
        }
        this.camera.scale = zoom;
    }
    zoomCamera(delta) {
        if (!Number.isFinite(delta)) {
            throw new Error('Camera zoom delta must be a finite number');
        }
        this.camera.scale += delta;
    }
    getGraph() {
        return this.serialize();
    }
    serialize() {
        return {
            nodes: this.graph.nodes.map(node => ({
                ...node,
                position: (0, vec_1.vec2)(node.position),
                size: (0, vec_1.vec2)(node.size),
                ports: node.ports.map(port => ({ ...port })),
            })),
            edges: this.graph.edges.map(edge => ({
                ...edge,
                a: { ...edge.a },
                b: { ...edge.b },
            })),
        };
    }
    serializeFull() {
        return {
            version: constants_1.GRAPH_SERIALIZATION_VERSION,
            type: 'graph-document',
            graph: this.serialize(),
            layout: {
                cameraPosition: (0, vec_1.vec2)(this.camera.position),
                cameraScale: this.camera.scale,
                selectedNodeId: this.selectedNodeId,
            },
        };
    }
    serializeRaw() {
        return {
            version: constants_1.GRAPH_SERIALIZATION_VERSION,
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
    load(graph) {
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
    loadFromDocument(document) {
        if (document.type !== 'graph-document') {
            throw new Error('Invalid graph document type');
        }
        this.load(document.graph);
        if (document.layout) {
            this.camera.positionImmediate = (0, vec_1.vec2)(document.layout.cameraPosition);
            this.camera.scale = document.layout.cameraScale;
            this.selectNode(document.layout.selectedNodeId);
        }
    }
    loadFromDomain(domain, options = {}) {
        if (domain.type !== 'graph-domain') {
            throw new Error('Invalid graph domain type');
        }
        const nodes = domain.nodes.map(domainNode => {
            var _a, _b, _c, _d, _e, _f;
            const resolved = (_a = options.resolveNode) === null || _a === void 0 ? void 0 : _a.call(options, domainNode);
            return {
                id: domainNode.id,
                data: domainNode.data,
                label: resolved === null || resolved === void 0 ? void 0 : resolved.label,
                position: (0, vec_1.vec2)(),
                size: (0, vec_1.vec2)((_b = resolved === null || resolved === void 0 ? void 0 : resolved.size) !== null && _b !== void 0 ? _b : constants_1.DEFAULT_NODE_SIZE),
                ports: (_d = (_c = resolved === null || resolved === void 0 ? void 0 : resolved.ports) === null || _c === void 0 ? void 0 : _c.map(port => ({ ...port }))) !== null && _d !== void 0 ? _d : [],
                resizable: (_e = resolved === null || resolved === void 0 ? void 0 : resolved.resizable) !== null && _e !== void 0 ? _e : true,
                deletable: (_f = resolved === null || resolved === void 0 ? void 0 : resolved.deletable) !== null && _f !== void 0 ? _f : true,
            };
        });
        const edges = domain.edges.map(edge => ({
            a: { ...edge.a },
            b: { ...edge.b },
            data: edge.data,
        }));
        this.load({ nodes, edges });
    }
    createNode(position, template) {
        var _a, _b, _c;
        if (!this.options.capabilities.createNodes) {
            throw new Error('Node creation is disabled by capabilities');
        }
        const source = template !== null && template !== void 0 ? template : this.createNodeTemplate;
        if (!source) {
            throw new Error('No node template has been configured');
        }
        const nodeCreatingPayload = {
            position: (0, vec_1.vec2)(position),
            template: {
                ...source,
                size: (0, vec_1.vec2)(source.size),
                ports: source.ports.map(port => ({ ...port })),
            },
        };
        const nodeCreating = this.eventBus.emitCancellable('nodeCreating', nodeCreatingPayload);
        if (nodeCreating.cancelled) {
            throw new Error('Node creation was cancelled by an event handler');
        }
        const node = {
            id: this.createId('node'),
            position: (0, vec_1.vec2)(position),
            size: (0, vec_1.vec2)((_a = source.size) !== null && _a !== void 0 ? _a : constants_1.DEFAULT_NODE_SIZE),
            label: source.label,
            ports: source.ports.map(port => ({ ...port })),
            resizable: (_b = source.resizable) !== null && _b !== void 0 ? _b : true,
            deletable: (_c = source.deletable) !== null && _c !== void 0 ? _c : true,
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
    addNode(node) {
        if (this.graph.nodes.some(n => n.id === node.id)) {
            return false;
        }
        const clonedNode = {
            ...node,
            position: (0, vec_1.vec2)(node.position),
            size: (0, vec_1.vec2)(node.size),
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
    removeNode(nodeId) {
        if (!this.options.capabilities.deleteNodes) {
            return false;
        }
        const node = this.graph.nodes.find(n => n.id === nodeId);
        if (!node) {
            return false;
        }
        const nodeRemovingPayload = {
            nodeId,
            node: {
                ...node,
                position: (0, vec_1.vec2)(node.position),
                size: (0, vec_1.vec2)(node.size),
                ports: node.ports.map(port => ({ ...port })),
            },
        };
        const nodeRemoving = this.eventBus.emitCancellable('nodeRemoving', nodeRemovingPayload);
        if (nodeRemoving.cancelled) {
            return false;
        }
        this.clearEdgeEffectsForNode(nodeId);
        this.graph.edges = this.graph.edges.filter(edge => edge.a.nodeId !== nodeId && edge.b.nodeId !== nodeId);
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
                position: (0, vec_1.vec2)(node.position),
                size: (0, vec_1.vec2)(node.size),
                ports: node.ports.map(port => ({ ...port })),
            },
        });
        return true;
    }
    setNodeData(nodeId, data) {
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
                position: (0, vec_1.vec2)(node.position),
                size: (0, vec_1.vec2)(node.size),
                ports: node.ports.map(port => ({ ...port })),
            },
        });
        return true;
    }
    updateNodeData(nodeId, updater) {
        const node = this.graph.nodes.find(n => n.id === nodeId);
        if (!node) {
            return false;
        }
        const next = updater(node.data, {
            ...node,
            position: (0, vec_1.vec2)(node.position),
            size: (0, vec_1.vec2)(node.size),
            ports: node.ports.map(port => ({ ...port })),
        });
        return this.setNodeData(nodeId, next);
    }
    setPortData(target, data) {
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
                position: (0, vec_1.vec2)(node.position),
                size: (0, vec_1.vec2)(node.size),
                ports: node.ports.map(existingPort => ({ ...existingPort })),
            },
            port: { ...port },
        });
        return true;
    }
    updatePortData(target, updater) {
        const resolved = this.resolveNodeAndPort(target);
        if (!resolved) {
            return false;
        }
        const { node, port } = resolved;
        const next = updater(port.data, { ...port }, {
            ...node,
            position: (0, vec_1.vec2)(node.position),
            size: (0, vec_1.vec2)(node.size),
            ports: node.ports.map(existingPort => ({ ...existingPort })),
        });
        return this.setPortData(target, next);
    }
    createEdge(a, b, data, options) {
        var _a, _b, _c, _d;
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
        const resolvedTheme = {
            ...((_a = fromNodeAndPort === null || fromNodeAndPort === void 0 ? void 0 : fromNodeAndPort.port.edgeTheme) !== null && _a !== void 0 ? _a : {}),
            ...(fromNodeAndPort && toNodeAndPort
                ? (_c = (_b = this.options).resolveEdgeTheme) === null || _c === void 0 ? void 0 : _c.call(_b, {
                    fromNode: fromNodeAndPort.node,
                    fromPort: fromNodeAndPort.port,
                    toNode: toNodeAndPort.node,
                    toPort: toNodeAndPort.port,
                    data,
                })
                : undefined),
            ...((_d = options === null || options === void 0 ? void 0 : options.theme) !== null && _d !== void 0 ? _d : {}),
        };
        if (Object.keys(resolvedTheme).length > 0) {
            normalized.theme = resolvedTheme;
        }
        const edgeCreatingPayload = {
            edge: {
                ...normalized,
                a: { ...normalized.a },
                b: { ...normalized.b },
            },
        };
        const edgeCreating = this.eventBus.emitCancellable('edgeCreating', edgeCreatingPayload);
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
    removeEdge(a, b) {
        if (!this.options.capabilities.deleteEdges) {
            return false;
        }
        const existing = this.findEdge(a, b);
        if (!existing) {
            return false;
        }
        const edgeRemovingPayload = {
            edge: {
                ...existing,
                a: { ...existing.a },
                b: { ...existing.b },
            },
        };
        const edgeRemoving = this.eventBus.emitCancellable('edgeRemoving', edgeRemovingPayload);
        if (edgeRemoving.cancelled) {
            return false;
        }
        this.graph.edges = this.graph.edges.filter(edge => !(this.portRefEq(edge.a, existing.a) &&
            this.portRefEq(edge.b, existing.b)));
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
    setEdgeData(a, b, data) {
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
    updateEdgeData(a, b, updater) {
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
    getNeighbors(nodeId, direction = enums_1.TraversalDirection.Both) {
        return (0, utils_1.getNeighbors)(this.graph, nodeId, direction);
    }
    traverseBFS(startNodeId, visitor, direction = enums_1.TraversalDirection.Both) {
        return (0, utils_1.traverseBFS)(this.graph, startNodeId, visitor, direction);
    }
    traverseDFS(startNodeId, visitor, direction = enums_1.TraversalDirection.Both) {
        return (0, utils_1.traverseDFS)(this.graph, startNodeId, visitor, direction);
    }
    traverseTopological(visitor) {
        return (0, utils_1.traverseTopological)(this.graph, visitor);
    }
    topologicalSort() {
        return (0, utils_1.topologicalSort)(this.graph);
    }
    hasCycle() {
        return (0, utils_1.hasCycle)(this.graph);
    }
    snapAllToGrid(options = {}) {
        var _a, _b;
        const snapPositions = (_a = options.snapPositions) !== null && _a !== void 0 ? _a : true;
        const snapSizes = (_b = options.snapSizes) !== null && _b !== void 0 ? _b : true;
        for (const node of this.graph.nodes) {
            if (snapPositions) {
                const from = (0, vec_1.vec2)(node.position);
                node.position = (0, utils_1.roundVec)(node.position, this.options.gridSize);
                this.eventBus.emit('nodeMoved', {
                    nodeId: node.id,
                    from,
                    to: (0, vec_1.vec2)(node.position),
                });
            }
            if (snapSizes) {
                const from = (0, vec_1.vec2)(node.size);
                node.size = (0, utils_1.roundVec)(node.size, this.options.gridSize);
                this.eventBus.emit('nodeResized', {
                    nodeId: node.id,
                    from,
                    to: (0, vec_1.vec2)(node.size),
                });
            }
        }
    }
    async arrangeForceDirected(options) {
        const result = await (0, layout_1.layoutForceDirected)(this.graph, options);
        for (const [nodeId, position] of result.nodePositions.entries()) {
            const node = this.graph.nodes.find(n => n.id === nodeId);
            if (!node) {
                continue;
            }
            node.position = (0, vec_1.vec2)(position);
            this.ensureNodeState(node).actualPosition = (0, vec_1.vec2)(position);
        }
        this.eventBus.emit('graphArranged', {
            strategy: 'forceDirected',
        });
        return result;
    }
    async arrangeLayered(options) {
        const result = await (0, layout_1.layoutLayered)(this.graph, options);
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
            node.position = (0, vec_1.vec2)(position);
            this.ensureNodeState(node).actualPosition = (0, vec_1.vec2)(position);
        }
        this.eventBus.emit('graphArranged', {
            strategy: 'layered',
        });
        return result;
    }
    async arrangeGraph(strategy, options) {
        if (strategy === 'layered') {
            return this.arrangeLayered(options);
        }
        return this.arrangeForceDirected(options);
    }
    draw() {
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
        debug_1.default.draw(this.context);
        this.context.restore();
    }
    update(dt) {
        GraphBuilder.screen = (0, vec_1.vec2)(this.canvas.width, this.canvas.height);
        if (input_manager_1.default.keyDown('Space') && this.tool !== enums_1.ToolMode.Pan) {
            this.setTool(enums_1.ToolMode.Pan, true);
        }
        if (input_manager_1.default.keyReleased('Space') && this.tool === enums_1.ToolMode.Pan) {
            this.resetTool();
        }
        this.updateCamera(dt);
        this.camera.update(GraphBuilder.screen);
        const mouse = this.camera.screenToWorld(input_manager_1.default.mousePosition);
        this.updatePortStates(mouse);
        this.updateNodeStates(mouse);
        this.updateEdgeStates(mouse);
        this.handleInteractions(mouse);
        this.easeNodes();
        this.updateEffects(dt);
        input_manager_1.default.update();
    }
    loop() {
        this.frameTimer.update();
        this.update(this.frameTimer.elapsedTime);
        this.draw();
        if (constants_1.DEBUG) {
            debug_1.default.value('FPS', this.frameTimer.frameRate, {
                align: 'right',
            });
        }
        if (this.running) {
            this.frameHandle = window.requestAnimationFrame(this.loop.bind(this));
        }
    }
    updateCamera(dt) {
        if (this.tool === enums_1.ToolMode.Pan && input_manager_1.default.mouseDown()) {
            const cameraPosition = this.camera.screenToWorld(input_manager_1.default.mousePosition);
            if (!this.panOffset) {
                this.panOffset = cameraPosition;
            }
            this.camera.positionImmediate = vec_1.vec2.add(this.camera.position, vec_1.vec2.sub(this.panOffset, cameraPosition));
        }
        if (!input_manager_1.default.mouseDown()) {
            this.panOffset = null;
        }
        const pan = (0, vec_1.vec2)(constants_1.CAMERA_KEYBOARD_PAN_SPEED * dt, 0);
        if (input_manager_1.default.keyDown('KeyW') || input_manager_1.default.keyDown('ArrowUp')) {
            this.camera.positionImmediate = vec_1.vec2.add(this.camera.position, vec_1.vec2.rotf(pan, 1));
        }
        if (input_manager_1.default.keyDown('KeyS') || input_manager_1.default.keyDown('ArrowDown')) {
            this.camera.positionImmediate = vec_1.vec2.add(this.camera.position, vec_1.vec2.rotf(pan, -1));
        }
        if (input_manager_1.default.keyDown('KeyA') || input_manager_1.default.keyDown('ArrowLeft')) {
            this.camera.positionImmediate = vec_1.vec2.add(this.camera.position, vec_1.vec2.rotf(pan, 2));
        }
        if (input_manager_1.default.keyDown('KeyD') || input_manager_1.default.keyDown('ArrowRight')) {
            this.camera.positionImmediate = vec_1.vec2.add(this.camera.position, vec_1.vec2.rotf(pan, 0));
        }
        if (input_manager_1.default.mouseWheelUp()) {
            this.camera.scale -= constants_1.CAMERA_ZOOM_STEP;
        }
        if (input_manager_1.default.mouseWheelDown()) {
            this.camera.scale += constants_1.CAMERA_ZOOM_STEP;
        }
    }
    updatePortStates(mouse) {
        var _a;
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
            this.ensurePortState(this.creatingEdge.a.nodeId, this.creatingEdge.a.portId, this.creatingEdge.a.side).hovered = true;
        }
        const isConnectMode = this.tool === enums_1.ToolMode.CreateEdge;
        const reversedNodes = [...this.graph.nodes].reverse();
        for (const node of reversedNodes) {
            for (const port of node.ports) {
                const state = this.ensurePortState(node.id, port.id, port.side);
                const effectiveRadius = this.effectivePortTheme(port).portRadius;
                const radius = effectiveRadius +
                    (isConnectMode ? constants_1.PORT_CONNECT_MARGIN : constants_1.PORT_HOVER_MARGIN);
                const hovered = (0, utils_1.pointInCircle)(mouse, {
                    position: state.position,
                    radius,
                });
                if (!hovered) {
                    continue;
                }
                if (this.tool === enums_1.ToolMode.CreateEdge && this.creatingEdge) {
                    const start = this.creatingEdge.a;
                    const end = {
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
                            (_a = validation.reason) !== null && _a !== void 0 ? _a : 'Connection is not allowed';
                        continue;
                    }
                }
                this.hoveredPort = { nodeId: node.id, portId: port.id };
                state.hovered = true;
                return;
            }
        }
    }
    updateNodeStates(mouse) {
        var _a, _b, _c;
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
            if (((_a = this.hoveredPort) === null || _a === void 0 ? void 0 : _a.nodeId) === node.id) {
                continue;
            }
            const hovered = [enums_1.ToolMode.Select, enums_1.ToolMode.ResizeNode].includes(this.tool) &&
                (0, utils_1.pointInRectangle)(mouse, {
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
            const deleteHovered = this.options.capabilities.deleteNodes &&
                ((_b = node.deletable) !== null && _b !== void 0 ? _b : true) &&
                this.tool === enums_1.ToolMode.Select &&
                (0, utils_1.pointInRectangle)(mouse, {
                    position: vec_1.vec2.add(node.position, (0, vec_1.vec2)(node.size.x - constants_1.DELETE_BUTTON_SIZE, 0)),
                    size: (0, vec_1.vec2)(constants_1.DELETE_BUTTON_SIZE),
                });
            state.deleteHovered = deleteHovered;
            const resizeHovered = this.options.capabilities.resizeNodes &&
                ((_c = node.resizable) !== null && _c !== void 0 ? _c : true) &&
                [enums_1.ToolMode.Select, enums_1.ToolMode.ResizeNode].includes(this.tool) &&
                (0, utils_1.pointInRectangle)(mouse, {
                    position: vec_1.vec2.add(node.position, vec_1.vec2.sub(node.size, constants_1.RESIZE_HANDLE_SIZE)),
                    size: (0, vec_1.vec2)(constants_1.RESIZE_HANDLE_SIZE),
                });
            state.resizeHovered = resizeHovered;
            if (resizeHovered && this.tool !== enums_1.ToolMode.ResizeNode) {
                this.setTool(enums_1.ToolMode.ResizeNode, true);
            }
        }
        if (this.tool === enums_1.ToolMode.ResizeNode &&
            this.graph.nodes.every(node => {
                const state = this.ensureNodeState(node);
                return !state.resizeHovered && !state.resizing;
            })) {
            this.resetTool();
            if (this.tool === enums_1.ToolMode.ResizeNode) {
                this.setTool(enums_1.ToolMode.Select);
            }
        }
    }
    updateEdgeStates(mouse) {
        this.hoveredEdgeId = null;
        for (const edge of this.graph.edges) {
            this.ensureEdgeState(edge).hovered = false;
        }
        if ([enums_1.ToolMode.ResizeNode, enums_1.ToolMode.CreateEdge].includes(this.tool) ||
            !!this.draggingNodeId) {
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
                this.ensurePortState(resolved.nodeId, resolved.portId, resolved.side).hovered = true;
            }
            const key = this.edgeKey(edge);
            this.edgeState.get(key).hovered = true;
            this.hoveredEdgeId = key;
            break;
        }
    }
    edgeHitTest(edge, mouse) {
        const aEndpoint = this.resolvePortEndpoint(edge.a);
        const bEndpoint = this.resolvePortEndpoint(edge.b);
        if (!aEndpoint || !bEndpoint) {
            return false;
        }
        const a = vec_1.vec2.add(aEndpoint.position, vec_1.vec2.mul(aEndpoint.direction, constants_1.EDGE_CURVE_ENDPOINT_OFFSET));
        const b = vec_1.vec2.add(bEndpoint.position, vec_1.vec2.mul(bEndpoint.direction, constants_1.EDGE_CURVE_ENDPOINT_OFFSET));
        const { cp1, cp2, join } = (0, utils_1.getCurveGeometry)(a, b, aEndpoint.direction, bEndpoint.direction, this.options.gridSize);
        const samples = Math.ceil(vec_1.vec2.len(vec_1.vec2.sub(a, b)) / constants_1.EDGE_CURVE_SAMPLE_DISTANCE) + 1;
        for (let i = 0; i <= samples; i++) {
            const t = i / samples;
            const d1 = (0, utils_1.pointToQuadraticBezierDistance)(mouse, a, cp1, join, t);
            const d2 = (0, utils_1.pointToQuadraticBezierDistance)(mouse, join, cp2, b, t);
            if (d1 < constants_1.EDGE_HOVER_THRESHOLD || d2 < constants_1.EDGE_HOVER_THRESHOLD) {
                return true;
            }
        }
        return false;
    }
    handleInteractions(mouse) {
        var _a;
        const hoveredNode = this.hoveredNodeId
            ? ((_a = this.graph.nodes.find(node => node.id === this.hoveredNodeId)) !== null && _a !== void 0 ? _a : null)
            : null;
        const hoveredNodeState = hoveredNode
            ? this.ensureNodeState(hoveredNode)
            : null;
        const hoveredPort = this.hoveredPort
            ? this.resolvePortEndpoint(this.hoveredPort)
            : null;
        if (this.tool === enums_1.ToolMode.Select &&
            input_manager_1.default.mousePressed() &&
            !hoveredNode &&
            !hoveredPort) {
            this.selectNode(null);
        }
        if (hoveredNode &&
            hoveredNodeState &&
            hoveredNodeState.selected &&
            input_manager_1.default.mousePressed() &&
            input_manager_1.default.keyDown('ControlLeft')) {
            this.removeNode(hoveredNode.id);
            return;
        }
        if (hoveredNode &&
            (hoveredNodeState === null || hoveredNodeState === void 0 ? void 0 : hoveredNodeState.deleteHovered) &&
            input_manager_1.default.mouseDown()) {
            this.removeNode(hoveredNode.id);
            return;
        }
        if (this.options.capabilities.createNodes &&
            this.tool === enums_1.ToolMode.CreateNode &&
            this.createNodeTemplate &&
            !hoveredNode &&
            !hoveredPort &&
            input_manager_1.default.mousePressed()) {
            this.createNode(mouse);
        }
        if (this.options.capabilities.createEdges &&
            hoveredPort &&
            input_manager_1.default.mousePressed()) {
            const incoming = this.findIncomingEdgeForPort({
                nodeId: hoveredPort.nodeId,
                portId: hoveredPort.portId,
            });
            if (hoveredPort.type === enums_1.PortType.Input && incoming) {
                this.removeEdge(incoming.a, incoming.b);
                const source = this.resolvePortEndpoint(incoming.a);
                if (source) {
                    this.startCreatingEdge(source);
                }
            }
            else {
                this.startCreatingEdge(hoveredPort);
            }
        }
        if (this.options.capabilities.moveNodes &&
            this.tool === enums_1.ToolMode.Select &&
            hoveredNode &&
            hoveredNodeState &&
            !hoveredPort &&
            !this.draggingNodeId &&
            input_manager_1.default.mouseDown()) {
            this.selectNode(hoveredNode.id);
            this.draggingNodeId = hoveredNode.id;
            hoveredNodeState.dragging = true;
            hoveredNodeState.dragOffset = vec_1.vec2.sub(mouse, hoveredNode.position);
        }
        if (this.options.capabilities.resizeNodes &&
            this.tool === enums_1.ToolMode.ResizeNode &&
            hoveredNode &&
            hoveredNodeState &&
            hoveredNodeState.resizeHovered &&
            !this.resizingNodeId &&
            input_manager_1.default.mouseDown()) {
            this.resizingNodeId = hoveredNode.id;
            hoveredNodeState.resizing = true;
            hoveredNodeState.resizeOffset = vec_1.vec2.sub(mouse, vec_1.vec2.add(hoveredNode.position, hoveredNode.size));
        }
        if (this.draggingNodeId) {
            const node = this.graph.nodes.find(n => n.id === this.draggingNodeId);
            const state = node ? this.ensureNodeState(node) : null;
            if (node && state) {
                const from = (0, vec_1.vec2)(node.position);
                node.position = vec_1.vec2.sub(mouse, state.dragOffset);
                if (this.options.snapToGrid) {
                    node.position = (0, utils_1.roundVec)(node.position, this.options.gridSize);
                }
                if (from.x !== node.position.x || from.y !== node.position.y) {
                    this.eventBus.emit('nodeMoved', {
                        nodeId: node.id,
                        from,
                        to: (0, vec_1.vec2)(node.position),
                    });
                }
            }
        }
        if (this.resizingNodeId) {
            const node = this.graph.nodes.find(n => n.id === this.resizingNodeId);
            const state = node ? this.ensureNodeState(node) : null;
            if (node && state) {
                const from = (0, vec_1.vec2)(node.size);
                node.size = (0, utils_1.clampVec)(vec_1.vec2.sub(vec_1.vec2.sub(mouse, node.position), state.resizeOffset), (0, vec_1.vec2)(constants_1.NODE_MIN_SIZE), (0, vec_1.vec2)(constants_1.NODE_MAX_SIZE));
                if (this.options.snapToGrid) {
                    node.size = (0, utils_1.roundVec)(node.size, this.options.gridSize);
                }
                if (from.x !== node.size.x || from.y !== node.size.y) {
                    this.eventBus.emit('nodeResized', {
                        nodeId: node.id,
                        from,
                        to: (0, vec_1.vec2)(node.size),
                    });
                }
            }
        }
        if (this.creatingEdge) {
            const hovered = this.hoveredPort
                ? this.resolvePortEndpoint(this.hoveredPort)
                : null;
            this.creatingEdge.update(hovered ? (0, vec_1.vec2)(hovered.position) : (0, vec_1.vec2)(mouse), hovered ? hovered.direction : null);
        }
        if (!input_manager_1.default.mouseDown()) {
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
    startCreatingEdge(endpoint) {
        this.setTool(enums_1.ToolMode.CreateEdge, true);
        const sourceNode = this.graph.nodes.find(n => n.id === endpoint.nodeId);
        const sourcePort = sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.ports.find(p => p.id === endpoint.portId);
        this.creatingEdge = new EdgeTool_1.default(endpoint, sourcePort === null || sourcePort === void 0 ? void 0 : sourcePort.edgeTheme);
    }
    stopCreatingEdge() {
        var _a;
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
                this.createEdge({ nodeId: start.nodeId, portId: start.portId }, { nodeId: hovered.nodeId, portId: hovered.portId }, undefined, this.creatingEdge.theme
                    ? { theme: this.creatingEdge.theme }
                    : undefined);
            }
            else {
                this.eventBus.emit('edgeConnectionRejected', {
                    from: { nodeId: start.nodeId, portId: start.portId },
                    to: { nodeId: hovered.nodeId, portId: hovered.portId },
                    reason: (_a = validation.reason) !== null && _a !== void 0 ? _a : 'Connection is not allowed',
                });
            }
        }
        this.creatingEdge = null;
        this.resetTool();
        if (this.tool === enums_1.ToolMode.CreateEdge) {
            this.setTool(enums_1.ToolMode.Select);
        }
    }
    validateConnection(a, b) {
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
        const normalized = this.normalizeEdgeEndpoints({ nodeId: a.nodeId, portId: a.portId }, { nodeId: b.nodeId, portId: b.portId });
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
    canConnectEndpoints(a, b) {
        return this.validateConnection(a, b).allowed;
    }
    easeNodes() {
        for (const node of this.graph.nodes) {
            const state = this.ensureNodeState(node);
            state.actualPosition = vec_1.vec2.add(state.actualPosition, vec_1.vec2.mul(vec_1.vec2.sub(node.position, state.actualPosition), constants_1.NODE_EASE_AMOUNT));
            state.actualSize = vec_1.vec2.add(state.actualSize, vec_1.vec2.mul(vec_1.vec2.sub(node.size, state.actualSize), constants_1.NODE_EASE_AMOUNT));
        }
    }
    drawGrid() {
        const { theme, callbacks } = this.options;
        const nextConfig = {
            gridSize: this.options.gridSize,
            gridDotLineWidth: theme.gridDotLineWidth,
            gridDotColor: theme.gridDotColor,
            drawGridDot: callbacks.drawGridDot,
            drawGridDotMode: this.callbackRenderMode('drawGridDot'),
        };
        const previousConfig = this.gridRenderConfig;
        if (previousConfig && previousConfig.gridSize !== nextConfig.gridSize) {
            this.resetGridViewPort();
        }
        if (!previousConfig ||
            previousConfig.gridDotLineWidth !== nextConfig.gridDotLineWidth ||
            previousConfig.gridDotColor !== nextConfig.gridDotColor ||
            previousConfig.drawGridDot !== nextConfig.drawGridDot ||
            previousConfig.drawGridDotMode !== nextConfig.drawGridDotMode) {
            this.gridRenderRevision += 1;
        }
        this.gridRenderConfig = nextConfig;
        this.ensureGridViewPort();
        if (!this.gridViewPort) {
            return;
        }
        const screen = (0, vec_1.vec2)(this.canvas.width, this.canvas.height);
        this.context.save();
        this.context.lineWidth = theme.gridDotLineWidth;
        this.context.strokeStyle = theme.gridDotColor;
        this.gridViewPort.update(0, screen, this.camera);
        this.gridViewPort.draw(this.context, screen, this.camera);
        this.context.restore();
    }
    ensureGridViewPort() {
        if (this.gridViewPort) {
            return;
        }
        const chunkSize = this.gridChunkWorldSize();
        this.gridViewPort = new view_port_1.ViewPort({
            gridSize: (0, vec_1.vec2)(chunkSize, chunkSize),
            generator: cell => this.createGridChunk(cell, chunkSize),
            border: 1,
            bufferAmount: 32,
            maxElementsToGenerate: 64,
            spatialHashMaxElements: 2000,
            spatialHashMaxElementsToRemove: 200,
        });
    }
    resetGridViewPort() {
        this.gridViewPort = null;
        this.gridRenderRevision = 0;
        this.gridRenderConfig = null;
    }
    createGridChunk(cell, chunkSize) {
        const origin = (0, vec_1.vec2)(cell.x * chunkSize, cell.y * chunkSize);
        const chunk = {
            cell: (0, vec_1.vec2)(cell),
            origin,
            canvas: null,
            renderRevision: -1,
            draw: context => {
                this.drawGridChunk(context, chunk);
            },
        };
        return chunk;
    }
    drawGridChunk(context, chunk) {
        const drawGridDot = this.options.callbacks.drawGridDot;
        if (drawGridDot && this.callbackRenderMode('drawGridDot') === 'replace') {
            this.drawGridChunkDynamic(context, chunk, drawGridDot);
            return;
        }
        this.drawGridChunkCached(context, chunk);
        if (drawGridDot && this.callbackRenderMode('drawGridDot') === 'overlay') {
            this.drawGridChunkDynamic(context, chunk, drawGridDot);
        }
    }
    drawDefaultGridDot(context, position) {
        (0, utils_1.plus)(context, position, GRID_DOT_SIZE);
    }
    drawGridChunkDynamic(context, chunk, drawGridDot) {
        const mode = this.callbackRenderMode('drawGridDot');
        const gridSize = this.options.gridSize;
        for (let y = 0; y < GRID_CHUNK_CELLS; y++) {
            for (let x = 0; x < GRID_CHUNK_CELLS; x++) {
                const position = (0, vec_1.vec2)(chunk.origin.x + x * gridSize, chunk.origin.y + y * gridSize);
                if (mode === 'overlay') {
                    drawGridDot(context, {
                        position,
                        gridSize,
                    }, () => { });
                    continue;
                }
                this.invokeDrawCallback(context, 'drawGridDot', drawGridDot, {
                    position,
                    gridSize,
                }, () => {
                    this.drawDefaultGridDot(context, position);
                });
            }
        }
    }
    drawGridChunkCached(context, chunk) {
        const chunkCanvasSize = this.gridChunkWorldSize() + GRID_CHUNK_PADDING * 2;
        if (!chunk.canvas ||
            chunk.canvas.width !== chunkCanvasSize ||
            chunk.canvas.height !== chunkCanvasSize ||
            chunk.renderRevision !== this.gridRenderRevision) {
            this.renderGridChunkToCanvas(chunk, chunkCanvasSize);
        }
        if (!chunk.canvas) {
            return;
        }
        context.drawImage(chunk.canvas, chunk.origin.x - GRID_CHUNK_PADDING, chunk.origin.y - GRID_CHUNK_PADDING);
    }
    renderGridChunkToCanvas(chunk, chunkCanvasSize) {
        var _a;
        const canvas = (_a = chunk.canvas) !== null && _a !== void 0 ? _a : document.createElement('canvas');
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
                (0, utils_1.plus)(context, (0, vec_1.vec2)(GRID_CHUNK_PADDING + x * gridSize, GRID_CHUNK_PADDING + y * gridSize), GRID_DOT_SIZE);
            }
        }
        chunk.canvas = canvas;
        chunk.renderRevision = this.gridRenderRevision;
    }
    gridChunkWorldSize() {
        return this.options.gridSize * GRID_CHUNK_CELLS;
    }
    drawNode(node) {
        var _a, _b;
        const state = this.ensureNodeState(node);
        const nodeTheme = this.effectiveNodeTheme(node);
        const { callbacks } = this.options;
        this.invokeDrawCallback(this.context, 'drawNodeFrame', callbacks.drawNodeFrame, {
            node,
            position: (0, vec_1.vec2)(state.actualPosition),
            size: (0, vec_1.vec2)(state.actualSize),
            hovered: state.hovered,
            selected: state.selected,
        }, () => {
            this.context.save();
            this.context.strokeStyle = state.hovered
                ? nodeTheme.nodeHoveredBorderColor
                : nodeTheme.nodeBorderColor;
            this.context.fillStyle = state.selected
                ? nodeTheme.nodeSelectedFillColor
                : nodeTheme.nodeFillColor;
            this.context.lineWidth = nodeTheme.nodeBorderWidth;
            (0, utils_1.roundedRect)(this.context, state.actualPosition, state.actualSize, nodeTheme.nodeBorderRadius);
            this.context.fill();
            (0, utils_1.roundedRect)(this.context, vec_1.vec2.add(state.actualPosition, 1), vec_1.vec2.sub(state.actualSize, 2), nodeTheme.nodeBorderRadius);
            this.context.stroke();
            this.context.restore();
        });
        if ((_a = node.deletable) !== null && _a !== void 0 ? _a : true) {
            this.invokeDrawCallback(this.context, 'drawDeleteButton', callbacks.drawDeleteButton, {
                node,
                position: (0, vec_1.vec2)(state.actualPosition),
                size: (0, vec_1.vec2)(state.actualSize),
                hovered: state.deleteHovered,
            }, () => {
                this.context.save();
                this.context.strokeStyle = state.deleteHovered
                    ? nodeTheme.deleteButtonHoveredColor
                    : nodeTheme.deleteButtonColor;
                this.context.lineWidth =
                    nodeTheme.deleteButtonLineWidth / constants_1.DELETE_BUTTON_SIZE;
                this.context.translate(state.actualPosition.x +
                    state.actualSize.x -
                    constants_1.DELETE_BUTTON_SIZE / 2 -
                    nodeTheme.nodePadding, state.actualPosition.y +
                    constants_1.DELETE_BUTTON_SIZE / 2 +
                    nodeTheme.nodePadding);
                this.context.scale(constants_1.DELETE_BUTTON_SIZE, constants_1.DELETE_BUTTON_SIZE);
                (0, utils_1.cross)(this.context, (0, vec_1.vec2)(), 0.4);
                this.context.restore();
            });
        }
        if ((_b = node.resizable) !== null && _b !== void 0 ? _b : true) {
            this.invokeDrawCallback(this.context, 'drawResizeHandle', callbacks.drawResizeHandle, {
                node,
                position: (0, vec_1.vec2)(state.actualPosition),
                size: (0, vec_1.vec2)(state.actualSize),
                hovered: state.resizeHovered,
            }, () => {
                this.context.save();
                this.context.strokeStyle = state.resizeHovered
                    ? nodeTheme.resizeHandleHoveredColor
                    : nodeTheme.resizeHandleColor;
                this.context.lineWidth =
                    nodeTheme.resizeHandleLineWidth / constants_1.RESIZE_HANDLE_SIZE;
                this.context.translate(state.actualPosition.x +
                    state.actualSize.x -
                    constants_1.RESIZE_HANDLE_SIZE -
                    nodeTheme.nodePadding, state.actualPosition.y +
                    state.actualSize.y -
                    constants_1.RESIZE_HANDLE_SIZE -
                    nodeTheme.nodePadding);
                this.context.scale(constants_1.RESIZE_HANDLE_SIZE, constants_1.RESIZE_HANDLE_SIZE);
                (0, utils_1.line)(this.context, (0, vec_1.vec2)(0, 0.8), (0, vec_1.vec2)(0.8, 0));
                (0, utils_1.line)(this.context, (0, vec_1.vec2)(0.3, 0.8), (0, vec_1.vec2)(0.8, 0.3));
                (0, utils_1.line)(this.context, (0, vec_1.vec2)(0.6, 0.8), (0, vec_1.vec2)(0.8, 0.6));
                this.context.restore();
            });
        }
        for (const port of node.ports) {
            const portState = this.ensurePortState(node.id, port.id, port.side);
            portState.position = this.resolvePortPosition(node, port);
            this.drawPort(node, port, portState);
        }
        this.invokeDrawCallback(this.context, 'drawNodeContent', callbacks.drawNodeContent, {
            node,
            position: (0, vec_1.vec2)(state.actualPosition),
            size: (0, vec_1.vec2)(state.actualSize),
            hovered: state.hovered,
            selected: state.selected,
        }, () => {
            if (!nodeTheme.showNodeLabel || !node.label) {
                return;
            }
            this.context.save();
            this.context.fillStyle = nodeTheme.nodeLabelColor;
            this.context.font = nodeTheme.nodeLabelFont;
            this.context.textAlign = 'left';
            this.context.textBaseline = 'top';
            this.context.fillText(node.label, state.actualPosition.x + nodeTheme.nodePadding, state.actualPosition.y + nodeTheme.nodePadding);
            this.context.restore();
        });
    }
    drawPort(node, port, stateOverride) {
        const state = stateOverride !== null && stateOverride !== void 0 ? stateOverride : (() => {
            if (!node || !port) {
                throw new Error('Node and port are required when no state override is provided');
            }
            return this.ensurePortState(node.id, port.id, port.side);
        })();
        const direction = port && node
            ? this.ensurePortState(node.id, port.id, port.side).direction
            : (0, vec_1.vec2)(0, -1);
        const isPreview = stateOverride !== undefined && node === null;
        const portTheme = this.effectivePortTheme(port);
        const { callbacks } = this.options;
        this.invokeDrawCallback(this.context, 'drawPort', callbacks.drawPort, {
            node,
            port,
            position: (0, vec_1.vec2)(state.position),
            direction,
            hovered: state.hovered,
            connectable: state.connectable,
            invalidReason: state.invalidReason,
            isPreview,
        }, () => {
            this.context.globalCompositeOperation = 'source-over';
            this.context.save();
            this.context.globalCompositeOperation = 'destination-out';
            this.context.fillStyle = 'black';
            this.context.beginPath();
            this.context.arc(state.position.x, state.position.y, portTheme.portCutoutRadius, 0, Math.PI * 2);
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
            this.context.arc(state.position.x, state.position.y, portTheme.portRadius, 0, Math.PI * 2);
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
                this.context.arc(state.position.x, state.position.y, portTheme.portHoverRingRadius, 0, Math.PI * 2);
                this.context.stroke();
                this.context.restore();
            }
            if (this.options.showPortArrows && port !== null && !isPreview) {
                const arrowDir = port.type === enums_1.PortType.Output ? direction : vec_1.vec2.mul(direction, -1);
                const base = vec_1.vec2.add(state.position, vec_1.vec2.mul(arrowDir, portTheme.portArrowOffset));
                this.context.save();
                this.context.fillStyle = portTheme.portArrowColor;
                (0, utils_1.triangle)(this.context, base, arrowDir, portTheme.portArrowSize);
                this.context.fill();
                this.context.restore();
            }
            if (port !== null &&
                !isPreview &&
                portTheme.showPortLabel &&
                typeof port.label === 'string' &&
                port.label.length > 0) {
                const horizontal = Math.abs(direction.x) > Math.abs(direction.y);
                const distance = portTheme.portRadius + portTheme.portLabelOffset;
                const labelPosition = (0, vec_1.vec2)(state.position);
                this.context.save();
                this.context.fillStyle = portTheme.portLabelColor;
                this.context.font = portTheme.portLabelFont;
                if (horizontal) {
                    if (direction.x < 0) {
                        labelPosition.x += distance;
                        this.context.textAlign = 'left';
                    }
                    else {
                        labelPosition.x -= distance;
                        this.context.textAlign = 'right';
                    }
                    this.context.textBaseline = 'middle';
                }
                else {
                    if (direction.y < 0) {
                        labelPosition.y += distance;
                        this.context.textBaseline = 'top';
                    }
                    else {
                        labelPosition.y -= distance;
                        this.context.textBaseline = 'bottom';
                    }
                    this.context.textAlign = 'center';
                }
                this.context.fillText(port.label, labelPosition.x, labelPosition.y);
                this.context.restore();
            }
        });
    }
    drawEdgePreviewPort() {
        if (!this.creatingEdge) {
            return;
        }
        this.drawPort(null, null, {
            position: (0, vec_1.vec2)(this.creatingEdge.pointer),
            hovered: true,
            connectable: true,
            invalidReason: null,
        });
    }
    drawEdgePreview() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (!this.creatingEdge) {
            return;
        }
        const { from, to, fromDirection, toDirection } = this.creatingEdge.getDrawData();
        const sourceTheme = (_a = this.creatingEdge.theme) !== null && _a !== void 0 ? _a : {};
        const previewTheme = {
            ...this.options.theme,
            ...sourceTheme,
            edgePreviewColor: (_c = (_b = sourceTheme.edgePreviewColor) !== null && _b !== void 0 ? _b : sourceTheme.edgeColor) !== null && _c !== void 0 ? _c : this.options.theme.edgePreviewColor,
            edgePreviewLineWidth: (_e = (_d = sourceTheme.edgePreviewLineWidth) !== null && _d !== void 0 ? _d : sourceTheme.edgeLineWidth) !== null && _e !== void 0 ? _e : this.options.theme.edgePreviewLineWidth,
            edgePreviewOutlineColor: (_g = (_f = sourceTheme.edgePreviewOutlineColor) !== null && _f !== void 0 ? _f : sourceTheme.edgeHoverOutlineColor) !== null && _g !== void 0 ? _g : this.options.theme.edgePreviewOutlineColor,
            edgePreviewOutlineLineWidth: (_j = (_h = sourceTheme.edgePreviewOutlineLineWidth) !== null && _h !== void 0 ? _h : sourceTheme.edgeHoverOutlineLineWidth) !== null && _j !== void 0 ? _j : this.options.theme.edgePreviewOutlineLineWidth,
        };
        const { callbacks } = this.options;
        this.invokeDrawCallback(this.context, 'drawEdgePreview', callbacks.drawEdgePreview, {
            from,
            to,
            fromDirection,
            toDirection,
        }, () => {
            this.context.save();
            this.context.strokeStyle = previewTheme.edgePreviewColor;
            this.context.lineWidth = previewTheme.edgePreviewLineWidth;
            (0, utils_1.curveFromTo)(this.context, from, to, fromDirection, toDirection, this.options.gridSize);
            this.context.stroke();
            this.context.restore();
            this.context.save();
            this.context.strokeStyle = previewTheme.edgePreviewOutlineColor;
            this.context.lineWidth = previewTheme.edgePreviewOutlineLineWidth;
            (0, utils_1.curveFromTo)(this.context, from, to, fromDirection, toDirection, this.options.gridSize);
            this.context.stroke();
            this.context.restore();
        });
    }
    drawEdge(edge) {
        const aEndpoint = this.resolvePortEndpoint(edge.a);
        const bEndpoint = this.resolvePortEndpoint(edge.b);
        if (!aEndpoint || !bEndpoint) {
            return;
        }
        const a = vec_1.vec2.add(aEndpoint.position, vec_1.vec2.mul(aEndpoint.direction, constants_1.EDGE_CURVE_ENDPOINT_OFFSET));
        const b = vec_1.vec2.add(bEndpoint.position, vec_1.vec2.mul(bEndpoint.direction, constants_1.EDGE_CURVE_ENDPOINT_OFFSET));
        const hovered = this.ensureEdgeState(edge).hovered;
        const edgeTheme = this.effectiveEdgeTheme(edge);
        const { callbacks } = this.options;
        this.invokeDrawCallback(this.context, 'drawEdge', callbacks.drawEdge, {
            edge,
            from: a,
            to: b,
            fromDirection: aEndpoint.direction,
            toDirection: bEndpoint.direction,
            hovered,
        }, () => {
            this.context.save();
            this.context.strokeStyle = hovered
                ? edgeTheme.edgeHoveredColor
                : edgeTheme.edgeColor;
            this.context.lineWidth = edgeTheme.edgeLineWidth;
            (0, utils_1.curveFromTo)(this.context, a, b, aEndpoint.direction, bEndpoint.direction, this.options.gridSize);
            this.context.stroke();
            this.context.restore();
            if (hovered) {
                this.context.save();
                this.context.strokeStyle = edgeTheme.edgeHoverOutlineColor;
                this.context.lineWidth = edgeTheme.edgeHoverOutlineLineWidth;
                (0, utils_1.curveFromTo)(this.context, a, b, aEndpoint.direction, bEndpoint.direction, this.options.gridSize);
                this.context.stroke();
                this.context.restore();
            }
            if (this.options.showEdgeArrows) {
                const { cp1, cp2, join } = (0, utils_1.getCurveGeometry)(a, b, aEndpoint.direction, bEndpoint.direction, this.options.gridSize);
                const { position: arrowPos, tangent: arrowDir } = (0, utils_1.sampleBezierChain)(a, cp1, join, cp2, b, edgeTheme.edgeArrowOffset);
                this.context.save();
                this.context.fillStyle = edgeTheme.edgeArrowColor;
                (0, utils_1.triangle)(this.context, arrowPos, arrowDir, edgeTheme.edgeArrowSize);
                this.context.fill();
                this.context.restore();
            }
        });
    }
    drawEffects() {
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
    updateEffects(dt) {
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
            const completed = state.instances.filter(instance => instance.animation.finished);
            state.instances = state.instances.filter(instance => !instance.animation.finished);
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
            const completed = state.instances.filter(instance => instance.animation.finished);
            state.instances = state.instances.filter(instance => !instance.animation.finished);
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
    drawEdgeDashEffect(edge, state) {
        const geometry = this.resolveEdgeGeometry(edge);
        if (!geometry) {
            return;
        }
        const { callbacks } = this.options;
        this.invokeDrawCallback(this.context, 'drawEdgeDashEffect', callbacks.drawEdgeDashEffect, {
            edge,
            channel: state.channel,
            from: (0, vec_1.vec2)(geometry.from),
            to: (0, vec_1.vec2)(geometry.to),
            fromDirection: (0, vec_1.vec2)(geometry.fromDirection),
            toDirection: (0, vec_1.vec2)(geometry.toDirection),
            phase: state.config.phase,
            config: { ...state.config },
        }, () => {
            this.context.save();
            this.context.globalCompositeOperation = state.config.blendMode;
            this.context.globalAlpha = Math.max(0, Math.min(1, state.config.opacity));
            this.context.strokeStyle = state.config.color;
            this.context.lineWidth = Math.max(0.1, state.config.lineWidth);
            this.context.setLineDash(state.config.dashPattern);
            this.context.lineDashOffset = -state.config.phase;
            (0, utils_1.curveFromTo)(this.context, geometry.from, geometry.to, geometry.fromDirection, geometry.toDirection, this.options.gridSize);
            this.context.stroke();
            this.context.restore();
        });
    }
    drawEdgeDotEffect(edge, state) {
        const geometry = this.resolveEdgeGeometry(edge);
        if (!geometry) {
            return;
        }
        const { callbacks } = this.options;
        const { cp1, cp2, join } = (0, utils_1.getCurveGeometry)(geometry.from, geometry.to, geometry.fromDirection, geometry.toDirection, this.options.gridSize);
        for (const instance of state.instances) {
            const progress = instance.animation.current;
            const sample = (0, utils_1.sampleBezierChain)(geometry.from, cp1, join, cp2, geometry.to, progress);
            this.invokeDrawCallback(this.context, 'drawEdgeDotEffect', callbacks.drawEdgeDotEffect, {
                edge,
                channel: state.channel,
                id: instance.id,
                position: (0, vec_1.vec2)(sample.position),
                direction: (0, vec_1.vec2)(sample.tangent),
                progress,
                config: { ...state.config },
            }, () => {
                this.context.save();
                this.context.globalCompositeOperation = state.config.blendMode;
                this.context.globalAlpha = Math.max(0, Math.min(1, state.config.opacity));
                this.context.fillStyle = state.config.color;
                this.context.beginPath();
                this.context.arc(sample.position.x, sample.position.y, Math.max(0.1, state.config.radius), 0, Math.PI * 2);
                this.context.fill();
                this.context.restore();
            });
        }
    }
    drawPortPulseEffect(state) {
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
            this.invokeDrawCallback(this.context, 'drawPortPulseEffect', callbacks.drawPortPulseEffect, {
                node,
                port,
                channel: state.channel,
                id: instance.id,
                position: (0, vec_1.vec2)(portState.position),
                progress,
                radius,
                opacity,
                config: { ...config },
            }, () => {
                this.context.save();
                this.context.globalCompositeOperation = config.blendMode;
                this.context.globalAlpha = Math.max(0, Math.min(1, opacity));
                this.context.strokeStyle = config.color;
                this.context.lineWidth = Math.max(0.1, config.lineWidth);
                this.context.beginPath();
                this.context.arc(portState.position.x, portState.position.y, radius, 0, Math.PI * 2);
                this.context.stroke();
                this.context.restore();
            });
        }
    }
    callbackRenderMode(callbackName) {
        var _a, _b;
        return (_b = (_a = this.options.callbacks.renderModes) === null || _a === void 0 ? void 0 : _a[callbackName]) !== null && _b !== void 0 ? _b : 'replace';
    }
    invokeDrawCallback(context, callbackName, callback, drawContext, drawDefault) {
        const mode = this.callbackRenderMode(callbackName);
        let defaultDrawn = false;
        const runDefault = () => {
            if (defaultDrawn) {
                return;
            }
            defaultDrawn = true;
            drawDefault();
        };
        if (mode === 'overlay') {
            runDefault();
        }
        if (!callback) {
            runDefault();
            return;
        }
        const result = callback(context, drawContext, runDefault);
        if (mode === 'replace' && result === false && !defaultDrawn) {
            runDefault();
        }
    }
    getEdgeDashEffectConfig(target, channel) {
        const resolved = this.resolveEdgeTarget(target);
        if (!resolved) {
            return null;
        }
        const key = this.effectKey(resolved.edgeKey, channel);
        const existing = this.edgeDashEffects.get(key);
        return existing ? { ...existing.config } : null;
    }
    setEdgeDashEffectConfig(target, patch, channel) {
        var _a;
        const resolved = this.resolveEdgeTarget(target);
        if (!resolved) {
            return false;
        }
        const edgeTheme = this.effectiveEdgeTheme(resolved.edge);
        const key = this.effectKey(resolved.edgeKey, channel);
        const existing = this.edgeDashEffects.get(key);
        const config = {
            ...this.options.effects.edgeDash,
            color: edgeTheme.edgeDashColor,
            lineWidth: edgeTheme.edgeDashLineWidth,
            ...((_a = existing === null || existing === void 0 ? void 0 : existing.config) !== null && _a !== void 0 ? _a : {}),
            ...patch,
        };
        this.edgeDashEffects.set(key, {
            edgeKey: resolved.edgeKey,
            channel,
            config,
        });
        return true;
    }
    startEdgeDashEffect(target, patch = {}, channel) {
        const updated = this.setEdgeDashEffectConfig(target, { ...patch, running: true }, channel);
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
    stopEdgeDashEffect(target, channel) {
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
    clearEdgeDashEffects(target, channel = 'default') {
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
    getEdgeDotEffectConfig(target, channel) {
        const resolved = this.resolveEdgeTarget(target);
        if (!resolved) {
            return null;
        }
        const key = this.effectKey(resolved.edgeKey, channel);
        const existing = this.edgeDotEffects.get(key);
        return existing ? { ...existing.config } : null;
    }
    setEdgeDotEffectConfig(target, patch, channel) {
        var _a, _b, _c, _d, _e;
        const resolved = this.resolveEdgeTarget(target);
        if (!resolved) {
            return false;
        }
        const edgeTheme = this.effectiveEdgeTheme(resolved.edge);
        const key = this.effectKey(resolved.edgeKey, channel);
        const existing = this.edgeDotEffects.get(key);
        const config = {
            ...this.options.effects.edgeDot,
            color: edgeTheme.edgeDotColor,
            radius: edgeTheme.edgeDotRadius,
            opacity: edgeTheme.edgeDotOpacity,
            ...((_a = existing === null || existing === void 0 ? void 0 : existing.config) !== null && _a !== void 0 ? _a : {}),
            ...patch,
            animation: {
                ...this.options.effects.edgeDot.animation,
                ...((_b = existing === null || existing === void 0 ? void 0 : existing.config.animation) !== null && _b !== void 0 ? _b : {}),
                ...((_c = patch.animation) !== null && _c !== void 0 ? _c : {}),
            },
        };
        this.edgeDotEffects.set(key, {
            edgeKey: resolved.edgeKey,
            channel,
            config,
            spawnElapsed: (_d = existing === null || existing === void 0 ? void 0 : existing.spawnElapsed) !== null && _d !== void 0 ? _d : 0,
            instances: (_e = existing === null || existing === void 0 ? void 0 : existing.instances) !== null && _e !== void 0 ? _e : [],
        });
        return true;
    }
    triggerEdgeDotEffect(target, patch = {}, channel) {
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
    startEdgeDotEffect(target, patch = {}, channel) {
        const updated = this.setEdgeDotEffectConfig(target, { ...patch, running: true, loop: true }, channel);
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
    stopEdgeDotEffect(target, channel) {
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
    clearEdgeDotEffects(target, channel = 'default') {
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
    triggerPortPulseEffect(target, patch = {}, channel) {
        var _a, _b;
        const resolved = this.resolveNodeAndPort(target);
        if (!resolved) {
            return null;
        }
        const key = this.effectKey(this.portKey(target.nodeId, target.portId), channel);
        const config = {
            ...this.options.effects.portPulse,
            color: this.effectivePortTheme(resolved.port).portPulseColor,
            lineWidth: this.effectivePortTheme(resolved.port).portPulseLineWidth,
            fromRadius: this.effectivePortTheme(resolved.port).portPulseFromRadius,
            toRadius: this.effectivePortTheme(resolved.port).portPulseToRadius,
            maxOpacity: this.effectivePortTheme(resolved.port).portPulseMaxOpacity,
            ...patch,
            animation: {
                ...this.options.effects.portPulse.animation,
                ...((_a = patch.animation) !== null && _a !== void 0 ? _a : {}),
            },
        };
        const state = (_b = this.portPulseEffects.get(key)) !== null && _b !== void 0 ? _b : {
            portKey: this.portKey(target.nodeId, target.portId),
            channel,
            instances: [],
        };
        const id = this.createId('effect-port-pulse');
        const duration = Math.max(0.01, config.duration);
        const instance = {
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
    clearPortPulseEffects(target, channel = 'default') {
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
        const key = this.effectKey(this.portKey(target.nodeId, target.portId), channel);
        if (this.portPulseEffects.delete(key)) {
            this.eventBus.emit('effectCleared', {
                kind: 'portPulse',
                channel,
                target,
            });
        }
    }
    clearAllEffects() {
        this.clearEdgeDashEffects(undefined, '*');
        this.clearEdgeDotEffects(undefined, '*');
        this.clearPortPulseEffects(undefined, '*');
    }
    clearEdgeEffectsForNode(nodeId) {
        for (const edge of this.graph.edges) {
            if (edge.a.nodeId !== nodeId && edge.b.nodeId !== nodeId) {
                continue;
            }
            this.clearEdgeDashEffects({ a: edge.a, b: edge.b });
            this.clearEdgeDotEffects({ a: edge.a, b: edge.b });
        }
    }
    addEdgeDotInstance(state, config) {
        if (state.instances.length >= this.options.effects.maxEdgeDotInstances) {
            state.instances.shift();
        }
        const id = this.createId('effect-edge-dot');
        const duration = Math.max(0.01, config.duration);
        const instance = {
            id,
            channel: state.channel,
            animation: this.createUnitAnimation(duration, config.animation),
        };
        instance.animation.start();
        state.instances.push(instance);
        return instance;
    }
    stopEdgeDotInstance(effectKey, id) {
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
    stopPortPulseInstance(effectKey, id) {
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
    resolveEdgeTarget(target) {
        const edge = this.findEdge(target.a, target.b);
        if (!edge) {
            return null;
        }
        return {
            edge,
            edgeKey: this.edgeKey(edge),
        };
    }
    resolveEdgeGeometry(edge) {
        const aEndpoint = this.resolvePortEndpoint(edge.a);
        const bEndpoint = this.resolvePortEndpoint(edge.b);
        if (!aEndpoint || !bEndpoint) {
            return null;
        }
        return {
            from: vec_1.vec2.add(aEndpoint.position, vec_1.vec2.mul(aEndpoint.direction, constants_1.EDGE_CURVE_ENDPOINT_OFFSET)),
            to: vec_1.vec2.add(bEndpoint.position, vec_1.vec2.mul(bEndpoint.direction, constants_1.EDGE_CURVE_ENDPOINT_OFFSET)),
            fromDirection: aEndpoint.direction,
            toDirection: bEndpoint.direction,
        };
    }
    findEdgeByKey(edgeKey) {
        var _a;
        return ((_a = this.graph.edges.find(edge => this.edgeKey(edge) === edgeKey)) !== null && _a !== void 0 ? _a : null);
    }
    resolvePortFromKey(portKey) {
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
    effectKey(baseKey, channel) {
        return `${baseKey}::${channel}`;
    }
    portRefFromKey(portKey) {
        const split = portKey.indexOf(':');
        if (split === -1) {
            return null;
        }
        return {
            nodeId: portKey.slice(0, split),
            portId: portKey.slice(split + 1),
        };
    }
    lerp(a, b, t) {
        return a + (b - a) * t;
    }
    createUnitAnimation(duration, options) {
        return new animation_1.Animation({
            initialValue: 0,
            targetValue: 1,
            mode: animation_1.AnimationMode.Trigger,
            repeat: animation_1.RepeatMode.Once,
            duration,
            ...options,
        });
    }
    selectNode(nodeId) {
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
    findIncomingEdgeForPort(portRef) {
        var _a;
        return ((_a = this.graph.edges.find(edge => this.portRefEq(edge.b, portRef))) !== null && _a !== void 0 ? _a : null);
    }
    findEdge(a, b) {
        var _a;
        return ((_a = this.graph.edges.find(edge => (this.portRefEq(edge.a, a) && this.portRefEq(edge.b, b)) ||
            (this.portRefEq(edge.a, b) && this.portRefEq(edge.b, a)))) !== null && _a !== void 0 ? _a : null);
    }
    edgeExists(a, b) {
        return this.findEdge(a, b) !== null;
    }
    normalizeEdgeEndpoints(a, b, data) {
        const aEndpoint = this.resolvePortEndpoint(a);
        const bEndpoint = this.resolvePortEndpoint(b);
        if (!aEndpoint || !bEndpoint) {
            return null;
        }
        if (aEndpoint.type === bEndpoint.type) {
            return null;
        }
        if (aEndpoint.type === enums_1.PortType.Output) {
            return { a: { ...a }, b: { ...b }, data };
        }
        return { a: { ...b }, b: { ...a }, data };
    }
    resolvePortEndpoint(portRef) {
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
    resolveNodeAndPort(portRef) {
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
    resolvePortPosition(node, port) {
        const nodePortsSameSide = node.ports.filter(p => p.side === port.side);
        const index = nodePortsSameSide.findIndex(p => p.id === port.id);
        const state = this.ensureNodeState(node);
        switch (port.side) {
            case enums_1.PortSide.Top:
                return vec_1.vec2.add(state.actualPosition, (0, vec_1.vec2)(((index + 1) / (nodePortsSameSide.length + 1)) * state.actualSize.x, 0));
            case enums_1.PortSide.Right:
                return vec_1.vec2.add(state.actualPosition, (0, vec_1.vec2)(state.actualSize.x, ((index + 1) / (nodePortsSameSide.length + 1)) * state.actualSize.y));
            case enums_1.PortSide.Bottom:
                return vec_1.vec2.add(state.actualPosition, (0, vec_1.vec2)(((index + 1) / (nodePortsSameSide.length + 1)) * state.actualSize.x, state.actualSize.y));
            case enums_1.PortSide.Left:
            default:
                return vec_1.vec2.add(state.actualPosition, (0, vec_1.vec2)(0, ((index + 1) / (nodePortsSameSide.length + 1)) * state.actualSize.y));
        }
    }
    directionFromSide(side) {
        return {
            [enums_1.PortSide.Top]: (0, vec_1.vec2)(0, -1),
            [enums_1.PortSide.Right]: (0, vec_1.vec2)(1, 0),
            [enums_1.PortSide.Bottom]: (0, vec_1.vec2)(0, 1),
            [enums_1.PortSide.Left]: (0, vec_1.vec2)(-1, 0),
        }[side];
    }
    ensureNodeState(node) {
        const existing = this.nodeState.get(node.id);
        if (existing) {
            return existing;
        }
        const state = {
            hovered: false,
            selected: false,
            dragging: false,
            resizing: false,
            resizeHovered: false,
            deleteHovered: false,
            dragOffset: (0, vec_1.vec2)(),
            resizeOffset: (0, vec_1.vec2)(),
            actualPosition: (0, vec_1.vec2)(node.position),
            actualSize: (0, vec_1.vec2)(node.size),
        };
        this.nodeState.set(node.id, state);
        return state;
    }
    ensureEdgeState(edge) {
        const key = this.edgeKey(edge);
        const existing = this.edgeState.get(key);
        if (existing) {
            return existing;
        }
        const state = {
            hovered: false,
        };
        this.edgeState.set(key, state);
        return state;
    }
    ensurePortState(nodeId, portId, side) {
        const key = this.portKey(nodeId, portId);
        const existing = this.portState.get(key);
        if (existing) {
            return existing;
        }
        const state = {
            position: (0, vec_1.vec2)(),
            direction: this.directionFromSide(side),
            hovered: false,
            connectable: true,
            invalidReason: null,
        };
        this.portState.set(key, state);
        return state;
    }
    cloneGraph(graph) {
        return {
            nodes: graph.nodes.map(node => ({
                ...node,
                position: (0, vec_1.vec2)(node.position),
                size: (0, vec_1.vec2)(node.size),
                ports: node.ports.map(port => ({ ...port })),
            })),
            edges: graph.edges.map(edge => ({
                ...edge,
                a: { ...edge.a },
                b: { ...edge.b },
            })),
        };
    }
    portRefEq(a, b) {
        return a.nodeId === b.nodeId && a.portId === b.portId;
    }
    edgeKey(edge) {
        return `${edge.a.nodeId}:${edge.a.portId}->${edge.b.nodeId}:${edge.b.portId}`;
    }
    portKey(nodeId, portId) {
        return `${nodeId}:${portId}`;
    }
    effectiveNodeTheme(node) {
        return { ...this.options.theme, ...node.theme };
    }
    effectivePortTheme(port) {
        var _a;
        return { ...this.options.theme, ...((_a = port === null || port === void 0 ? void 0 : port.theme) !== null && _a !== void 0 ? _a : {}) };
    }
    effectiveEdgeTheme(edge) {
        return { ...this.options.theme, ...edge.theme };
    }
    createId(prefix) {
        if (typeof globalThis.crypto !== 'undefined' &&
            globalThis.crypto.randomUUID) {
            return globalThis.crypto.randomUUID();
        }
        return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    }
}
exports.default = GraphBuilder;
GraphBuilder.screen = (0, vec_1.vec2)();
GraphBuilder.inputInitialised = false;
//# sourceMappingURL=GraphBuilder.js.map