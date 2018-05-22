attribute vec3 position;
attribute vec2 uv;
varying vec2 vUV;

uniform mat4 viewMatrix;
uniform mat4 projMatrix;

void main(){
  vUV = uv;
  vec4 a = vec4(position,1.0);
  gl_Position = projMatrix * viewMatrix * a;
 // gl_Position = vec4(position,0.04999,0.05);
}
