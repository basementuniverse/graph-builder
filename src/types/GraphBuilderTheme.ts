export type GraphBuilderTheme = {
  // Background
  backgroundColor: string;

  // Grid
  gridDotColor: string;
  gridDotLineWidth: number;

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

  // Port
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

  // Edge
  edgeColor: string;
  edgeHoveredColor: string;
  edgeLineWidth: number;
  edgeHoverOutlineColor: string;
  edgeHoverOutlineLineWidth: number;

  // Edge preview (drawn while creating an edge)
  edgePreviewColor: string;
  edgePreviewLineWidth: number;
  edgePreviewOutlineColor: string;
  edgePreviewOutlineLineWidth: number;
};
