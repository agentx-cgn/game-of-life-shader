
import { DataTexture, RGBAFormat } from 'three';
import { TSize } from './types';

export function createRandomDataTexture( size: TSize ): DataTexture {

    // create a buffer with random color data of dead or alive

    const ratio  = 0.8;
    const pixels = size.width * size.height;
    const data   = new Uint8Array(4 * pixels);

    for (let i = 0; i < pixels; i++) {
      const stride = i * 4;

      if ( Math.random() < ratio ) {
        // alive
        data[stride + 0] = 255 * 0.8;
        data[stride + 1] = 255 * 0.8;
        data[stride + 2] = 255 * 0.8;
        data[stride + 3] = 255;

      } else {
        // dead
        data[stride + 0] = 0;
        data[stride + 1] = 0;
        data[stride + 2] = 0;
        data[stride + 3] = 255;

      }
    }

    // used the buffer to create a DataTexture
    const texture = new DataTexture(
      data,
      size.width,
      size.height,
      RGBAFormat
    );

    // just a weird thing that Three.js wants you to do after you set the data for the texture
    texture.needsUpdate = true;

    return texture;

  }
