import { vec2 } from '@basementuniverse/vec';
import type { Graph } from '../types/Graph';
import { topologicalSort } from '../utils/Traversal';

export type LayeredLayoutDirection =
  | 'topDown'
  | 'bottomUp'
  | 'leftRight'
  | 'rightLeft';

export type LayeredLayoutOptions = {
  direction: LayeredLayoutDirection;
  layerSpacing: number;
  nodeSpacing: number;
};

export type LayeredLayoutResult = {
  nodePositions: Map<string, vec2>;
  layers: string[][];
  crossings: number;
};

const DEFAULT_OPTIONS: LayeredLayoutOptions = {
  direction: 'topDown',
  layerSpacing: 220,
  nodeSpacing: 180,
};

function toPosition(
  direction: LayeredLayoutDirection,
  layerIndex: number,
  nodeIndex: number,
  layerSpacing: number,
  nodeSpacing: number
): vec2 {
  switch (direction) {
    case 'bottomUp':
      return vec2(nodeIndex * nodeSpacing, -layerIndex * layerSpacing);
    case 'leftRight':
      return vec2(layerIndex * layerSpacing, nodeIndex * nodeSpacing);
    case 'rightLeft':
      return vec2(-layerIndex * layerSpacing, nodeIndex * nodeSpacing);
    case 'topDown':
    default:
      return vec2(nodeIndex * nodeSpacing, layerIndex * layerSpacing);
  }
}

export async function layoutLayered<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
>(
  graph: Graph<TNodeData, TEdgeData, TPortData>,
  options: Partial<LayeredLayoutOptions> = {}
): Promise<LayeredLayoutResult | null> {
  const settings = { ...DEFAULT_OPTIONS, ...options };
  const topo = topologicalSort(graph);
  if (!topo) {
    return null;
  }

  const incoming = new Map<string, Set<string>>();
  for (const node of graph.nodes) {
    incoming.set(node.id, new Set());
  }
  for (const edge of graph.edges) {
    incoming.get(edge.b.nodeId)?.add(edge.a.nodeId);
  }

  const layerByNode = new Map<string, number>();
  for (const nodeId of topo) {
    const parents = [...(incoming.get(nodeId) ?? new Set<string>())];
    if (parents.length === 0) {
      layerByNode.set(nodeId, 0);
      continue;
    }

    let layer = 0;
    for (const parent of parents) {
      layer = Math.max(layer, (layerByNode.get(parent) ?? 0) + 1);
    }
    layerByNode.set(nodeId, layer);
  }

  const layers: string[][] = [];
  for (const nodeId of topo) {
    const layer = layerByNode.get(nodeId) ?? 0;
    if (!layers[layer]) {
      layers[layer] = [];
    }
    layers[layer].push(nodeId);
  }

  const nodePositions = new Map<string, vec2>();
  for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
    const layer = layers[layerIndex];
    for (let nodeIndex = 0; nodeIndex < layer.length; nodeIndex++) {
      const nodeId = layer[nodeIndex];
      nodePositions.set(
        nodeId,
        toPosition(
          settings.direction,
          layerIndex,
          nodeIndex,
          settings.layerSpacing,
          settings.nodeSpacing
        )
      );
    }
    await Promise.resolve();
  }

  return {
    nodePositions,
    layers,
    crossings: 0,
  };
}
