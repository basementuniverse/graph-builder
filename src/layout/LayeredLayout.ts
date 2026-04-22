import { vec2 } from '@basementuniverse/vec';
import { DEFAULT_LAYERED_LAYOUT_OPTIONS } from '../constants';
import type {
  Graph,
  LayeredLayoutOptions,
  LayeredLayoutResult,
} from '../types';
import { topologicalSort, toPosition } from '../utils';

export async function layoutLayered<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
>(
  graph: Graph<TNodeData, TEdgeData, TPortData>,
  options: Partial<LayeredLayoutOptions> = {}
): Promise<LayeredLayoutResult | null> {
  const settings = { ...DEFAULT_LAYERED_LAYOUT_OPTIONS, ...options };
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
