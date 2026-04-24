import type { Animation, AnimationOptions } from '@basementuniverse/animation';
import type { PortRef } from './port';

export type GraphEffectChannel = string;

export type GraphEffectKind = 'edgeDash' | 'edgeDot' | 'portPulse';

export type EdgeEffectTarget = {
  a: PortRef;
  b: PortRef;
};

export type PortEffectTarget = PortRef;

export type GraphEffectTarget = EdgeEffectTarget | PortEffectTarget;

export type EdgeDashEffectConfig = {
  running: boolean;
  speed: number;
  dashPattern: number[];
  lineWidth: number;
  color: string;
  opacity: number;
  blendMode: CanvasRenderingContext2D['globalCompositeOperation'];
  phase: number;
};

export type EdgeDotEffectConfig = {
  running: boolean;
  loop: boolean;
  speed: number;
  duration: number;
  spawnInterval: number;
  radius: number;
  color: string;
  opacity: number;
  blendMode: CanvasRenderingContext2D['globalCompositeOperation'];
  animation: Partial<
    Pick<
      AnimationOptions<number>,
      | 'delay'
      | 'clamp'
      | 'round'
      | 'easeAmount'
      | 'interpolationFunction'
      | 'interpolationFunctionParameters'
    >
  >;
};

export type PortPulseEffectConfig = {
  duration: number;
  fromRadius: number;
  toRadius: number;
  lineWidth: number;
  color: string;
  maxOpacity: number;
  blendMode: CanvasRenderingContext2D['globalCompositeOperation'];
  animation: Partial<
    Pick<
      AnimationOptions<number>,
      | 'delay'
      | 'clamp'
      | 'round'
      | 'easeAmount'
      | 'interpolationFunction'
      | 'interpolationFunctionParameters'
    >
  >;
};

export type GraphBuilderEffectsOptions = {
  enabled: boolean;
  timeScale: number;
  maxEdgeDotInstances: number;
  maxPortPulseInstances: number;
  edgeDash: EdgeDashEffectConfig;
  edgeDot: EdgeDotEffectConfig;
  portPulse: PortPulseEffectConfig;
};

export type GraphBuilderEffectsOptionsInput = Partial<
  Omit<GraphBuilderEffectsOptions, 'edgeDash' | 'edgeDot' | 'portPulse'>
> & {
  edgeDash?: Partial<EdgeDashEffectConfig>;
  edgeDot?: Partial<EdgeDotEffectConfig>;
  portPulse?: Partial<PortPulseEffectConfig>;
};

export type EdgeDashRuntimeState = {
  edgeKey: string;
  channel: GraphEffectChannel;
  config: EdgeDashEffectConfig;
};

export type EdgeDotRuntimeInstance = {
  id: string;
  channel: GraphEffectChannel;
  animation: Animation<number>;
};

export type EdgeDotRuntimeState = {
  edgeKey: string;
  channel: GraphEffectChannel;
  config: EdgeDotEffectConfig;
  spawnElapsed: number;
  instances: EdgeDotRuntimeInstance[];
};

export type PortPulseRuntimeInstance = {
  id: string;
  channel: GraphEffectChannel;
  animation: Animation<number>;
  config: PortPulseEffectConfig;
};

export type PortPulseRuntimeState = {
  portKey: string;
  channel: GraphEffectChannel;
  instances: PortPulseRuntimeInstance[];
};

export type EffectTriggerHandle = {
  id: string;
  stop: () => boolean;
};

export type EdgeDashEffectsController = {
  get: (
    target: EdgeEffectTarget,
    channel?: GraphEffectChannel
  ) => EdgeDashEffectConfig | null;
  set: (
    target: EdgeEffectTarget,
    patch: Partial<EdgeDashEffectConfig>,
    channel?: GraphEffectChannel
  ) => boolean;
  start: (
    target: EdgeEffectTarget,
    patch?: Partial<EdgeDashEffectConfig>,
    channel?: GraphEffectChannel
  ) => boolean;
  stop: (target: EdgeEffectTarget, channel?: GraphEffectChannel) => boolean;
  clear: (target?: EdgeEffectTarget, channel?: GraphEffectChannel) => void;
};

export type EdgeDotEffectsController = {
  get: (
    target: EdgeEffectTarget,
    channel?: GraphEffectChannel
  ) => EdgeDotEffectConfig | null;
  set: (
    target: EdgeEffectTarget,
    patch: Partial<EdgeDotEffectConfig>,
    channel?: GraphEffectChannel
  ) => boolean;
  trigger: (
    target: EdgeEffectTarget,
    patch?: Partial<EdgeDotEffectConfig>,
    channel?: GraphEffectChannel
  ) => EffectTriggerHandle | null;
  start: (
    target: EdgeEffectTarget,
    patch?: Partial<EdgeDotEffectConfig>,
    channel?: GraphEffectChannel
  ) => boolean;
  stop: (target: EdgeEffectTarget, channel?: GraphEffectChannel) => boolean;
  clear: (target?: EdgeEffectTarget, channel?: GraphEffectChannel) => void;
};

export type PortPulseEffectsController = {
  trigger: (
    target: PortEffectTarget,
    patch?: Partial<PortPulseEffectConfig>,
    channel?: GraphEffectChannel
  ) => EffectTriggerHandle | null;
  clear: (target?: PortEffectTarget, channel?: GraphEffectChannel) => void;
};

export type GraphEffectsGlobalController = {
  setEnabled: (enabled: boolean) => void;
  setTimeScale: (timeScale: number) => void;
  pause: () => void;
  resume: () => void;
  clearAll: () => void;
};

export type GraphBuilderEffectsController = {
  edgeDash: EdgeDashEffectsController;
  edgeDot: EdgeDotEffectsController;
  portPulse: PortPulseEffectsController;
  global: GraphEffectsGlobalController;
};

export type GraphEffectEventPayload = {
  kind: GraphEffectKind;
  channel: GraphEffectChannel;
  target: GraphEffectTarget;
  id?: string;
};
