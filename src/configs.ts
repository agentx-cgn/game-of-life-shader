import { DataTexture, FloatType, NearestFilter, RGBAFormat, ShaderMaterial, Vector2, WebGLRenderTarget } from 'three';
import { TResolution, TSize } from './types';

export function createRenderBuffer (size: TSize): WebGLRenderTarget {

  return new WebGLRenderTarget ( size.width, size.height, {

    // In this demo UV coordinates are float values in the range of [0,1].
    // If you render these values into a 32bit RGBA buffer (a render target
    // in format RGBA and type UnsignedByte), you will lose precision since
    // you can only store 8 bit (256 possible integer values) per color channel.
    // This loss is visible if you use the sampled uv coordinates for a texture fetch.
    // You can fix the issue if you add this parameter when creating the render
    // target type: THREE.FloatType.
    // The underlying texture is now a float texture that can hold your
    // uv coordinates and retain precision.

    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format:    RGBAFormat,
    type:      FloatType,
    stencilBuffer: false
  });

};

export function createShaderMaterial (
    resolution:     TResolution,
    dataTexture:    DataTexture | null,
    vertexShader:   string,
    fragmentShader: string
  ): ShaderMaterial {

  return new ShaderMaterial({
    uniforms: {
      uResolution: { value: resolution  },
      uTexture:    { value: dataTexture },
      uRandom:     { value: new Vector2(Math.random(), Math.random()) },
      uFrame:      { value: 0.0 },
      uTime:       { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
  });

}
