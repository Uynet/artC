precision mediump float;

void main(){
  vec2 uv = gl_FragCoord.xy/512.0;
  gl_FragColor = vec4(uv,1.0,1.0);
}
