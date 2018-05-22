precision mediump float;
varying vec4 vColor;
varying vec2 vUV;
uniform sampler2D favTex;
uniform sampler2D skyTex;
varying vec3 normal;

void main() {
  vec2 uv = gl_FragCoord.xy/512.0;
  vec3 light = normalize(vec3(-1,0,0));
  float diff = 5.0*dot(normal,light);
  vec3 color = diff+texture2D(favTex, vUV).rgb;
  gl_FragColor = vec4(color,1.);
}
