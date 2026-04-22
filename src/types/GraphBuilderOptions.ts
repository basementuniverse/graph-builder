import type { CameraOptions } from '@basementuniverse/camera';
import type { Edge } from './Edge';
import { GraphBuilderCallbacks } from './GraphBuilderCallbacks';
import { GraphBuilderTheme } from './GraphBuilderTheme';
import type { Node } from './Node';
import type { Port } from './Port';

export type GraphBuilderCapabilities = {
  createNodes?: boolean;
  createEdges?: boolean;
  deleteNodes?: boolean;
  deleteEdges?: boolean;
  resizeNodes?: boolean;
  moveNodes?: boolean;
};

export type EdgeConnectionValidationResult = {
  allowed: boolean;
  reason?: string;
};

export type GraphBuilderOptions<
  TNodeData = unknown,
  TEdgeData = unknown,
  TPortData = unknown,
> = {
  gridSize?: number;
  snapToGrid?: boolean;
  showGrid?: boolean;
  camera?: Partial<CameraOptions>;
  autoStart?: boolean;
  theme?: Partial<GraphBuilderTheme>;
  callbacks?: GraphBuilderCallbacks;
  capabilities?: GraphBuilderCapabilities;
  canConnectPorts?: (params: {
    fromNode: Node<TNodeData, TPortData>;
    fromPort: Port<TPortData>;
    toNode: Node<TNodeData, TPortData>;
    toPort: Port<TPortData>;
    edge?: Edge<TEdgeData>;
  }) => EdgeConnectionValidationResult;
};
