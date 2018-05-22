precision mediump float;
varying vec4 vColor;
varying vec2 vUV;
uniform sampler2D favTex;
uniform sampler2D skyTex;
varying vec3 vNorm;

void main() {
  vec2 uv = gl_FragCoord.xy/512.0;
  vec3 light = normalize(vec3(1,1,0));
  float diff = dot(vNorm,light);
  vec3 color = diff*0.8 + texture2D(favTex, vUV).rgb - 0.2;
  gl_FragColor = vec4(color,1.);
}
