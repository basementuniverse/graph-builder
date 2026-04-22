import { Node } from './node';
export type VisitorControl = {
    skip?: boolean;
    stop?: boolean;
};
export type NodeVisitor<TNodeData = unknown, TEdgeData = unknown, TPortData = unknown, TResult = void> = (node: Node<TNodeData, TPortData>, depth: number) => TResult | VisitorControl;
export type Adjacency = {
    outgoing: Map<string, Set<string>>;
    incoming: Map<string, Set<string>>;
};
//# sourceMappingURL=traversal.d.ts.map