import type { vec2 } from '@basementuniverse/vec';
import { PortSide, PortType } from '../enums';
export type Port<TPortData = unknown> = {
    id: string;
    label?: string;
    type: PortType;
    side: PortSide;
    data?: TPortData;
};
export type PortRef = {
    nodeId: string;
    portId: string;
};
export type PortState = {
    position: vec2;
    direction: vec2;
    hovered: boolean;
    connectable: boolean;
    invalidReason: string | null;
};
//# sourceMappingURL=port.d.ts.map