attribute vec3 position;
attribute vec3 normal;
varying vec3 vNorm;
varying vec3 vPos;

uniform mat4 rotMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 beat;

uniform vec3 center;

attribute vec2 uv;
varying vec2 vUV;

void main(){
  vPos = position;
  vNorm = normal;
  vec4 i = rotMatrix*vec4(vNorm,1.0);
  vNorm = i.xyz;
  vUV = uv;
  vec4 a = vec4(position,1.0);
  a -= vec4(center,0);
  //a = rotMatrix*a;
  a *= beat;
  a += vec4(center,0);
  gl_Position = projMatrix * viewMatrix * a;
}
