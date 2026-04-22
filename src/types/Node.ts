import type { vec2 } from '@basementuniverse/vec';
import type { Port } from './Port';

export type Node<TNodeData = unknown, TPortData = unknown> = {
  id: string;
  position: vec2;
  size: vec2;
  label?: string;
  ports: Port<TPortData>[];
  resizable?: boolean;
  deletable?: boolean;
  data?: TNodeData;
};

export type NodeTemplate<TNodeData = unknown, TPortData = unknown> = Omit<
  Node<TNodeData, TPortData>,
  'id' | 'position'
>;

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
