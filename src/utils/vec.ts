import { vec2 } from '@basementuniverse/vec';

export function clampVec(value: vec2, min: vec2, max: vec2): vec2 {
  return vec2(
    Math.min(Math.max(value.x, min.x), max.x),
    Math.min(Math.max(value.y, min.y), max.y)
  );
}

export function roundVec(value: vec2, step: number): vec2 {
  return vec2(
    Math.round(value.x / step) * step,
    Math.round(value.y / step) * step
  );
}
