# @basementuniverse/graph-builder

A canvas-based graph builder engine for directed or undirected node-edge graphs.

## Install

```bash
npm install @basementuniverse/graph-builder
```

## TypeScript / Node usage

```ts
import { GraphBuilder, vec2, type NodeTypeDefinition } from '@basementuniverse/graph-builder';

const nodeTypes: NodeTypeDefinition[] = [
	{
		type: 'number',
		inputs: [{ id: 'in', kind: 'number' }],
		outputs: [{ id: 'out', kind: 'number' }],
	},
];

const builder = new GraphBuilder({
	mode: 'directed',
	nodeTypes,
	constraints: {
		number: ['number'],
	},
	snapToGrid: true,
	gridSize: 32,
});

const canvas = document.querySelector('canvas');
if (canvas) {
	builder.mount(canvas);
}

builder.addNode({
	id: 'n1',
	type: 'number',
	position: vec2(120, 80),
	data: { value: 1 },
});

builder.addNode({
	id: 'n2',
	type: 'number',
	position: vec2(420, 180),
	data: { value: 2 },
});

builder.addEdge({
	id: 'e1',
	from: { nodeId: 'n1', portId: 'out', direction: 'output' },
	to: { nodeId: 'n2', portId: 'in', direction: 'input' },
});
```

## Browser usage

Include `build/index.browser.js` and access `GraphBuilder` from the global:

```html
<script src="./build/index.browser.js"></script>
<script>
	const builder = new GraphBuilder.GraphBuilder({
		mode: 'directed',
		nodeTypes: [
			{
				type: 'number',
				inputs: [{ id: 'in', kind: 'number' }],
				outputs: [{ id: 'out', kind: 'number' }],
			},
		],
		constraints: { number: ['number'] },
	});

	const canvas = document.querySelector('canvas');
	if (canvas) {
		builder.mount(canvas);
	}
</script>
```

## Custom port rendering

Use `drawPort` to override port visuals while keeping built-in interaction state (hover, connectable, draft source/target).

```ts
import {
	GraphBuilder,
	vec2,
	type PortDrawContext,
	type NodeTypeDefinition,
} from '@basementuniverse/graph-builder';

const nodeTypes: NodeTypeDefinition[] = [
	{
		type: 'number',
		inputs: [{ id: 'in', kind: 'number' }],
		outputs: [{ id: 'out', kind: 'number' }],
	},
];

const builder = new GraphBuilder({
	nodeTypes,
	drawPort: ({ context, position, radius, direction, interaction }: PortDrawContext) => {
		context.save();
		context.beginPath();
		context.arc(position.x, position.y, radius, 0, Math.PI * 2);

		context.fillStyle = direction === 'output' ? '#f5a34b' : '#53b5f5';
		if (interaction.draftSource) context.fillStyle = '#f7d26c';
		if (interaction.draftTarget) context.fillStyle = '#7df56c';
		context.fill();

		context.strokeStyle = interaction.hovered ? '#ffffff' : '#1b1b1b';
		context.lineWidth = 2;
		context.stroke();
		context.restore();
	},
});

builder.addNode({
	id: 'n1',
	type: 'number',
	position: vec2(100, 100),
});
```

## Build outputs

- `build/index.js` (CJS)
- `build/index.esm.js` (ESM)
- `build/index.browser.js` (browser IIFE bundle)
- `build/index.d.ts` (types)
