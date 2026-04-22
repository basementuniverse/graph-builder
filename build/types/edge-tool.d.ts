import { vec2 } from '@basementuniverse/vec';
import { PortSide, PortType } from '../enums';
export type EdgeToolEndpoint = {
    nodeId: string;
    portId: string;
    type: PortType;
    side: PortSide;
    position: vec2;
    direction: vec2;
};
//# sourceMappingURL=edge-tool.d.ts.map