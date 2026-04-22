import { vec2 } from '@basementuniverse/vec';

export function pointInRectangle(
  point: vec2,
  rectangle: { position: vec2; size: vec2 }
) {
  return (
    point.x >= rectangle.position.x &&
    point.x <= rectangle.position.x + rectangle.size.x &&
    point.y >= rectangle.position.y &&
    point.y <= rectangle.position.y + rectangle.size.y
  );
}

export function pointInCircle(
  point: vec2,
  circle: { position: vec2; radius: number }
) {
  return vec2.len(vec2.sub(point, circle.position)) <= circle.radius;
}
