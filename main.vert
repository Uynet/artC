attribute vec4 color; attribute vec3 position;
varying vec4 vColor;
uniform mat4 rotMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 poMatrix;

attribute vec2 uv;
varying vec2 vUV;

void main(){
  vUV = uv;
  vColor = color;
  vec4 a = rotMatrix*vec4(position,1.0);
  a *= poMatrix;
  gl_Position = projMatrix * viewMatrix * a;
}
