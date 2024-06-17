import { Mesh, Scene, ShaderMaterial, Texture, Vector3, WebGLRenderTarget } from "three"

export type TSize = {
  width: number
  height: number
}

export type TBuffers = Record<string, WebGLRenderTarget<Texture>>
export type TScenes  = Record<string, Scene>
export type TShaderMaterials  = Record<string, ShaderMaterial>
export type TMeshes  = Record<string, Mesh>

export type TResolution = Vector3;



