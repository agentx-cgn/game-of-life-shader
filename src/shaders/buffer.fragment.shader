precision mediump float;

//Our input texture
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uRandom;
uniform float uTime;
uniform float uFrame;

varying vec2 vUvs;

float GetNeighbours(vec2 p) {
  float count = 0.0;

  for(float y = -1.0; y <= 1.0; y++) {
    for(float x = -1.0; x <= 1.0; x++) {

      if(x == 0.0 && y == 0.0)
          continue;

      // Scale the offset down
      vec2 offset = vec2(x, y) / uResolution.xy;
      // Apply offset and sample texture
      vec4 lookup = texture2D(uTexture, p + offset);
      // Accumulate the result
      count += lookup.r > 0.5 ? 1.0 : 0.0;
    }
  }

  return count;

}

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

// discussion: https://www.reedbeta.com/blog/hash-functions-for-gpu-rendering/
// fract(sin(dot(TIME, vec2(12.9898, 4.1414))) * 43758.5453

void main() {

  /*
    Using a tempoary variable for the output value for clarity.
    it is just passed to fragColor at the end of the function.
  */
  vec3 color     = vec3(0.0);
  vec3 colorLife = vec3(1.0, 0.6, 0.6);

  /*
    Time to count the population of the neighborhood!
    We count all the live cells in a 3 wide, 3 tall area
    centered on this cell.
     _ _ _
    |_|_|_|     [-1, -1], [0, -1], [1, -1],
    |_|_|_|  =  [-1,  0], [0,  0], [1,  0],
    |_|_|_|     [-1,  1], [0,  1], [1,  1],

    Since each cell only should hold a value of either 0 (dead) or 1 (alive),
    the count yields an integer value, but since the
    texture sampling returns a float, we will use that instead.
  */
  float neighbors = 0.0;

  neighbors += GetNeighbours(vUvs);

  vec3 curColor = texture2D(uTexture, vUvs).xyz;

  bool alive = texture2D(uTexture, vUvs).x > 0.5;

  // cell is alive
  if(alive) {

    if (neighbors == 2.0 || neighbors == 3.0) {
      // Any live cell with two or three live neighbours lives on to the next generation.
      // curColor.x = max(curColor.x, 0.8);
      // color = curColor * 1.1;
      color = vec3(curColor.x, min(curColor.y, 0.8), curColor.z);
      color.y *= 1.1;

    } else {
      // cell dies and degrades
      curColor.x = min(curColor.x, 0.5);
      color = curColor / 1.05;
    }

  // cell is dead
  } else if(!alive) {

    if (neighbors == 3.0) {
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      curColor.x = max(curColor.x, 0.8);
      color = curColor * 1.1;

    } else {
      // cell stays dead and degrades
      curColor.x = min(curColor.x, 0.5);
      color = curColor / 1.05;
    }

  }

  // replace right most pixels
  if (vUvs.x > 1.0 - (1.0 / uResolution.x)) {

    gl_FragColor = rand(vUvs * uRandom.x * 13.0) > 0.92
      ? vec4(vec3(0.8, 0.1, 0.1), 1.0)
      : vec4(0.0, 0.0, 0.0, 1.0)
    ;

  } else {
    gl_FragColor = vec4(color, 1.0);

  }





}
