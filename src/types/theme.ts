export type NodeTheme = {
  // Node frame
  nodeFillColor: string;
  nodeSelectedFillColor: string;
  nodeBorderColor: string;
  nodeHoveredBorderColor: string;
  nodeBorderWidth: number;
  nodeBorderRadius: number;

  // Node label
  nodeLabelColor: string;
  nodeLabelFont: string;

  // Delete button
  deleteButtonColor: string;
  deleteButtonHoveredColor: string;
  deleteButtonLineWidth: number;

  // Resize handle
  resizeHandleColor: string;
  resizeHandleHoveredColor: string;
  resizeHandleLineWidth: number;
};

export type PortTheme = {
  portRadius: number;
  portCutoutRadius: number;
  portFillColor: string;
  portHoveredFillColor: string;
  portInvalidFillColor: string;
  portBorderColor: string;
  portHoveredBorderColor: string;
  portInvalidBorderColor: string;
  portBorderWidth: number;
  portHoverRingColor: string;
  portInvalidRingColor: string;
  portHoverRingLineWidth: number;
  portHoverRingRadius: number;

  // Direction arrow
  portArrowSize: number;
  portArrowColor: string;
  portArrowOffset: number;

  // Port pulse effect
  portPulseColor: string;
  portPulseLineWidth: number;
  portPulseFromRadius: number;
  portPulseToRadius: number;
  portPulseMaxOpacity: number;
};

export type EdgeTheme = {
  // Edge
  edgeColor: string;
  edgeHoveredColor: string;
  edgeLineWidth: number;
  edgeHoverOutlineColor: string;
  edgeHoverOutlineLineWidth: number;

  // Direction arrow
  edgeArrowSize: number;
  edgeArrowColor: string;
  edgeArrowOffset: number;

  // Edge preview (drawn while creating an edge)
  edgePreviewColor: string;
  edgePreviewLineWidth: number;
  edgePreviewOutlineColor: string;
  edgePreviewOutlineLineWidth: number;

  // Edge dashed flow effect
  edgeDashColor: string;
  edgeDashLineWidth: number;

  // Edge moving dot effect
  edgeDotColor: string;
  edgeDotRadius: number;
  edgeDotOpacity: number;
};

export type GraphBuilderTheme = {
  // Background
  backgroundColor: string;

  // Grid
  gridDotColor: string;
  gridDotLineWidth: number;
} & NodeTheme &
  PortTheme &
  EdgeTheme;
