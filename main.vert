attribute vec2 position;

void main(){
  vec2 pos = position;
  gl_Position = vec4(pos,0.,1.);
}
