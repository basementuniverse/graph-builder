import { vec2 } from '@basementuniverse/vec';
import { LayeredLayoutDirection } from './enums';
import {
  ForceDirectedLayoutOptions,
  GraphBuilderCapabilities,
  GraphBuilderEffectsOptions,
  GraphBuilderTheme,
  LayeredLayoutOptions,
} from './types';

export const DEBUG = false;
export const FPS_MIN = 30;

export const GRID_SIZE = 32;
export const NODE_MIN_SIZE = 50;
export const NODE_MAX_SIZE = 400;
export const NODE_EASE_AMOUNT = 0.4;

export const CAMERA_KEYBOARD_PAN_SPEED = 600;
export const CAMERA_ZOOM_STEP = 0.1;

export const DEFAULT_NODE_SIZE = vec2(200, 120);

export const PORT_HOVER_MARGIN = 8;
export const PORT_CONNECT_MARGIN = 16;

export const EDGE_CURVE_ENDPOINT_OFFSET = 8;
export const EDGE_CURVE_SAMPLE_DISTANCE = 30;
export const EDGE_HOVER_THRESHOLD = 24;

export const DELETE_BUTTON_SIZE = 20;
export const RESIZE_HANDLE_SIZE = 20;

export const GRAPH_SERIALIZATION_VERSION = 1;

export const DEFAULT_CAPABILITIES: Required<GraphBuilderCapabilities> = {
  createNodes: true,
  createEdges: true,
  deleteNodes: true,
  deleteEdges: true,
  resizeNodes: true,
  moveNodes: true,
};

export const DEFAULT_THEME: GraphBuilderTheme = {
  // Background
  backgroundColor: '#333',

  // Grid
  gridDotColor: '#fff1',
  gridDotLineWidth: 2,

  // Node frame
  nodeFillColor: '#fff2',
  nodeSelectedFillColor: '#fff5',
  nodeBorderColor: '#fff5',
  nodeHoveredBorderColor: '#fff8',
  nodeBorderWidth: 2,
  nodeBorderRadius: 10,
  nodePadding: 5,

  // Node label
  showNodeLabel: true,
  nodeLabelColor: '#fffb',
  nodeLabelFont: 'bold 12px sans-serif',

  // Delete button
  deleteButtonColor: '#fff5',
  deleteButtonHoveredColor: '#fff8',
  deleteButtonLineWidth: 2,

  // Resize handle
  resizeHandleColor: '#fff2',
  resizeHandleHoveredColor: '#fff5',
  resizeHandleLineWidth: 2,

  // Port
  portRadius: 8,
  portCutoutRadius: 12,
  portFillColor: '#fff2',
  portHoveredFillColor: '#fff4',
  portInvalidFillColor: '#ff334433',
  portBorderColor: '#fff5',
  portHoveredBorderColor: '#fff8',
  portInvalidBorderColor: '#ff6677',
  portBorderWidth: 2,
  portHoverRingColor: '#fff2',
  portInvalidRingColor: '#ff445588',
  portHoverRingLineWidth: 6,
  portHoverRingRadius: 12,
  portArrowSize: 6,
  portArrowColor: '#fff5',
  portArrowOffset: 0.44,
  portPulseColor: '#66ccff',
  portPulseLineWidth: 2,
  portPulseFromRadius: 10,
  portPulseToRadius: 30,
  portPulseMaxOpacity: 0.8,

  // Port label
  showPortLabel: true,
  portLabelOffset: 8,
  portLabelColor: '#fffb',
  portLabelFont: '12px sans-serif',

  // Edge
  edgeColor: '#fff2',
  edgeHoveredColor: '#fff4',
  edgeLineWidth: 3,
  edgeHoverOutlineColor: '#fff2',
  edgeHoverOutlineLineWidth: 10,
  edgeArrowSize: 8,
  edgeArrowColor: '#fff5',
  edgeArrowOffset: 0.5,

  // Edge preview
  edgePreviewColor: '#fff6',
  edgePreviewLineWidth: 3,
  edgePreviewOutlineColor: '#fff3',
  edgePreviewOutlineLineWidth: 10,
  edgeDashColor: '#7dd3fc',
  edgeDashLineWidth: 3,
  edgeDotColor: '#fde047',
  edgeDotRadius: 4,
  edgeDotOpacity: 1,
};

export const DEFAULT_EFFECTS: GraphBuilderEffectsOptions = {
  enabled: true,
  timeScale: 1,
  maxEdgeDotInstances: 200,
  maxPortPulseInstances: 400,
  edgeDash: {
    running: false,
    speed: 110,
    dashPattern: [10, 6],
    lineWidth: 3,
    color: '#7dd3fc',
    opacity: 0.9,
    blendMode: 'source-over',
    phase: 0,
  },
  edgeDot: {
    running: false,
    loop: false,
    speed: 220,
    duration: 0.5,
    spawnInterval: 0.2,
    radius: 4,
    color: '#fde047',
    opacity: 1,
    blendMode: 'source-over',
    animation: {
      interpolationFunction: 'linear',
    },
  },
  portPulse: {
    duration: 0.5,
    fromRadius: 10,
    toRadius: 30,
    lineWidth: 2,
    color: '#66ccff',
    maxOpacity: 0.8,
    blendMode: 'source-over',
    animation: {
      interpolationFunction: 'ease-out-cubic',
    },
  },
};

export const DEFAULT_FORCE_DIRECTED_LAYOUT_OPTIONS: ForceDirectedLayoutOptions =
  {
    iterations: 120,
    timeBudgetMs: undefined,
    repulsionStrength: 15_000,
    attractionStrength: 0.02,
    minNodeSpacing: 120,
    damping: 0.85,
    maxStep: 16,
  };

export const DEFAULT_LAYERED_LAYOUT_OPTIONS: LayeredLayoutOptions = {
  direction: LayeredLayoutDirection.TopDown,
  layerSpacing: 220,
  nodeSpacing: 180,
};
