precision mediump float;

uniform sampler2D skyTex;
varying vec2 vUV;

void main(){
  vec3 color = texture2D(skyTex,vUV).rgb;
  gl_FragColor = vec4(color,1.0);
}
