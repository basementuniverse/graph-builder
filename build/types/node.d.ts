import type { vec2 } from '@basementuniverse/vec';
import type { NodeTheme } from './theme';
import type { Port } from './port';
export type Node<TNodeData = unknown, TPortData = unknown> = {
    id: string;
    position: vec2;
    size: vec2;
    label?: string;
    ports: Port<TPortData>[];
    resizable?: boolean;
    deletable?: boolean;
    theme?: Partial<NodeTheme>;
    data?: TNodeData;
};
export type NodeTemplate<TNodeData = unknown, TPortData = unknown> = Omit<Node<TNodeData, TPortData>, 'id' | 'position'>;
export type NodeState = {
    hovered: boolean;
    selected: boolean;
    dragging: boolean;
    resizing: boolean;
    resizeHovered: boolean;
    deleteHovered: boolean;
    dragOffset: vec2;
    resizeOffset: vec2;
    actualPosition: vec2;
    actualSize: vec2;
};
//# sourceMappingURL=node.d.ts.map