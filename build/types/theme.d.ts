export type NodeTheme = {
    nodeFillColor: string;
    nodeSelectedFillColor: string;
    nodeBorderColor: string;
    nodeHoveredBorderColor: string;
    nodeBorderWidth: number;
    nodeBorderRadius: number;
    nodeLabelColor: string;
    nodeLabelFont: string;
    deleteButtonColor: string;
    deleteButtonHoveredColor: string;
    deleteButtonLineWidth: number;
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
    portArrowSize: number;
    portArrowColor: string;
    portArrowOffset: number;
};
export type EdgeTheme = {
    edgeColor: string;
    edgeHoveredColor: string;
    edgeLineWidth: number;
    edgeHoverOutlineColor: string;
    edgeHoverOutlineLineWidth: number;
    edgeArrowSize: number;
    edgeArrowColor: string;
    edgeArrowOffset: number;
    edgePreviewColor: string;
    edgePreviewLineWidth: number;
    edgePreviewOutlineColor: string;
    edgePreviewOutlineLineWidth: number;
};
export type GraphBuilderTheme = {
    backgroundColor: string;
    gridDotColor: string;
    gridDotLineWidth: number;
} & NodeTheme & PortTheme & EdgeTheme;
//# sourceMappingURL=theme.d.ts.map