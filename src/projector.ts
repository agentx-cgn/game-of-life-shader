import { Scene, PlaneGeometry, Vector3, Mesh, WebGLRenderer, OrthographicCamera, ShaderMaterial, Vector2 } from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';

import { TBuffers, TMeshes, TResolution, TScenes, TShaderMaterials, TSize } from './types';
import { createRenderBuffer, createShaderMaterial } from './configs';
import { createRandomDataTexture } from './sources';
import { Interface } from './interface';

import screenVertexShader from './shaders/screen.vertex.shader?raw';
import bufferVertexShader from './shaders/buffer.vertex.shader?raw';
import screenFragmentShader from './shaders/screen.fragment.shader?raw';
import bufferFragmentShader from './shaders/buffer.fragment.shader?raw';

export const Projector = ( function () {

  const DEBUG = true;

  let
    self: any,
    frame = 0,
    request = 0,
    isAnimated = false,
    size: TSize = { height: window.innerHeight, width: window.innerWidth },
    resolution: TResolution = new Vector3( size.width, size.height, window.devicePixelRatio ),
    plane  = new PlaneGeometry(2, 2),
    renderer: WebGLRenderer,
    controls: MapControls
  ;

  const
    scenes: TScenes = {
      buffer: new Scene(),
      screen: new Scene(),
    },
    buffers   = {} as TBuffers,
    meshes    = {} as TMeshes,
    materials = {} as TShaderMaterials,
    cameraScreen  = new OrthographicCamera(- 1, 1, 1, - 1, 0, 1),
    cameraBuffer  = new OrthographicCamera(- 1, 1, 1, - 1, 0, 1)
  ;

  return self = {

    initiate: function (canvas: HTMLCanvasElement) {

      renderer   = renderer ?? new WebGLRenderer({ canvas });

      controls = new MapControls( cameraScreen, renderer.domElement );
      controls.enableDamping = true;
      controls.screenSpacePanning  = true;
      controls.minZoom = 1.0;
      controls.maxZoom = 8;

      const bufferTexture = createRandomDataTexture(size);

      buffers.a = createRenderBuffer(size);
      buffers.b = createRenderBuffer(size);

      // The screen will receive it's texture from our off screen framebuffer
      materials.screen = createShaderMaterial(resolution, null,          screenVertexShader, screenFragmentShader);
      materials.buffer = createShaderMaterial(resolution, bufferTexture, bufferVertexShader, bufferFragmentShader);

      meshes.screen = new Mesh<typeof plane, ShaderMaterial>(plane, materials.screen);
      meshes.buffer = new Mesh<typeof plane, ShaderMaterial>(plane, materials.buffer);

      scenes.screen.add(meshes.screen);
      scenes.buffer.add(meshes.buffer);

      DEBUG && console.log('P.initiate.out');

    },

    resize: function () {

      size       = { height: window.innerHeight, width: window.innerWidth };
      resolution = new Vector3( size.width, size.height, window.devicePixelRatio );

      // const bufferTexture = createDataTexture(size);

      renderer.setSize(size.width, size.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      cameraScreen.updateProjectionMatrix()

      materials.screen.uniforms.uResolution.value.x = size.width
      materials.screen.uniforms.uResolution.value.y = size.height

      DEBUG && console.log('P.resize.out', size.width, size.height, window.devicePixelRatio);

    },

    ticker: function ( timestamp: number ) {

      Interface.stats.begin();

      frame += 1;
      const t0 = Date.now();

      // render pass 1

      // update buffer uniforms
      materials.buffer.uniforms.uRandom.value = new Vector2(Math.random(), Math.random());
      materials.buffer.uniforms.uFrame.value  = frame;
      materials.buffer.uniforms.uTime.value   = timestamp;

      // Explicitly set renderBufferA as the framebuffer to render to
      // this rendering pass will update the texture associated with renderBufferA
      renderer.setRenderTarget(buffers.a);

      // Renders Game of Life
      renderer.render(scenes.buffer, cameraBuffer);

      // copy render result back to buffer scene material
      materials.buffer.uniforms.uTexture.value = buffers.a.texture;

      // update texture of screen material with texture from pass above
      materials.screen.uniforms.uTexture.value = buffers.a.texture;

      // swap the buffers
      [buffers.a, buffers.b] = [buffers.b, buffers.a];

      // render pass 2

      // required if controls.enableDamping or controls.autoRotate are set to true
	    controls.update();

      // This will set the default framebuffer (i.e. the canvas) back to being the output
      renderer.setRenderTarget(null);

      // Render to screen/canvas
      renderer.render(scenes.screen, cameraScreen);

      // Finally
      Interface.debug({
        frame,
        stamp:    (timestamp / 1000).toFixed(2),
        duration: Date.now() - t0,
        width:    size.width,
        height:   size.height
      });

      Interface.stats.end();

    },

    animate: function ( continued: 'start' | 'stop' | 'step' ) {

      DEBUG && console.log('P.animate', continued);

      if (continued === 'stop') {
        isAnimated = false;
        cancelAnimationFrame(request);
        return;

      } else if (continued === 'start') {
        isAnimated = true;
        frame = 0;

      } else if (continued === 'step') {
        isAnimated = false;
        cancelAnimationFrame(request);

      }

      // Call ticker again on the next frame
      request = window.requestAnimationFrame(function runner (timestamp) {
        self.ticker(timestamp);
        if ( isAnimated ) {
          request = window.requestAnimationFrame(runner);
        }
      });

    }

  };

})();

