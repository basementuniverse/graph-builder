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
- [Nodes](#nodes)
  - [Creating nodes interactively](#creating-nodes-interactively)
  - [Creating nodes programmatically](#creating-nodes-programmatically)
  - [Removing nodes](#removing-nodes)
- [Edges](#edges)
  - [Creating edges programmatically](#creating-edges-programmatically)
  - [Removing edges](#removing-edges)
  - [Port connection validation](#port-connection-validation)
- [Serialization and deserialization](#serialization-and-deserialization)
  - [serialize / load](#serialize--load)
  - [serializeFull / loadFromDocument](#serializefull--loadfromdocument)
  - [serializeRaw / loadFromDomain](#serializeraw--loadfromdomain)
- [Graph traversal](#graph-traversal)
- [Layout algorithms](#layout-algorithms)
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
  label?: string;
  type: PortType;                  // PortType.Input | PortType.Output
  side: PortSide;                  // PortSide.Top | .Right | .Bottom | .Left
  theme?: Partial<PortTheme>;      // per-port visual overrides (see Per-element theming)
  edgeTheme?: Partial<EdgeTheme>;  // theme applied to edges originating from this port
  data?: TPortData;
};
```

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

Walk the graph from a starting node. The visitor callback receives each `Node` and its depth. Return a `VisitorControl` object to steer traversal:

```ts
builder.traverseBFS('node-1', (node, depth) => {
  console.log(depth, node.label);

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
| `nodeSelected` | `{ nodeId }` | No |
| `edgeCreating` | `{ edge }` | Yes |
| `edgeCreated` | `{ edge }` | No |
| `edgeRemoving` | `{ edge }` | Yes |
| `edgeRemoved` | `{ edge }` | No |
| `edgeConnectionRejected` | `{ from, to, reason }` | No |
| `graphLoaded` | `{ graph }` | No |
| `graphCleared` | `{}` | No |
| `graphArranged` | `{ strategy }` | No |
| `graphArrangementFailed` | `{ strategy, reason }` | No |
| `toolChanged` | `{ from, to }` | No |

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

    // Node label
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

    // Edges
    edgeColor: 'rgba(255,255,255,0.2)',
    edgeHoveredColor: 'rgba(255,255,255,0.5)',
    edgeLineWidth: 3,
    edgeHoverOutlineColor: 'rgba(255,255,255,0.1)',
    edgeHoverOutlineLineWidth: 10,

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

Every visual element can be replaced with a custom drawing routine. Provide callbacks via the `callbacks` option. The canvas `context` has the camera transform pre-applied, so coordinates are in world space.

```ts
const builder = new GraphBuilder(canvas, {
  callbacks: {
    // Custom node background
    drawNodeFrame(context, { node, position, size, hovered, selected }) {
      context.fillStyle = selected ? '#4a90d9' : hovered ? '#3a7abf' : '#2c5f8a';
      context.beginPath();
      context.roundRect(position.x, position.y, size.x, size.y, 8);
      context.fill();
    },

    // Custom node label / content
    drawNodeContent(context, { node, position, size }) {
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

    // Custom edge curve
    drawEdge(context, { from, to, fromDirection, toDirection, hovered }) {
      const cp1 = { x: from.x + fromDirection.x * 80, y: from.y + fromDirection.y * 80 };
      const cp2 = { x: to.x + toDirection.x * 80,   y: to.y + toDirection.y * 80   };
      context.strokeStyle = hovered ? '#fff' : '#888';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, to.x, to.y);
      context.stroke();
    },

    // Custom grid dot
    drawGridDot(context, { position, gridSize }) {
      context.fillStyle = 'rgba(255,255,255,0.06)';
      context.fillRect(position.x - 1, position.y - 1, 2, 2);
    },
  },
});
```

Available callbacks: `drawGridDot`, `drawNodeFrame`, `drawNodeContent`, `drawDeleteButton`, `drawResizeHandle`, `drawPort`, `drawEdge`, `drawEdgePreview`.

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
