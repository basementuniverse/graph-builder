import type { vec2 } from '@basementuniverse/vec';
import { PortSide, PortType } from '../enums';
import type { PortPulseRuntimeState } from './effects';
import type { EdgeTheme, PortTheme } from './theme';

export type Port<TPortData = unknown> = {
  id: string;
  label?: string;
  type: PortType;
  side: PortSide;
  theme?: Partial<PortTheme>;
  edgeTheme?: Partial<EdgeTheme>;
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
  pulseEffect?: PortPulseRuntimeState;
};
