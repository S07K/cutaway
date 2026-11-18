import { describe, expect, it } from "vitest";
import { maskLocalToScreen, screenDeltaToMaskLocal, screenToMaskLocal } from "../space";
import type { MaskSpace } from "../space";

const base: MaskSpace = {
  position: { x: 100, y: -50 },
  scale: { x: 1.5, y: 0.75 },
  rotation: 0,
  width: 960,
  height: 540,
  previewScale: 0.5,
};

const points = [
  { x: 0, y: 0 },
  { x: 120, y: -40 },
  { x: -33.5, y: 78 },
];

describe("mask space transform", () => {
  const cases: [string, Partial<MaskSpace>][] = [
    ["0 degrees", { rotation: 0 }],
    ["90 degrees", { rotation: 90 }],
    ["45 degrees", { rotation: 45 }],
    ["flipped horizontally", { rotation: 30, scale: { x: -1.5, y: 0.75 } }],
    ["flipped on both axes", { rotation: 45, scale: { x: -1, y: -2 } }],
  ];

  for (const [name, patch] of cases) {
    it(`screenToMaskLocal inverts maskLocalToScreen at ${name}`, () => {
      const space = { ...base, ...patch };
      for (const p of points) {
        const back = screenToMaskLocal(space, maskLocalToScreen(space, p));
        expect(back.x).toBeCloseTo(p.x, 9);
        expect(back.y).toBeCloseTo(p.y, 9);
      }
    });
  }

  it("maps the local origin to the clip position regardless of rotation", () => {
    const screen = maskLocalToScreen({ ...base, rotation: 45 }, { x: 0, y: 0 });
    expect(screen.x).toBeCloseTo(480 + 100 * 0.5);
    expect(screen.y).toBeCloseTo(270 - 50 * 0.5);
  });

  it("rotates local +x onto screen +y at 90 degrees", () => {
    const space = { ...base, scale: { x: 1, y: 1 }, rotation: 90 };
    const origin = maskLocalToScreen(space, { x: 0, y: 0 });
    const p = maskLocalToScreen(space, { x: 10, y: 0 });
    expect(p.x - origin.x).toBeCloseTo(0);
    expect(p.y - origin.y).toBeCloseTo(5);
  });

  it("moves a dragged point by exactly the drag on a rotated clip", () => {
    const space = { ...base, rotation: 45 };
    const start = { x: 10, y: 20 };
    const s0 = maskLocalToScreen(space, start);
    const delta = screenDeltaToMaskLocal(space, { x: 7, y: -3 });
    const s1 = maskLocalToScreen(space, { x: start.x + delta.x, y: start.y + delta.y });
    expect(s1.x - s0.x).toBeCloseTo(7);
    expect(s1.y - s0.y).toBeCloseTo(-3);
  });
});
