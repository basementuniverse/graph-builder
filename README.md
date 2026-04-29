# @basementuniverse/graph-builder

A canvas-based graph builder and editor.

## Install

```bash
npm install @basementuniverse/graph-builder
```

## How to use

- [Initialisation](#initialisation)
- [Options reference](#options-reference)
- [Tool modes](#tool-modes)
- [Camera controls](#camera-controls)
- [Nodes](#nodes)
  - [Creating nodes interactively](#creating-nodes-interactively)
  - [Creating nodes programmatically](#creating-nodes-programmatically)
  - [Removing nodes](#removing-nodes)
  - [Updating node and port data](#updating-node-and-port-data)
- [Edges](#edges)
  - [Creating edges programmatically](#creating-edges-programmatically)
  - [Removing edges](#removing-edges)
  - [Updating edge data](#updating-edge-data)
  - [Port connection validation](#port-connection-validation)
- [Serialization and deserialization](#serialization-and-deserialization)
  - [serialize / load](#serialize--load)
  - [serializeFull / loadFromDocument](#serializefull--loadfromdocument)
  - [serializeRaw / loadFromDomain](#serializeraw--loadfromdomain)
- [Graph traversal](#graph-traversal)
- [Layout algorithms](#layout-algorithms)
- [Animation effects](#animation-effects)
- [Event handling](#event-handling)
- [Theming](#theming)
  - [Global theme](#global-theme)
  - [Per-element theming](#per-element-theming)
- [Custom rendering callbacks](#custom-rendering-callbacks)
- [Capabilities](#capabilities)
- [Lifecycle](#lifecycle)

---

### Initialisation

`GraphBuilder` requires an HTML `<canvas>` element. Pass the element (or its result from `document.getElementById`) to the constructor:

```html
<canvas id="graph" style="width: 100%; height: 600px;"></canvas>
```

```ts
import GraphBuilder from '@basementuniverse/graph-builder';

const builder = new GraphBuilder(document.getElementById('graph'));
```

By default the loop starts automatically and the canvas background colour and other visual properties are applied immediately. Call `stop()` / `start()` if you need manual control over the render loop.

---

### Options reference

All options are optional.

```ts
const builder = new GraphBuilder(canvas, {
  // Size of the background grid in world units (default: 32)
  gridSize: 32,

  // Snap node positions and sizes to the grid when dragging/resizing (default: false)
  snapToGrid: false,

  // Show the background grid (default: true)
  showGrid: true,

  // Start the render loop immediately (default: true)
  autoStart: true,

  // Override camera settings (see @basementuniverse/camera)
  camera: {
    minScale: 0.5,
    maxScale: 5,
  },

  // Partial theme overrides (see Theming section)
  theme: {
    backgroundColor: '#1e1e1e',
  },

  // Runtime-only animation effect defaults (see Animation effects)
  effects: {
    enabled: true,
    timeScale: 1,
    edgeDash: {
      speed: 110,
      dashPattern: [10, 6],
    },
    edgeDot: {
      duration: 0.5,
      animation: {
        interpolationFunction: 'linear',
      },
    },
    portPulse: {
      duration: 0.5,
      animation: {
        interpolationFunction: 'ease-out-cubic',
      },
    },
  },

  // Custom rendering callbacks (see Custom rendering callbacks section)
  callbacks: {},

  // Disable specific user interactions (see Capabilities section)
  capabilities: {
    createNodes: true,
    createEdges: true,
    deleteNodes: true,
    deleteEdges: true,
    resizeNodes: true,
    moveNodes: true,
  },

  // Allow connections from an output to an input on the same node (default: false)
  allowSelfConnection: false,

  // Validate a port connection before it is finalised (see Port connection validation)
  canConnectPorts: ({ fromNode, fromPort, toNode, toPort, edge }) => ({
    allowed: true,
  }),
});
```

`GraphBuilder` is generic. Provide custom data types for nodes, edges, and ports:

```ts
type NodeData = { title: string; color: string };
type EdgeData = { weight: number };
type PortData = { schema: string };

const builder = new GraphBuilder<NodeData, EdgeData, PortData>(canvas);
```

---

### Tool modes

The active tool controls how mouse interactions are interpreted. Switch tools programmatically with `setTool()`:

```ts
import { ToolMode } from '@basementuniverse/graph-builder';

builder.setTool(ToolMode.Select);     // click to select / move nodes
builder.setTool(ToolMode.Pan);        // drag to pan the camera
builder.setTool(ToolMode.CreateNode); // click to place a new node
builder.setTool(ToolMode.CreateEdge); // drag from a port to create an edge
```

Pass `remember = true` as a second argument to be able to restore the previous tool with `resetTool()`:

```ts
builder.setTool(ToolMode.Pan, true);
// ... later
builder.resetTool(); // returns to the tool that was active before
```

The camera can also be panned by holding `Space` (which temporarily switches to `Pan` mode and restores the previous tool on release), using `W/A/S/D` or the arrow keys, and zoomed with the scroll wheel.

---

### Camera controls

You can read or change the camera position and zoom level at runtime:

```ts
import { vec2 } from '@basementuniverse/vec';

// Read current camera state
const position = builder.getCameraPosition(); // vec2
const zoom = builder.getCameraZoom();         // number

// Set absolute camera state
builder.setCameraPosition(vec2(400, 200));
builder.setCameraZoom(1.25);

// Apply relative movement
builder.panCamera(vec2(120, -40));
builder.zoomCamera(0.2);  // zoom in
builder.zoomCamera(-0.1); // zoom out
```

`setCameraZoom()` and `zoomCamera()` require finite numbers. Zoom still respects your configured camera limits (`minScale` / `maxScale`).

---

### Nodes

#### Node shape

A `Node` has the following shape:

```ts
type Node<TNodeData = unknown, TPortData = unknown> = {
  id: string;                    // auto-generated when using createNode()
  position: vec2;                // world-space top-left corner
  size: vec2;                    // width × height
  label?: string;                // optional display label
  ports: Port[];                 // connection points
  resizable?: boolean;           // show resize handle (default: true)
  deletable?: boolean;           // show delete button (default: true)
  theme?: Partial<NodeTheme>;    // per-node visual overrides (see Per-element theming)
  data?: TNodeData;              // arbitrary custom data
};
```

Ports are defined with:

```ts
import { PortSide, PortType } from '@basementuniverse/graph-builder';

type Port<TPortData = unknown> = {
  id: string;
  label?: string;                   // rendered by default near the port
  type: PortType;                  // PortType.Input | PortType.Output
  side: PortSide;                  // PortSide.Top | .Right | .Bottom | .Left
  theme?: Partial<PortTheme>;      // per-port visual overrides (see Per-element theming)
  edgeTheme?: Partial<EdgeTheme>;  // theme applied to edges originating from this port
  data?: TPortData;
};
```

Port labels are positioned automatically from port direction: top ports render labels below, bottom ports above, left ports to the right, and right ports to the left.

#### Creating nodes interactively

Set the tool to `CreateNode` and provide a **node template** — a `Node` definition without `id` and `position` (those are filled in when the user clicks):

```ts
builder.setCreateNodeTemplate({
  label: 'New Node',
  size: { x: 180, y: 100 },
  resizable: true,
  deletable: true,
  ports: [
    { id: 'in',  type: PortType.Input,  side: PortSide.Left  },
    { id: 'out', type: PortType.Output, side: PortSide.Right },
  ],
});

builder.setTool(ToolMode.CreateNode);
```

Every click on the canvas places a new node at that position.

#### Creating nodes programmatically

```ts
import { vec2 } from '@basementuniverse/vec';

const node = builder.createNode(
  vec2(200, 150), // world-space position
  {               // optional template — overrides the active template
    label: 'My Node',
    size: { x: 200, y: 120 },
    ports: [
      { id: 'in',  type: PortType.Input,  side: PortSide.Left  },
      { id: 'out', type: PortType.Output, side: PortSide.Right },
    ],
  }
);
// node.id is now available
```

To add a fully-formed `Node` object (e.g. restored from storage):

```ts
const added = builder.addNode({
  id: 'node-1',
  position: { x: 100, y: 100 },
  size: { x: 200, y: 120 },
  ports: [
    { id: 'out', type: PortType.Output, side: PortSide.Right },
  ],
});
// returns false if a node with that id already exists
```

#### Removing nodes

```ts
const removed = builder.removeNode('node-1');
// returns false if the node doesn't exist or deletion was cancelled by an event handler
```

Removing a node also removes all edges connected to it. The `deleteNodes` capability must be enabled (it is by default).

#### Updating node and port data

You can replace data directly with `set*Data()` or derive new data from the current value using `update*Data()`.

```ts
// Replace node data
builder.setNodeData('node-1', { title: 'Updated title', color: '#00aaff' });

// Derive node data from existing value
builder.updateNodeData('node-1', current => ({
  ...(current ?? { title: 'Untitled', color: '#999999' }),
  title: 'Processed',
}));

// Replace port data
builder.setPortData(
  { nodeId: 'node-1', portId: 'in' },
  { schema: 'number' }
);

// Derive port data from existing value
builder.updatePortData(
  { nodeId: 'node-1', portId: 'in' },
  current => ({
    ...(current ?? { schema: 'unknown' }),
    schema: 'string',
  })
);
```

All four methods return `false` when the target node/port cannot be found.

---

### Edges

An `Edge` connects two ports:

```ts
type Edge<TEdgeData = unknown> = {
  a: { nodeId: string; portId: string };
  b: { nodeId: string; portId: string };
  theme?: Partial<EdgeTheme>;  // per-edge visual overrides (see Per-element theming)
  data?: TEdgeData;
};
```

#### Creating edges interactively

Set the tool to `CreateEdge`, then drag from an output port to an input port. By default, self-connections (an output connected to an input on the same node) are rejected; set `allowSelfConnection: true` to enable them. The `canConnectPorts` option (see below) is called before the edge is finalised.

#### Creating edges programmatically

```ts
const created = builder.createEdge(
  { nodeId: 'node-1', portId: 'out' },
  { nodeId: 'node-2', portId: 'in'  },
  { weight: 1.0 } // optional edge data
);
// returns false if the edge already exists, connection is invalid
// (including disallowed self-connection), or was cancelled
```

#### Removing edges

```ts
const removed = builder.removeEdge(
  { nodeId: 'node-1', portId: 'out' },
  { nodeId: 'node-2', portId: 'in'  }
);
```

#### Updating edge data

```ts
// Replace edge data
builder.setEdgeData(
  { nodeId: 'node-1', portId: 'out' },
  { nodeId: 'node-2', portId: 'in' },
  { weight: 2.5 }
);

// Derive edge data from existing value
builder.updateEdgeData(
  { nodeId: 'node-1', portId: 'out' },
  { nodeId: 'node-2', portId: 'in' },
  current => ({
    ...(current ?? { weight: 0 }),
    weight: (current?.weight ?? 0) + 1,
  })
);
```

Both methods return `false` when the edge cannot be found.

#### Port connection validation

Supply a `canConnectPorts` callback to impose custom rules. This callback is used for both interactive edge creation and `createEdge()`:

```ts
const builder = new GraphBuilder(canvas, {
  canConnectPorts: ({ fromPort, toPort }) => {
    if (fromPort.type === toPort.type) {
      return { allowed: false, reason: 'Cannot connect two ports of the same type' };
    }
    return { allowed: true };
  },
});
```

The callback receives the full `Node` and `Port` objects for both ends of the prospective connection. Return `{ allowed: false, reason: '...' }` to reject it — the port will be highlighted in red and an `edgeConnectionRejected` event will be emitted.

---

### Serialization and deserialization

Three serialization formats are available, each suited to a different use-case.

#### `serialize` / `load`

Serializes the full graph (nodes, edges, ports, positions, sizes) without camera/layout state. Use this to persist the graph structure:

```ts
// Save
const graph = builder.serialize(); // or builder.getGraph()
localStorage.setItem('graph', JSON.stringify(graph));

// Restore
const graph = JSON.parse(localStorage.getItem('graph')!);
builder.load(graph);
```

#### `serializeFull` / `loadFromDocument`

Includes everything in `serialize` **plus** the camera position/zoom and the currently selected node. Ideal for saving and restoring the full editor session:

```ts
// Save
const doc = builder.serializeFull();
localStorage.setItem('doc', JSON.stringify(doc));

// Restore
const doc = JSON.parse(localStorage.getItem('doc')!);
builder.loadFromDocument(doc);
```

#### `serializeRaw` / `loadFromDomain`

Strips all visual information (position, size, ports) and keeps only `id` and `data` for nodes and edges. Use this when you want to store only your domain data and reconstruct the visual layout on load:

```ts
// Save — only domain/business data
const domain = builder.serializeRaw();
api.saveDomain(domain);

// Restore — supply a resolveNode callback to rebuild the visual shape
builder.loadFromDomain(domain, {
  resolveNode: (domainNode) => ({
    label: domainNode.data.title,
    size: { x: 200, y: 100 },
    ports: [
      { id: 'in',  type: PortType.Input,  side: PortSide.Left  },
      { id: 'out', type: PortType.Output, side: PortSide.Right },
    ],
  }),
});
```

---

### Graph traversal

#### `getNeighbors`

Returns the direct neighbours of a node:

```ts
import { TraversalDirection } from '@basementuniverse/graph-builder';

const neighbors = builder.getNeighbors('node-1');
// TraversalDirection.In  — nodes with edges pointing into node-1
// TraversalDirection.Out — nodes node-1 points to
// TraversalDirection.Both — all adjacent nodes (default)
const outgoing = builder.getNeighbors('node-1', TraversalDirection.Out);
```

#### `traverseBFS` / `traverseDFS`

Walk the graph from a starting node. The visitor callback receives a traversal-hydrated node and its depth.

The hydrated node includes:

- `adjacentNodes`: unique nodes connected by an incoming or outgoing edge
- `adjacentEdges`: connected edges where each edge has `otherNode`
- `ports[]`: each port includes `connectedEdge` (first match or `null`) and `connectedEdges` (all matches), and each connected edge has `otherNode`

Return a `VisitorControl` object to steer traversal:

```ts
builder.traverseBFS('node-1', (node, depth) => {
  console.log(depth, node.label);

  // Per-port connection access
  const outPort = node.ports.find(port => port.id === 'out');
  const next = outPort?.connectedEdge?.otherNode;
  if (next) {
    console.log('Primary downstream node:', next.id);
  }

  // All adjacent nodes/edges for the current node
  for (const adjacent of node.adjacentNodes) {
    console.log('Adjacent node:', adjacent.id);
  }

  if (node.id === 'stop-here') {
    return { stop: true }; // abort the entire traversal
  }

  if (depth >= 2) {
    return { skip: true }; // don't traverse children of this node
  }
});
```

`traverseDFS` has the same signature.

Both methods accept an optional `TraversalDirection` as the third argument.

#### `traverseTopological`

Walk the graph in dependency-safe topological order.

- Returns `null` immediately if the graph contains a cycle
- Traverses all disconnected DAG components
- The callback receives the same traversal-hydrated node shape used by `traverseBFS` / `traverseDFS`

```ts
const result = builder.traverseTopological((node, depth) => {
  console.log('visit', depth, node.id);

  if (node.id === 'stop-here') {
    return { stop: true };
  }
});

if (result === null) {
  console.error('Cannot traverse topologically because the graph contains a cycle');
}
```

#### `topologicalSort`

Returns a topologically sorted array of node IDs, or `null` if the graph contains cycles:

```ts
const order = builder.topologicalSort();
if (order) {
  console.log('Execution order:', order);
}
```

#### `hasCycle`

```ts
if (builder.hasCycle()) {
  console.warn('Graph contains a cycle');
}
```

---

### Layout algorithms

Two automatic layout strategies are built in. Both update node positions with eased animations.

#### Force-directed layout

Suitable for general graphs. Nodes repel each other while edges act as springs:

```ts
const result = await builder.arrangeForceDirected({
  iterations: 120,          // max simulation steps
  timeBudgetMs: undefined,  // optional wall-clock time cap (ms)
  repulsionStrength: 15000,
  attractionStrength: 0.02,
  minNodeSpacing: 120,
  damping: 0.85,
  maxStep: 16,
});

console.log(result.converged, result.iterationsCompleted);
```

#### Layered layout

For directed acyclic graphs (DAGs). Nodes are arranged in layers. Returns `null` if the graph contains cycles:

```ts
import { LayeredLayoutDirection } from '@basementuniverse/graph-builder';

const result = await builder.arrangeLayered({
  direction: LayeredLayoutDirection.TopDown, // TopDown | BottomUp | LeftRight | RightLeft
  layerSpacing: 220,
  nodeSpacing: 180,
});

if (!result) {
  console.error('Layout failed — graph contains a cycle');
}
```

#### `arrangeGraph`

A unified method for either strategy:

```ts
await builder.arrangeGraph('forceDirected', { iterations: 80 });
await builder.arrangeGraph('layered', { direction: LayeredLayoutDirection.LeftRight });
```

#### `snapAllToGrid`

Rounds all node positions and/or sizes to the nearest grid boundary:

```ts
builder.snapAllToGrid({ snapPositions: true, snapSizes: true });
```

---

### Animation effects

`GraphBuilder` includes a low-level runtime-only effects API for animating edges and ports. These effects are not tied to any execution model, so you can trigger them from your own update loop, async jobs, evaluation engine, or UI handlers.

Effects are exposed through `builder.effects`:

```ts
builder.effects.edgeDash;
builder.effects.edgeDot;
builder.effects.portPulse;
builder.effects.global;
```

#### Runtime-only behavior

Effects are purely visual runtime state. They are **not** included in `serialize()`, `serializeFull()`, or `serializeRaw()`. They are cleared automatically when you call `load()`, `dispose()`, `removeNode()`, or `removeEdge()`.

#### Global controls

```ts
builder.effects.global.setEnabled(true);
builder.effects.global.setTimeScale(1);
builder.effects.global.pause();
builder.effects.global.resume();
builder.effects.global.clearAll();
```

#### Edge dashed flow

Use this for a continuous scrolling dash effect while some process is active.

```ts
const target = {
  a: { nodeId: 'source', portId: 'out' },
  b: { nodeId: 'worker', portId: 'in' },
};

builder.effects.edgeDash.start(target, {
  speed: 140,
  dashPattern: [12, 8],
  color: '#7dd3fc',
  opacity: 0.9,
});

builder.effects.edgeDash.stop(target);
```

Available methods:

```ts
builder.effects.edgeDash.get(target, channel?);
builder.effects.edgeDash.set(target, patch, channel?);
builder.effects.edgeDash.start(target, patch?, channel?);
builder.effects.edgeDash.stop(target, channel?);
builder.effects.edgeDash.clear(target?, channel?);
```

#### Edge moving dot

Use this for one-shot packets or repeated value movement along an edge.

```ts
const target = {
  a: { nodeId: 'source', portId: 'out' },
  b: { nodeId: 'worker', portId: 'in' },
};

// One-shot packet
builder.effects.edgeDot.trigger(target, {
  duration: 0.45,
  radius: 5,
  color: '#fde047',
  animation: {
    interpolationFunction: 'ease-in-out-cubic',
  },
});

// Looping stream while running
builder.effects.edgeDot.start(target, {
  spawnInterval: 0.12,
  radius: 4,
});

builder.effects.edgeDot.stop(target);
```

Available methods:

```ts
builder.effects.edgeDot.get(target, channel?);
builder.effects.edgeDot.set(target, patch, channel?);
builder.effects.edgeDot.trigger(target, patch?, channel?);
builder.effects.edgeDot.start(target, patch?, channel?);
builder.effects.edgeDot.stop(target, channel?);
builder.effects.edgeDot.clear(target?, channel?);
```

`trigger()` returns a handle that can be stopped manually:

```ts
const handle = builder.effects.edgeDot.trigger(target);
handle?.stop();
```

#### Port pulse

Use this for port activity, received values, acknowledgements, or user feedback.

```ts
builder.effects.portPulse.trigger(
  { nodeId: 'worker', portId: 'in' },
  {
    duration: 0.35,
    fromRadius: 10,
    toRadius: 28,
    color: '#66ccff',
    animation: {
      interpolationFunction: 'ease-out-cubic',
    },
  }
);
```

Available methods:

```ts
builder.effects.portPulse.trigger(target, patch?, channel?);
builder.effects.portPulse.clear(target?, channel?);
```

#### Channels

All effect methods accept an optional `channel` string. Channels let you run separate effect streams on the same edge or port without them interfering with each other.

```ts
builder.effects.edgeDash.start(target, { color: '#7dd3fc' }, 'execution');
builder.effects.edgeDash.start(target, { color: '#f97316' }, 'preview');
builder.effects.edgeDash.stop(target, 'preview');
```

#### Effect options

Constructor-level defaults live under `effects`:

```ts
const builder = new GraphBuilder(canvas, {
  effects: {
    enabled: true,
    timeScale: 1,
    maxEdgeDotInstances: 200,
    maxPortPulseInstances: 400,
    edgeDash: {
      running: false,
      speed: 110,
      dashPattern: [10, 6],
      lineWidth: 3,
      color: '#7dd3fc',
      opacity: 0.9,
      blendMode: 'source-over',
      phase: 0,
    },
    edgeDot: {
      running: false,
      loop: false,
      duration: 0.5,
      spawnInterval: 0.2,
      radius: 4,
      color: '#fde047',
      opacity: 1,
      blendMode: 'source-over',
      animation: {
        interpolationFunction: 'linear',
      },
    },
    portPulse: {
      duration: 0.5,
      fromRadius: 10,
      toRadius: 30,
      lineWidth: 2,
      color: '#66ccff',
      maxOpacity: 0.8,
      blendMode: 'source-over',
      animation: {
        interpolationFunction: 'ease-out-cubic',
      },
    },
  },
});
```

For edge dots and port pulses, the nested `animation` field passes through to `@basementuniverse/animation` for one-shot interpolation. Supported options are `delay`, `clamp`, `round`, `easeAmount`, `interpolationFunction`, and `interpolationFunctionParameters`.

---

### Event handling

Subscribe to events with `on()`. Most events provide read-only copies of the affected objects.

```ts
const unsubscribe = builder.on('nodeCreated', ({ node }) => {
  console.log('Node created:', node.id);
});

// Unsubscribe when no longer needed
unsubscribe();
```

Use `once()` for a one-time handler, and `off()` to remove a specific handler:

```ts
builder.once('graphLoaded', ({ graph }) => {
  console.log('Graph loaded with', graph.nodes.length, 'nodes');
});

const handler = (payload) => console.log(payload);
builder.on('nodeMoved', handler);
builder.off('nodeMoved', handler);
```

#### Cancellable events

The events `nodeCreating`, `nodeRemoving`, `edgeCreating`, and `edgeRemoving` are **cancellable**. Return `false` from the handler to prevent the operation:

```ts
builder.on('nodeCreating', ({ position, template }) => {
  if (tooManyNodes()) {
    return false; // cancel creation
  }
});

builder.on('edgeRemoving', ({ edge }) => {
  if (isProtectedEdge(edge)) {
    return false; // cancel deletion
  }
});
```

#### Event reference

| Event | Payload | Cancellable |
|---|---|---|
| `nodeCreating` | `{ position, template }` | Yes |
| `nodeCreated` | `{ node }` | No |
| `nodeRemoving` | `{ nodeId, node }` | Yes |
| `nodeRemoved` | `{ nodeId, node }` | No |
| `nodeMoved` | `{ nodeId, from, to }` | No |
| `nodeResized` | `{ nodeId, from, to }` | No |
| `nodeDataUpdated` | `{ nodeId, from, to, node }` | No |
| `nodeSelected` | `{ nodeId }` | No |
| `portDataUpdated` | `{ nodeId, portId, from, to, node, port }` | No |
| `edgeCreating` | `{ edge }` | Yes |
| `edgeCreated` | `{ edge }` | No |
| `edgeRemoving` | `{ edge }` | Yes |
| `edgeRemoved` | `{ edge }` | No |
| `edgeDataUpdated` | `{ from, to, edge }` | No |
| `edgeConnectionRejected` | `{ from, to, reason }` | No |
| `graphLoaded` | `{ graph }` | No |
| `graphCleared` | `{}` | No |
| `graphArranged` | `{ strategy }` | No |
| `graphArrangementFailed` | `{ strategy, reason }` | No |
| `toolChanged` | `{ from, to }` | No |
| `effectStarted` | `{ kind, channel, target, id? }` | No |
| `effectStopped` | `{ kind, channel, target, id? }` | No |
| `effectCompleted` | `{ kind, channel, target, id? }` | No |
| `effectCleared` | `{ kind, channel, target, id? }` | No |

---

### Theming

#### Global theme

Pass a partial `theme` object to the constructor to override individual visual properties. All values are CSS colour strings unless noted:

```ts
const builder = new GraphBuilder(canvas, {
  theme: {
    // Canvas background
    backgroundColor: '#1e1e2e',

    // Grid
    gridDotColor: 'rgba(255,255,255,0.08)',
    gridDotLineWidth: 2,

    // Node frame
    nodeFillColor: 'rgba(255,255,255,0.1)',
    nodeSelectedFillColor: 'rgba(255,255,255,0.2)',
    nodeBorderColor: 'rgba(255,255,255,0.3)',
    nodeHoveredBorderColor: 'rgba(255,255,255,0.6)',
    nodeBorderWidth: 2,
    nodeBorderRadius: 10,
    nodePadding: 5,

    // Node label
    showNodeLabel: true,
    nodeLabelColor: 'rgba(255,255,255,0.8)',
    nodeLabelFont: 'bold 13px Inter, sans-serif',

    // Delete button (top-right corner of the node)
    deleteButtonColor: 'rgba(255,255,255,0.3)',
    deleteButtonHoveredColor: 'rgba(255,80,80,0.8)',
    deleteButtonLineWidth: 2,

    // Resize handle (bottom-right corner of the node)
    resizeHandleColor: 'rgba(255,255,255,0.15)',
    resizeHandleHoveredColor: 'rgba(255,255,255,0.4)',
    resizeHandleLineWidth: 2,

    // Ports
    portRadius: 8,
    portFillColor: 'rgba(255,255,255,0.15)',
    portHoveredFillColor: 'rgba(255,255,255,0.3)',
    portInvalidFillColor: 'rgba(255,50,50,0.2)',
    portBorderColor: 'rgba(255,255,255,0.3)',
    portHoveredBorderColor: 'rgba(255,255,255,0.8)',
    portInvalidBorderColor: '#ff6677',
    portBorderWidth: 2,
    portHoverRingColor: 'rgba(255,255,255,0.15)',
    portHoverRingLineWidth: 6,
    portHoverRingRadius: 12,
    portPulseColor: '#66ccff',
    portPulseLineWidth: 2,
    portPulseFromRadius: 10,
    portPulseToRadius: 30,
    portPulseMaxOpacity: 0.8,

    // Port label
    showPortLabel: true,
    portLabelOffset: 8,
    portLabelColor: 'rgba(255,255,255,0.8)',
    portLabelFont: '12px sans-serif',

    // Edges
    edgeColor: 'rgba(255,255,255,0.2)',
    edgeHoveredColor: 'rgba(255,255,255,0.5)',
    edgeLineWidth: 3,
    edgeHoverOutlineColor: 'rgba(255,255,255,0.1)',
    edgeHoverOutlineLineWidth: 10,
    edgeDashColor: '#7dd3fc',
    edgeDashLineWidth: 3,
    edgeDotColor: '#fde047',
    edgeDotRadius: 4,
    edgeDotOpacity: 1,

    // Edge preview (drawn while dragging to create a new edge)
    edgePreviewColor: 'rgba(255,255,255,0.5)',
    edgePreviewLineWidth: 3,
    edgePreviewOutlineColor: 'rgba(255,255,255,0.2)',
    edgePreviewOutlineLineWidth: 10,
  },
});
```

#### Per-element theming

Individual nodes, ports, and edges can each carry a `theme` property that overrides the global theme for that element alone. This lets you colour-code different parts of the graph without needing a custom rendering callback.

**Node** — supply `theme: Partial<NodeTheme>` on any node object:

```ts
builder.createNode(vec2(100, 100), {
  label: 'Important Node',
  size: { x: 200, y: 120 },
  ports: [
    { id: 'out', type: PortType.Output, side: PortSide.Right },
  ],
  theme: {
    nodeFillColor: 'rgba(40, 100, 200, 0.2)',
    nodeSelectedFillColor: 'rgba(40, 100, 200, 0.4)',
    nodeBorderColor: 'rgba(40, 100, 200, 0.4)',
    nodeHoveredBorderColor: 'rgba(40, 100, 200, 0.7)',
  },
});
```

**Port** — supply `theme: Partial<PortTheme>` and/or `edgeTheme: Partial<EdgeTheme>` on any port. `edgeTheme` is automatically inherited by edges that originate from that port:

```ts
{
  id: 'out-warn',
  type: PortType.Output,
  side: PortSide.Right,
  theme: {
    portFillColor: 'rgba(255, 140, 0, 0.2)',
    portHoveredFillColor: 'rgba(255, 140, 0, 0.4)',
    portBorderColor: 'rgba(255, 140, 0, 0.4)',
    portHoveredBorderColor: 'rgba(255, 140, 0, 0.8)',
  },
  edgeTheme: {
    edgeColor: 'rgba(255, 140, 0, 0.4)',
    edgeHoveredColor: 'rgba(255, 140, 0, 0.7)',
    edgeArrowColor: 'rgba(255, 140, 0, 0.6)',
  },
}
```

**Edge** — supply `theme: Partial<EdgeTheme>` directly on an edge for one-off overrides:

```ts
builder.createEdge(
  { nodeId: 'node-1', portId: 'out' },
  { nodeId: 'node-2', portId: 'in'  },
  undefined,           // edge data
  {                    // edge theme override
    edgeColor: 'rgba(200, 80, 80, 0.5)',
    edgeLineWidth: 4,
  }
);
```

> **Priority:** an edge's own `theme` takes highest precedence, followed by the source port's `edgeTheme`, then the global `theme`.

---

### Custom rendering callbacks

Every visual element can be customized with a drawing callback. Provide callbacks via the `callbacks` option. The canvas `context` has the camera transform pre-applied, so coordinates are in world space.

Each callback receives:

1. `context`: the canvas rendering context
2. `drawContext`: element-specific state (node, edge, hovered, positions, etc.)
3. `drawDefault()`: runs the built-in renderer for that element

Callbacks support two composition modes via `callbacks.renderModes`:

- `replace` (default): callback replaces built-in rendering unless it calls `drawDefault()` or returns `false`
- `overlay`: built-in rendering runs first, then callback runs

```ts
const builder = new GraphBuilder(canvas, {
  callbacks: {
    renderModes: {
      drawEdge: 'overlay', // keep default edge curve, then add custom overlay
    },

    // Custom node background
    drawNodeFrame(context, { node, position, size, hovered, selected }) {
      context.fillStyle = selected ? '#4a90d9' : hovered ? '#3a7abf' : '#2c5f8a';
      context.beginPath();
      context.roundRect(position.x, position.y, size.x, size.y, 8);
      context.fill();
    },

    // Custom node label / content for selected node types only.
    // Return false to fall back to default node label rendering.
    drawNodeContent(context, { node, position, size }) {
      if (node.data?.kind !== 'special') {
        return false;
      }

      context.fillStyle = '#fff';
      context.font = '13px sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(
        node.label ?? node.id,
        position.x + size.x / 2,
        position.y + size.y / 2
      );
    },

    // Custom port circle
    drawPort(context, { position, hovered, connectable }) {
      context.fillStyle = connectable
        ? (hovered ? '#fff' : '#aaa')
        : '#f55';
      context.beginPath();
      context.arc(position.x, position.y, 6, 0, Math.PI * 2);
      context.fill();
    },

    // Overlay a highlight on top of the default edge rendering.
    // In overlay mode the default renderer already ran first.
    drawEdge(context, { from, to, fromDirection, toDirection, hovered }) {
      const cp1 = { x: from.x + fromDirection.x * 80, y: from.y + fromDirection.y * 80 };
      const cp2 = { x: to.x + toDirection.x * 80,   y: to.y + toDirection.y * 80   };
      context.strokeStyle = hovered ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)';
      context.lineWidth = 6;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, to.x, to.y);
      context.stroke();
    },

    // Replace default grid dot completely.
    // Call drawDefault() if you want to include the built-in plus marker.
    drawGridDot(context, { position, gridSize }, drawDefault) {
      context.fillStyle = 'rgba(255,255,255,0.06)';
      context.fillRect(position.x - 1, position.y - 1, 2, 2);
    },
  },
});
```

Available callbacks: `drawGridDot`, `drawNodeFrame`, `drawNodeContent`, `drawDeleteButton`, `drawResizeHandle`, `drawPort`, `drawEdge`, `drawEdgePreview`.

Animation effect callbacks are also available: `drawEdgeDashEffect`, `drawEdgeDotEffect`, `drawPortPulseEffect`.

---

### Capabilities

Enable or disable individual user interactions at any time:

```ts
// At construction
const builder = new GraphBuilder(canvas, {
  capabilities: {
    createNodes: false,  // prevent the user from placing new nodes
    createEdges: true,
    deleteNodes: false,  // hide delete buttons
    deleteEdges: true,
    resizeNodes: false,  // hide resize handles
    moveNodes: true,
  },
});

// At runtime
builder.setCapabilities({ createNodes: true, deleteNodes: true });
```

> **Note:** `createNode()` and `removeNode()` called programmatically also respect these flags and will throw / return `false` if the corresponding capability is disabled.

---

### Lifecycle

```ts
// Start the render loop (called automatically unless autoStart: false)
builder.start();

// Stop the render loop (pauses updates and rendering)
builder.stop();

// Notify the builder that the canvas has been resized
// (called automatically on window resize)
builder.resize();

// Clear the graph and stop the loop, release internal state
builder.dispose();
```
