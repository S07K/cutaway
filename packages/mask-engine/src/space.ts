import type { Vec2 } from "@cutaway/types";

/**
 * The clip-level chain that places mask-local space on the stage.
 *
 * Mask-local (0,0) is the clip's anchor point, which is where `position` lands.
 * The compositor draws the mask as a child of the content, so it inherits
 * scale, then rotation, then position — in that order. A negative scale is a
 * flip and falls out of the same maths.
 */
export interface MaskSpace {
  /** Clip position in project pixels. */
  position: Vec2;
  scale: Vec2;
  /** Clip rotation in degrees (clockwise on screen, y down). */
  rotation: number;
  /** Stage size in screen pixels. */
  width: number;
  height: number;
  /** Screen pixels per project pixel. */
  previewScale: number;
}

function rotate(v: Vec2, degrees: number): Vec2 {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return { x: v.x * cos - v.y * sin, y: v.x * sin + v.y * cos };
}

/** Mask-local point → screen pixels within the stage. */
export function maskLocalToScreen(space: MaskSpace, local: Vec2): Vec2 {
  const rotated = rotate(
    { x: local.x * space.scale.x, y: local.y * space.scale.y },
    space.rotation,
  );
  return {
    x: space.width / 2 + (space.position.x + rotated.x) * space.previewScale,
    y: space.height / 2 + (space.position.y + rotated.y) * space.previewScale,
  };
}

/** Screen point within the stage → mask-local point (inverse of `maskLocalToScreen`). */
export function screenToMaskLocal(space: MaskSpace, screen: Vec2): Vec2 {
  return screenDeltaToMaskLocal(space, {
    x: screen.x - space.width / 2 - space.position.x * space.previewScale,
    y: screen.y - space.height / 2 - space.position.y * space.previewScale,
  });
}

/** Screen delta → mask-local delta (the linear part of the inverse). */
export function screenDeltaToMaskLocal(space: MaskSpace, delta: Vec2): Vec2 {
  const unrotated = rotate(
    { x: delta.x / space.previewScale, y: delta.y / space.previewScale },
    -space.rotation,
  );
  return {
    x: unrotated.x / (space.scale.x || 1),
    y: unrotated.y / (space.scale.y || 1),
  };
}
