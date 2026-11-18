"use client";

import { defaultFilterVert, Filter, GlProgram, UniformGroup } from "pixi.js";

/**
 * A vignette: darkens the frame towards its edges.
 *
 * Distance is measured from the centre of the filtered area and normalised so
 * the corners sit at 1. Pixels closer than `radius` are untouched; beyond it the
 * darkening ramps up over `softness`, scaled by `amount`. Pixi stores
 * premultiplied colour, so scaling rgb alone darkens without touching alpha.
 */
const fragment = /* glsl */ `
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform float uAmount;
uniform float uRadius;
uniform float uSoftness;

void main() {
    vec4 color = texture(uTexture, vTextureCoord);
    float dist = length((vTextureCoord - 0.5) * 2.0) / 1.41421356;
    float falloff = smoothstep(uRadius, uRadius + uSoftness + 0.0001, dist);
    color.rgb *= 1.0 - uAmount * falloff;
    finalColor = color;
}
`;

export class VignetteFilter extends Filter {
  constructor() {
    super({
      glProgram: GlProgram.from({ vertex: defaultFilterVert, fragment, name: "vignette" }),
      resources: {
        vignetteUniforms: new UniformGroup({
          uAmount: { value: 0.5, type: "f32" },
          uRadius: { value: 0.5, type: "f32" },
          uSoftness: { value: 0.5, type: "f32" },
        }),
      },
    });
  }

  private get uniforms() {
    return (this.resources.vignetteUniforms as UniformGroup).uniforms as {
      uAmount: number;
      uRadius: number;
      uSoftness: number;
    };
  }

  set amount(value: number) {
    this.uniforms.uAmount = value;
  }

  set radius(value: number) {
    this.uniforms.uRadius = value;
  }

  set softness(value: number) {
    this.uniforms.uSoftness = value;
  }
}
