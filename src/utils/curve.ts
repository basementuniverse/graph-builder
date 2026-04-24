import { clamp, lerp } from '@basementuniverse/utils';
import { vec2 } from '@basementuniverse/vec';

export function curveFromTo(
  context: CanvasRenderingContext2D,
  a: vec2,
  b: vec2,
  initialDirection: vec2,
  finalDirection: vec2,
  gridSize: number
) {
  context.beginPath();

  const { cp1, cp2, join } = getCurveGeometry(
    a,
    b,
    initialDirection,
    finalDirection,
    gridSize
  );

  context.moveTo(a.x, a.y);
  context.quadraticCurveTo(cp1.x, cp1.y, join.x, join.y);
  context.quadraticCurveTo(cp2.x, cp2.y, b.x, b.y);
  context.stroke();
}

export function getCurveGeometry(
  a: vec2,
  b: vec2,
  initialDirection: vec2,
  finalDirection: vec2,
  gridSize: number
) {
  const distance = vec2.len(vec2.sub(a, b));
  const minDistance = gridSize * 4;
  let curveStrength = gridSize;
  if (distance < minDistance) {
    curveStrength = lerp(0, gridSize, clamp(distance / minDistance, 0, 1));
  }

  const cp1 = vec2.add(a, vec2.mul(initialDirection, curveStrength));
  const cp2 = vec2.add(b, vec2.mul(finalDirection, curveStrength));

  // Choose a join point that guarantees tangent continuity between segments.
  const join = vec2.div(vec2.add(cp1, cp2), 2);

  return { cp1, cp2, join };
}

/**
 * Sample a position and normalised tangent on the two-segment quadratic bezier
 * chain used to draw edges (a → cp1 → join → cp2 → b), at a normalised
 * parameter t ∈ [0, 1].
 */
export function sampleBezierChain(
  a: vec2,
  cp1: vec2,
  join: vec2,
  cp2: vec2,
  b: vec2,
  t: number
): { position: vec2; tangent: vec2 } {
  t = Math.max(0, Math.min(1, t));
  if (t <= 0.5) {
    const s = t * 2;
    return {
      position: sampleQuadratic(a, cp1, join, s),
      tangent: tangentQuadratic(a, cp1, join, s),
    };
  } else {
    const s = (t - 0.5) * 2;
    return {
      position: sampleQuadratic(join, cp2, b, s),
      tangent: tangentQuadratic(join, cp2, b, s),
    };
  }
}

function sampleQuadratic(a: vec2, cp: vec2, b: vec2, t: number): vec2 {
  const mt = 1 - t;
  return vec2(
    mt * mt * a.x + 2 * mt * t * cp.x + t * t * b.x,
    mt * mt * a.y + 2 * mt * t * cp.y + t * t * b.y
  );
}

function tangentQuadratic(a: vec2, cp: vec2, b: vec2, t: number): vec2 {
  const dx = 2 * (1 - t) * (cp.x - a.x) + 2 * t * (b.x - cp.x);
  const dy = 2 * (1 - t) * (cp.y - a.y) + 2 * t * (b.y - cp.y);
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) {
    return vec2(1, 0);
  }
  return vec2(dx / len, dy / len);
}

export function pointToQuadraticBezierDistance(
  p: vec2,
  a: vec2,
  cp: vec2,
  b: vec2,
  t: number
): number {
  const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cp.x + t * t * b.x;
  const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cp.y + t * t * b.y;
  return vec2.len(vec2.sub(p, { x, y }));
}
