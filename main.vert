attribute vec4 color;
attribute vec3 position;
varying vec4 vColor;
uniform mat4 rotMatrix;
uniform mat4 viewMatrix;

attribute vec2 uv;
varying vec2 vUV;

void main(){
  vUV = uv;
  vColor = color;
  vec4 a = rotMatrix*vec4(position,1.0);
  gl_Position = viewMatrix*a;
}
