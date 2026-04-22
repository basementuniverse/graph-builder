import { vec2 } from '@basementuniverse/vec';
import { EDGE_CURVE_ENDPOINT_OFFSET } from './constants';
import { EdgeToolEndpoint } from './types';

export default class EdgeTool {
  private static readonly FINAL_DIRECTION_EASE = 0.2;

  public pointer: vec2;
  public pointerDirection: vec2 | null = null;
  public smoothedFinalDirection: vec2;

  public constructor(public a: EdgeToolEndpoint) {
    this.pointer = vec2(a.position);
    this.smoothedFinalDirection = vec2.mul(a.direction, -1);
  }

  public update(pointer: vec2, pointerDirection: vec2 | null = null) {
    this.pointer = vec2(pointer);
    this.pointerDirection = pointerDirection ? vec2(pointerDirection) : null;

    const quantizedDirection = this.quantizedDirectionFromPointer(this.pointer);
    const targetDirection = this.pointerDirection
      ? this.normalizedDirectionOrFallback(
          this.pointerDirection,
          quantizedDirection
        )
      : quantizedDirection;

    this.smoothedFinalDirection = this.easeDirection(
      this.smoothedFinalDirection,
      targetDirection,
      EdgeTool.FINAL_DIRECTION_EASE
    );
  }

  /**
   * Returns the geometry data needed to draw the in-progress edge preview.
   * `from` and `to` are already offset from the port/pointer centres by
   * `EDGE_CURVE_ENDPOINT_OFFSET`, matching the convention used for drawn edges.
   */
  public getDrawData(): {
    from: vec2;
    to: vec2;
    fromDirection: vec2;
    toDirection: vec2;
  } {
    const from = vec2.add(
      this.a.position,
      vec2.mul(this.a.direction, EDGE_CURVE_ENDPOINT_OFFSET)
    );
    const toDirection = this.smoothedFinalDirection;
    const to = vec2.add(
      this.pointer,
      vec2.mul(toDirection, EDGE_CURVE_ENDPOINT_OFFSET)
    );
    return { from, to, fromDirection: this.a.direction, toDirection };
  }

  private normalizedDirectionOrFallback(direction: vec2, fallback: vec2): vec2 {
    const directionLength = vec2.len(direction);
    if (directionLength > 0) {
      return vec2.div(direction, directionLength);
    }

    const fallbackLength = vec2.len(fallback);
    if (fallbackLength > 0) {
      return vec2.div(fallback, fallbackLength);
    }

    return vec2(0, -1);
  }

  private quantizedDirectionFromPointer(pointer: vec2): vec2 {
    const start = vec2.add(
      this.a.position,
      vec2.mul(this.a.direction, EDGE_CURVE_ENDPOINT_OFFSET)
    );
    const toPointer = vec2.sub(pointer, start);

    const xDominant = Math.abs(toPointer.x) >= Math.abs(toPointer.y);
    if (xDominant) {
      return toPointer.x >= 0 ? vec2(-1, 0) : vec2(1, 0);
    }
    return toPointer.y >= 0 ? vec2(0, -1) : vec2(0, 1);
  }

  private easeDirection(from: vec2, to: vec2, amount: number): vec2 {
    const blended = vec2.add(vec2.mul(from, 1 - amount), vec2.mul(to, amount));
    return this.normalizedDirectionOrFallback(blended, to);
  }
}
