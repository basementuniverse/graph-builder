import type { vec2 } from '@basementuniverse/vec';
import type { Graph } from './graph';
import type { NodeTemplate } from './node';
import type { PortRef } from './port';
export type GraphDocument<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown> = {
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
export type NodeResolver<TNodeData = unknown, TPortData = unknown> = (domainNode: GraphDomainNode<TNodeData>) => Omit<NodeTemplate<TNodeData, TPortData>, 'data'> | null | undefined;
export type LoadFromDomainOptions<TNodeData = unknown, TPortData = unknown> = {
    resolveNode?: NodeResolver<TNodeData, TPortData>;
};
//# sourceMappingURL=serialization.d.ts.map