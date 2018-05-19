attribute vec4 color;
attribute vec3 position;
varying vec4 vColor;
uniform mat4 viewMatrix;

void main(){
  vColor = color;
  vec4 a = viewMatrix*vec4(position,1.0);
  //vec4 a = vec4(position,1.0)+vec4(0,0,0,1);
  gl_Position = a;
}
