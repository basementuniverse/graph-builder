"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LAYERED_LAYOUT_OPTIONS = exports.DEFAULT_FORCE_DIRECTED_LAYOUT_OPTIONS = exports.DEFAULT_EFFECTS = exports.DEFAULT_THEME = exports.DEFAULT_CAPABILITIES = exports.GRAPH_SERIALIZATION_VERSION = exports.RESIZE_HANDLE_SIZE = exports.DELETE_BUTTON_SIZE = exports.EDGE_HOVER_THRESHOLD = exports.EDGE_CURVE_SAMPLE_DISTANCE = exports.EDGE_CURVE_ENDPOINT_OFFSET = exports.PORT_CONNECT_MARGIN = exports.PORT_HOVER_MARGIN = exports.DEFAULT_NODE_SIZE = exports.CAMERA_ZOOM_STEP = exports.CAMERA_KEYBOARD_PAN_SPEED = exports.NODE_EASE_AMOUNT = exports.NODE_MAX_SIZE = exports.NODE_MIN_SIZE = exports.GRID_SIZE = exports.FPS_MIN = exports.DEBUG = void 0;
const vec_1 = require("@basementuniverse/vec");
const enums_1 = require("./enums");
exports.DEBUG = false;
exports.FPS_MIN = 30;
exports.GRID_SIZE = 32;
exports.NODE_MIN_SIZE = 50;
exports.NODE_MAX_SIZE = 400;
exports.NODE_EASE_AMOUNT = 0.4;
exports.CAMERA_KEYBOARD_PAN_SPEED = 600;
exports.CAMERA_ZOOM_STEP = 0.1;
exports.DEFAULT_NODE_SIZE = (0, vec_1.vec2)(200, 120);
exports.PORT_HOVER_MARGIN = 8;
exports.PORT_CONNECT_MARGIN = 16;
exports.EDGE_CURVE_ENDPOINT_OFFSET = 8;
exports.EDGE_CURVE_SAMPLE_DISTANCE = 30;
exports.EDGE_HOVER_THRESHOLD = 24;
exports.DELETE_BUTTON_SIZE = 20;
exports.RESIZE_HANDLE_SIZE = 20;
exports.GRAPH_SERIALIZATION_VERSION = 1;
exports.DEFAULT_CAPABILITIES = {
    createNodes: true,
    createEdges: true,
    deleteNodes: true,
    deleteEdges: true,
    resizeNodes: true,
    moveNodes: true,
};
exports.DEFAULT_THEME = {
    backgroundColor: '#333',
    gridDotColor: '#fff1',
    gridDotLineWidth: 2,
    nodeFillColor: '#fff2',
    nodeSelectedFillColor: '#fff5',
    nodeBorderColor: '#fff5',
    nodeHoveredBorderColor: '#fff8',
    nodeBorderWidth: 2,
    nodeBorderRadius: 10,
    nodePadding: 5,
    showNodeLabel: true,
    nodeLabelColor: '#fffb',
    nodeLabelFont: 'bold 12px sans-serif',
    deleteButtonColor: '#fff5',
    deleteButtonHoveredColor: '#fff8',
    deleteButtonLineWidth: 2,
    resizeHandleColor: '#fff2',
    resizeHandleHoveredColor: '#fff5',
    resizeHandleLineWidth: 2,
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
    showPortLabel: true,
    portLabelOffset: 8,
    portLabelColor: '#fffb',
    portLabelFont: '10px sans-serif',
    edgeColor: '#fff2',
    edgeHoveredColor: '#fff4',
    edgeLineWidth: 3,
    edgeHoverOutlineColor: '#fff2',
    edgeHoverOutlineLineWidth: 10,
    edgeArrowSize: 8,
    edgeArrowColor: '#fff5',
    edgeArrowOffset: 0.5,
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
exports.DEFAULT_EFFECTS = {
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
exports.DEFAULT_FORCE_DIRECTED_LAYOUT_OPTIONS = {
    iterations: 120,
    timeBudgetMs: undefined,
    repulsionStrength: 15000,
    attractionStrength: 0.02,
    minNodeSpacing: 120,
    damping: 0.85,
    maxStep: 16,
};
exports.DEFAULT_LAYERED_LAYOUT_OPTIONS = {
    direction: enums_1.LayeredLayoutDirection.TopDown,
    layerSpacing: 220,
    nodeSpacing: 180,
};
//# sourceMappingURL=constants.js.map