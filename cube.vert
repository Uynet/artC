attribute vec4 color;
attribute vec3 position;
varying vec4 vColor;
attribute vec3 normal;
varying vec3 vNorm;
varying vec3 vPos;

varying float z;

uniform mat4 rotMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 poMatrix;

attribute vec2 uv;
varying vec2 vUV;

void main(){
  vPos = position;
  vNorm = normal;
  vec4 i = rotMatrix*vec4(vNorm,1.0);
  vNorm = i.xyz;
  vUV = uv;
  vColor = color;
  vec4 a = rotMatrix*vec4(position,1.0);
  a *= poMatrix;
  z = a.z;
  gl_Position = projMatrix * viewMatrix * a;
}
