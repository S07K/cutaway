"use client";

import { defaultFilterVert, Filter, GlProgram, UniformGroup } from "pixi.js";

/**
 * A pixelate (mosaic) filter.
 *
 * The filtered area is divided into square cells of `size` pixels and every
 * pixel samples the centre of its cell. `uInputSize` is Pixi's built-in uniform
 * (width, height, 1/width, 1/height) of the input texture, which converts the
 * pixel size into texture coordinates.
 */
const fragment = /* glsl */ `
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform highp vec4 uInputSize;
uniform float uSize;

void main() {
    vec2 cell = max(uSize, 1.0) * uInputSize.zw;
    vec2 uv = (floor(vTextureCoord / cell) + 0.5) * cell;
    finalColor = texture(uTexture, min(uv, vec2(1.0)));
}
`;

export class PixelateFilter extends Filter {
  constructor() {
    super({
      glProgram: GlProgram.from({ vertex: defaultFilterVert, fragment, name: "pixelate" }),
      resources: {
        pixelateUniforms: new UniformGroup({
          uSize: { value: 10, type: "f32" },
        }),
      },
    });
  }

  /** Cell edge length in pixels. */
  set size(value: number) {
    (this.resources.pixelateUniforms as UniformGroup).uniforms.uSize = value;
  }
}
