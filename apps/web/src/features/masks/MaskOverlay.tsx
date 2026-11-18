"use client";

import { useCallback } from "react";
import type { Clip, EllipseMaskShape, Mask, RectangleMaskShape, Vec2 } from "@cutaway/types";
import { evaluate, setValueAt } from "@cutaway/animation-engine";
import { maskLocalToScreen, screenDeltaToMaskLocal } from "@cutaway/mask-engine";
import type { MaskSpace } from "@cutaway/mask-engine";
import { useShallow } from "zustand/react/shallow";
import { useEditorStore } from "@/state/editorStore";

/**
 * On-preview editing handles for a clip's masks.
 *
 * An SVG layer over the stage — not WebGL — so it composits above the preview
 * and stays crisp at any zoom. Handles map through mask-local → frame → screen
 * space; the inverse converts a pixel drag back into mask units.
 *
 * Coordinate assumptions match the compositor (3.5.2): mask-local (0,0) is the
 * content centre (default 0.5 anchor), and mask units are scaled and rotated by
 * the clip's scale and rotation (about its anchor), since the mask graphic is a
 * child of the transformed content. Skew is not yet reflected in the handles —
 * a known limitation.
 *
 * Scope: move + resize for rectangle and ellipse. Pen-path vertex editing is a
 * further increment.
 */

interface MaskOverlayProps {
  /** Stage size in screen pixels. */
  width: number;
  height: number;
  /** Project frame size in project pixels. */
  resolution: { width: number; height: number };
}

const HANDLE_RADIUS = 5;

export function MaskOverlay({ width, height, resolution }: MaskOverlayProps) {
  const selectedIds = useEditorStore(useShallow((state) => state.selectedClipIds));
  const clip = useEditorStore((state) =>
    selectedIds.length === 1 ? state.project.entities.clips[selectedIds[0]!] : undefined,
  );
  const playhead = useEditorStore((state) => state.playhead);
  const updateClip = useEditorStore((state) => state.updateClip);
  const endGesture = useEditorStore((state) => state.endGesture);

  const editableMasks = clip?.masks.filter((mask) => mask.enabled && mask.shape.kind !== "path");

  // The overlay only appears for a single selected clip carrying a shape mask;
  // otherwise it would be visual noise over unrelated content.
  if (!clip || !editableMasks || editableMasks.length === 0) return null;

  const previewScale = width / resolution.width;
  const position = evaluate(clip.transform.position, playhead) as Vec2;
  const clipScale = evaluate(clip.transform.scale, playhead) as Vec2;

  const rotation = evaluate(clip.transform.rotation, playhead) as number;
  const space: MaskSpace = { position, scale: clipScale, rotation, width, height, previewScale };

  /** Mask-local point → screen pixels within the stage. */
  const toScreen = (local: Vec2): Vec2 => maskLocalToScreen(space, local);

  /** Screen delta → mask-local delta (inverse of the scale/rotate chain). */
  const toLocalDelta = (dxScreen: number, dyScreen: number): Vec2 =>
    screenDeltaToMaskLocal(space, { x: dxScreen, y: dyScreen });

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={width}
      height={height}
      // The SVG spans the stage; individual handles re-enable pointer events.
    >
      {editableMasks.map((mask) => (
        <MaskHandles
          key={mask.id}
          clipId={clip.id}
          mask={mask}
          playhead={playhead}
          toScreen={toScreen}
          toLocalDelta={toLocalDelta}
          updateClip={updateClip}
          endGesture={endGesture}
        />
      ))}
    </svg>
  );
}

interface HandlesProps {
  clipId: string;
  mask: Mask;
  playhead: number;
  toScreen: (local: Vec2) => Vec2;
  toLocalDelta: (dx: number, dy: number) => Vec2;
  updateClip: (id: string, updater: (clip: Clip) => Clip, label: string, mergeKey?: string) => void;
  endGesture: () => void;
}

function MaskHandles({
  clipId,
  mask,
  playhead,
  toScreen,
  toLocalDelta,
  updateClip,
  endGesture,
}: HandlesProps) {
  /**
   * Starts a handle drag. `onDelta` receives the mask-local delta and returns
   * the mask-shape patch to apply; the drag merges into one undo step.
   */
  const startDrag = useCallback(
    (
      event: React.PointerEvent,
      onDelta: (deltaLocal: Vec2, shape: Mask["shape"]) => Mask["shape"],
    ) => {
      event.preventDefault();
      event.stopPropagation();
      const target = event.currentTarget as SVGElement;
      target.setPointerCapture(event.pointerId);

      let lastX = event.clientX;
      let lastY = event.clientY;

      const move = (moveEvent: PointerEvent) => {
        const deltaLocal = toLocalDelta(moveEvent.clientX - lastX, moveEvent.clientY - lastY);
        lastX = moveEvent.clientX;
        lastY = moveEvent.clientY;

        updateClip(
          clipId,
          (clip) => ({
            ...clip,
            masks: clip.masks.map((m) =>
              m.id === mask.id ? { ...m, shape: onDelta(deltaLocal, m.shape) } : m,
            ),
          }),
          "Edit mask",
          `mask:${clipId}:${mask.id}`,
        );
      };

      const up = () => {
        target.releasePointerCapture(event.pointerId);
        target.removeEventListener("pointermove", move);
        target.removeEventListener("pointerup", up);
        endGesture();
      };

      target.addEventListener("pointermove", move);
      target.addEventListener("pointerup", up);
    },
    [clipId, mask.id, toLocalDelta, updateClip, endGesture],
  );

  if (mask.shape.kind === "rectangle") {
    return (
      <RectangleHandles
        shape={mask.shape}
        playhead={playhead}
        toScreen={toScreen}
        startDrag={startDrag}
      />
    );
  }

  if (mask.shape.kind === "ellipse") {
    return (
      <EllipseHandles
        shape={mask.shape}
        playhead={playhead}
        toScreen={toScreen}
        startDrag={startDrag}
      />
    );
  }

  return null;
}

type DragStarter = (
  event: React.PointerEvent,
  onDelta: (deltaLocal: Vec2, shape: Mask["shape"]) => Mask["shape"],
) => void;

function RectangleHandles({
  shape,
  playhead,
  toScreen,
  startDrag,
}: {
  shape: RectangleMaskShape;
  playhead: number;
  toScreen: (local: Vec2) => Vec2;
  startDrag: DragStarter;
}) {
  const center = evaluate(shape.center, playhead) as Vec2;
  const size = evaluate(shape.size, playhead) as Vec2;

  const topLeft = toScreen({ x: center.x - size.x / 2, y: center.y - size.y / 2 });
  const topRight = toScreen({ x: center.x + size.x / 2, y: center.y - size.y / 2 });
  const bottomLeft = toScreen({ x: center.x - size.x / 2, y: center.y + size.y / 2 });
  const bottomRight = toScreen({ x: center.x + size.x / 2, y: center.y + size.y / 2 });
  const centerScreen = toScreen(center);
  const cornerScreen = bottomRight;

  return (
    <g>
      <polygon
        points={[topLeft, topRight, bottomRight, bottomLeft].map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <Handle
        point={centerScreen}
        cursor="move"
        onPointerDown={(e) =>
          startDrag(e, (delta, s) =>
            s.kind === "rectangle"
              ? { ...s, center: setValueAt(s.center, playhead, add(center, delta)) }
              : s,
          )
        }
      />
      <Handle
        point={cornerScreen}
        cursor="nwse-resize"
        onPointerDown={(e) =>
          // Corner drags resize symmetrically: size grows by twice the drag.
          startDrag(e, (delta, s) =>
            s.kind === "rectangle"
              ? {
                  ...s,
                  size: setValueAt(s.size, playhead, {
                    x: Math.max(2, size.x + delta.x * 2),
                    y: Math.max(2, size.y + delta.y * 2),
                  }),
                }
              : s,
          )
        }
      />
    </g>
  );
}

function EllipseHandles({
  shape,
  playhead,
  toScreen,
  startDrag,
}: {
  shape: EllipseMaskShape;
  playhead: number;
  toScreen: (local: Vec2) => Vec2;
  startDrag: DragStarter;
}) {
  const center = evaluate(shape.center, playhead) as Vec2;
  const radii = evaluate(shape.radii, playhead) as Vec2;

  const centerScreen = toScreen(center);
  const edgeScreen = toScreen({ x: center.x + radii.x, y: center.y });
  const bottomScreen = toScreen({ x: center.x, y: center.y + radii.y });

  // Screen radii and tilt for the outline; lengths are sign-free, so flips are fine.
  const rx = Math.hypot(edgeScreen.x - centerScreen.x, edgeScreen.y - centerScreen.y);
  const ry = Math.hypot(bottomScreen.x - centerScreen.x, bottomScreen.y - centerScreen.y);
  const tilt = Math.atan2(edgeScreen.y - centerScreen.y, edgeScreen.x - centerScreen.x);

  return (
    <g>
      <ellipse
        cx={centerScreen.x}
        cy={centerScreen.y}
        rx={rx}
        ry={ry}
        transform={`rotate(${(tilt * 180) / Math.PI} ${centerScreen.x} ${centerScreen.y})`}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <Handle
        point={centerScreen}
        cursor="move"
        onPointerDown={(e) =>
          startDrag(e, (delta, s) =>
            s.kind === "ellipse"
              ? { ...s, center: setValueAt(s.center, playhead, add(center, delta)) }
              : s,
          )
        }
      />
      <Handle
        point={edgeScreen}
        cursor="ew-resize"
        onPointerDown={(e) =>
          startDrag(e, (delta, s) =>
            s.kind === "ellipse"
              ? {
                  ...s,
                  radii: setValueAt(s.radii, playhead, {
                    x: Math.max(1, radii.x + delta.x),
                    y: radii.y,
                  }),
                }
              : s,
          )
        }
      />
      <Handle
        point={bottomScreen}
        cursor="ns-resize"
        onPointerDown={(e) =>
          startDrag(e, (delta, s) =>
            s.kind === "ellipse"
              ? {
                  ...s,
                  radii: setValueAt(s.radii, playhead, {
                    x: radii.x,
                    y: Math.max(1, radii.y + delta.y),
                  }),
                }
              : s,
          )
        }
      />
    </g>
  );
}

function Handle({
  point,
  cursor,
  onPointerDown,
}: {
  point: Vec2;
  cursor: string;
  onPointerDown: (event: React.PointerEvent) => void;
}) {
  return (
    <circle
      cx={point.x}
      cy={point.y}
      r={HANDLE_RADIUS}
      fill="var(--color-accent)"
      stroke="#fff"
      strokeWidth={1.5}
      style={{ cursor, pointerEvents: "auto" }}
      onPointerDown={onPointerDown}
    />
  );
}

function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}
