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
uniform mat3 rotCameraTheta;
uniform mat3 rotCameraPhi;

void main() {
  vec3 light = normalize(vec3(1,1,0));
  float diff = dot(vNorm,light);
  vec3 color = vec3(0);
  float PI = 3.14159265;
  if(texnum == 0) {
    color = diff*0.8 + texture2D(favTex, vUV).rgb - 0.2;
    vec3 ref = normalize(reflect(eye-vPos,normalize(vNorm)));
    float theta = atan(ref.z,ref.x);
    float phi = atan(ref.y,length(ref.xz));
    vec3 refColor = texture2D(skyTex, vec2(theta/PI/2.0001+0.5,-phi/PI+0.5)).rgb;
    color = mix(color,refColor,0.6);
  }
  if(texnum == 1){
    vec2 uv = gl_FragCoord.xy/512.0-0.5;
    float r = length(uv);
    float t = atan(uv.x,uv.y);
    float po = PI/16.0;
    float a = 0.1;//半径
    float b = 0.1;
    float r2 = (r-a)*(r-a)/b;
    vec2 uv2 = vec2(r2*cos(t),r2*sin(t));
    vec3 dist = rotCameraPhi*rotCameraTheta*normalize(vec3(uv2,1.0));
    float theta = atan(dist.z,dist.x);
    float phi = atan(dist.y,length(dist.xz));
    color = texture2D(skyTex, vec2(theta/PI/1.0000+0.5,-phi/PI+0.5)).rgb;
    if(length(uv2)<a)color = vec3(0);
  }
  gl_FragColor = vec4(color,1.);
}
