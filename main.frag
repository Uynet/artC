precision mediump float;
varying vec4 vColor;
varying vec2 vUV;
uniform sampler2D tex;
varying vec3 normal;

void main() {
  vec3 light = normalize(vec3(-1,0,0));
  float diff = 5.0*dot(normal,light);
  vec3 color = diff+texture2D(tex, vUV).rgb;
  gl_FragColor = vec4(color,1.);
}
