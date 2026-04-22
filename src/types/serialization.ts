import type { vec2 } from '@basementuniverse/vec';
import type { Graph } from './graph';
import type { NodeTemplate } from './node';
import type { PortRef } from './port';

export type GraphDocument<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
> = {
  version: number;
  type: 'graph-document';
  graph: Graph<TNodeData, TEdgeData, TPortData>;
  layout?: {
    cameraPosition: vec2;
    cameraScale: number;
    selectedNodeId: string | null;
  };
};

export type GraphDomainNode<TNodeData = unknown> = {
  id: string;
  data?: TNodeData;
};

export type GraphDomainEdge<TEdgeData = unknown> = {
  a: PortRef;
  b: PortRef;
  data?: TEdgeData;
};

export type GraphDomain<TNodeData = unknown, TEdgeData = unknown> = {
  version: number;
  type: 'graph-domain';
  nodes: GraphDomainNode<TNodeData>[];
  edges: GraphDomainEdge<TEdgeData>[];
};

/**
 * Callback supplied to `loadFromDomain` that reconstructs the UI shape of a
 * node from its raw domain representation.
 *
 * Return a `NodeTemplate` (size, ports, label, etc.) to fully describe the
 * node's appearance, or `null` / `undefined` to fall back to the library
 * defaults (default size, no ports).
 */
export type NodeResolver<TNodeData = unknown, TPortData = unknown> = (
  domainNode: GraphDomainNode<TNodeData>
) => Omit<NodeTemplate<TNodeData, TPortData>, 'data'> | null | undefined;

/**
 * Options accepted by `loadFromDomain`.
 */
export type LoadFromDomainOptions<TNodeData = unknown, TPortData = unknown> = {
  /**
   * Called once per node in the domain data. Return a partial `NodeTemplate`
   * (without `data` — that is always taken from the domain node) to control
   * the node's visual appearance: ports, size, label, resizable, deletable.
   *
   * If omitted, or if the callback returns `null` / `undefined` for a
   * particular node, the library falls back to: default size, no ports,
   * `resizable: true`, `deletable: true`.
   */
  resolveNode?: NodeResolver<TNodeData, TPortData>;
};
