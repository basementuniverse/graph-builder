import type { EdgeDashRuntimeState, EdgeDotRuntimeState } from './effects';
import type { PortRef } from './port';
import type { EdgeTheme } from './theme';

export type Edge<TEdgeData = unknown> = {
  a: PortRef;
  b: PortRef;
  theme?: Partial<EdgeTheme>;
  data?: TEdgeData;
};

export type EdgeState = {
  hovered: boolean;
  dashEffect?: EdgeDashRuntimeState;
  dotEffect?: EdgeDotRuntimeState;
};
