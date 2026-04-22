import type { vec2 } from '@basementuniverse/vec';
import type { ToolMode } from '../enums';
import type { Edge } from '../types/Edge';
import type { Graph } from '../types/Graph';
import type { Node, NodeTemplate } from '../types/Node';
import type { PortRef } from '../types/Port';

export type GraphBuilderEventMap<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
> = {
  nodeCreating: {
    position: vec2;
    template: NodeTemplate<TNodeData, TPortData>;
  };
  nodeCreated: {
    node: Node<TNodeData, TPortData>;
  };
  nodeRemoving: {
    nodeId: string;
    node: Node<TNodeData, TPortData>;
  };
  nodeRemoved: {
    nodeId: string;
    node: Node<TNodeData, TPortData>;
  };
  nodeMoved: {
    nodeId: string;
    from: vec2;
    to: vec2;
  };
  nodeResized: {
    nodeId: string;
    from: vec2;
    to: vec2;
  };
  nodeSelected: {
    nodeId: string | null;
  };
  edgeCreating: {
    edge: Edge<TEdgeData>;
  };
  edgeCreated: {
    edge: Edge<TEdgeData>;
  };
  edgeRemoving: {
    edge: Edge<TEdgeData>;
  };
  edgeRemoved: {
    edge: Edge<TEdgeData>;
  };
  edgeConnectionRejected: {
    from: PortRef;
    to: PortRef;
    reason: string;
  };
  graphLoaded: {
    graph: Graph<TNodeData, TEdgeData, TPortData>;
  };
  graphCleared: {};
  graphArranged: {
    strategy: 'forceDirected' | 'layered';
  };
  graphArrangementFailed: {
    strategy: 'forceDirected' | 'layered';
    reason: string;
  };
  toolChanged: {
    from: ToolMode;
    to: ToolMode;
  };
};

export type CancellableGraphBuilderEvent =
  | 'nodeCreating'
  | 'nodeRemoving'
  | 'edgeCreating'
  | 'edgeRemoving';
