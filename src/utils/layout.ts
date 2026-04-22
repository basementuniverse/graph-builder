import { vec2 } from '@basementuniverse/vec';
import { LayeredLayoutDirection } from '../enums';

export function toPosition(
  direction: LayeredLayoutDirection,
  layerIndex: number,
  nodeIndex: number,
  layerSpacing: number,
  nodeSpacing: number
): vec2 {
  switch (direction) {
    case LayeredLayoutDirection.BottomUp:
      return vec2(nodeIndex * nodeSpacing, -layerIndex * layerSpacing);
    case LayeredLayoutDirection.LeftRight:
      return vec2(layerIndex * layerSpacing, nodeIndex * nodeSpacing);
    case LayeredLayoutDirection.RightLeft:
      return vec2(-layerIndex * layerSpacing, nodeIndex * nodeSpacing);
    case LayeredLayoutDirection.TopDown:
    default:
      return vec2(nodeIndex * nodeSpacing, layerIndex * layerSpacing);
  }
}
