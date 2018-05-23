precision mediump float;
varying vec4 vColor;
varying vec2 vUV;
uniform sampler2D favTex;
uniform sampler2D skyTex;
varying vec3 vNorm;
varying vec3 vPos;
varying float z;
uniform int texnum;
uniform vec3 eye;

void main() {
  vec2 uv = gl_FragCoord.xy/512.0;
  vec3 light = normalize(vec3(1,1,0));
  float diff = dot(vNorm,light);
  vec3 color = vec3(0);
  if(texnum == 0) {
    color = diff*0.8 + texture2D(favTex, vUV).rgb - 0.2;
    
    float PI = 3.14159265;
    vec3 ref = normalize(reflect(eye-vPos,normalize(vNorm)));
    float theta = atan(ref.z,ref.x);
    float phi = atan(ref.y,length(ref.xz));
    vec3 refColor = texture2D(skyTex, vec2(theta/PI/2.0001+0.5,-phi/PI+0.5)).rgb;
    color = mix(color,refColor,0.6);
  }
  if(texnum == 1){
    color = texture2D(skyTex, vUV).rgb;
  }
  gl_FragColor = vec4(color,1.);
}
