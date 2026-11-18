"use client";

import { defaultFilterVert, Filter, GlProgram, UniformGroup } from "pixi.js";

/**
 * A sharpen filter (unsharp mask with a 4-neighbour kernel).
 *
 * Each pixel is pushed away from the average of its four direct neighbours by
 * `amount`, which boosts local contrast along edges. `uInputSize` is Pixi's
 * built-in uniform (width, height, 1/width, 1/height) used to step one texel.
 * Alpha is left alone; the colour is premultiplied, so the result is clamped to
 * the pixel's own alpha to stay a valid premultiplied value.
 */
const fragment = /* glsl */ `
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform highp vec4 uInputSize;
uniform float uAmount;

void main() {
    vec2 texel = uInputSize.zw;
    vec4 center = texture(uTexture, vTextureCoord);
    vec3 around =
        texture(uTexture, vTextureCoord + vec2(texel.x, 0.0)).rgb +
        texture(uTexture, vTextureCoord - vec2(texel.x, 0.0)).rgb +
        texture(uTexture, vTextureCoord + vec2(0.0, texel.y)).rgb +
        texture(uTexture, vTextureCoord - vec2(0.0, texel.y)).rgb;
    vec3 sharpened = center.rgb + uAmount * (4.0 * center.rgb - around);
    finalColor = vec4(clamp(sharpened, 0.0, center.a), center.a);
}
`;

export class SharpenFilter extends Filter {
  constructor() {
    super({
      glProgram: GlProgram.from({ vertex: defaultFilterVert, fragment, name: "sharpen" }),
      resources: {
        sharpenUniforms: new UniformGroup({
          uAmount: { value: 0.5, type: "f32" },
        }),
      },
    });
  }

  /** Strength of the sharpening; 0 leaves the image unchanged. */
  set amount(value: number) {
    (this.resources.sharpenUniforms as UniformGroup).uniforms.uAmount = value;
  }
}
