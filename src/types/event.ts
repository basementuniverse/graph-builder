import type { vec2 } from '@basementuniverse/vec';
import type { ToolMode } from '../enums';
import type { Edge, Graph, Node, NodeTemplate, Port, PortRef } from '../types';
import type { GraphEffectEventPayload } from './effects';

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
  nodeDataUpdated: {
    nodeId: string;
    from: TNodeData | undefined;
    to: TNodeData | undefined;
    node: Node<TNodeData, TPortData>;
  };
  nodeSelected: {
    nodeId: string | null;
  };
  portDataUpdated: {
    nodeId: string;
    portId: string;
    from: TPortData | undefined;
    to: TPortData | undefined;
    node: Node<TNodeData, TPortData>;
    port: Port<TPortData>;
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
  edgeDataUpdated: {
    from: TEdgeData | undefined;
    to: TEdgeData | undefined;
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
  effectStarted: GraphEffectEventPayload;
  effectStopped: GraphEffectEventPayload;
  effectCompleted: GraphEffectEventPayload;
  effectCleared: GraphEffectEventPayload;
};

export type GraphBuilderEventHandler<
  TNodeData,
  TEdgeData,
  TPortData,
  E extends keyof GraphBuilderEventMap<TNodeData, TEdgeData, TPortData>,
> = (
  payload: GraphBuilderEventMap<TNodeData, TEdgeData, TPortData>[E]
) => E extends CancellableGraphBuilderEvent ? boolean | void : void;

export type CancellableGraphBuilderEvent =
  | 'nodeCreating'
  | 'nodeRemoving'
  | 'edgeCreating'
  | 'edgeRemoving';
