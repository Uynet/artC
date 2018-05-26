precision mediump float;
varying vec4 vColor;
varying vec2 vUV;
uniform sampler2D favTex;
uniform sampler2D favTexNorm;
uniform sampler2D mountainTex;
uniform sampler2D skyTex;
varying vec3 vNorm;
varying vec3 vPos;
varying float z;
uniform int texnum;
uniform vec3 eye;
uniform mat3 rotCamera;
uniform float holeRadius;

void main() {
  vec2 uv = gl_FragCoord.xy/800.0;
  vec3 light = normalize(vec3(1,1,0));
  vec3 normalMap = texture2D(favTexNorm,vUV).rgb;//法線マップのデータ
  normalMap.r *= 10.;
  normalMap.g *= 10.;
  vec3 normal = normalize(vNorm + normalMap);
  float diff = dot(normal,light);//拡散光
  vec3 color;
  float PI = 3.14159265;
  if(texnum == 0) {
    color = mix(vec3(diff) , texture2D(favTex, vUV).rgb , 0.7);
    vec3 ref = normalize(reflect(eye-vPos,normalize(normal)));
    float theta = atan(ref.z,ref.x);
    float phi = atan(ref.y,length(ref.xz));
    vec3 refColor = texture2D(skyTex, vec2(theta/PI/2.+0.5,-phi/PI+0.5)).rgb*2.;
    color = mix(color,refColor,0.3)-0.3;
  }
  if(texnum == 1){
    uv -= 0.5;
    //極座標変換する
    float r = length(uv);
    float t = atan(uv.x,uv.y);
    float r3 = r-holeRadius;//半径
    float b = holeRadius;
    float r2 = r3*r3/b;
    vec2 uv2 = vec2(r2*cos(t),r2*sin(t));
    vec3 dist = rotCamera*normalize(vec3(uv2,1.0));
    float theta = atan(dist.z,dist.x);
    float phi = atan(dist.y,length(dist.xz));
    color = texture2D(skyTex, vec2(-phi/PI+0.5,theta/PI/2.0+0.5)).rgb;
    //ブラックホール
    dist = rotCamera*normalize(vec3(uv,1.0));
    theta = atan(dist.z,dist.x);
    phi = atan(dist.y,length(dist.xz));
    if(length(r2)<holeRadius)color = texture2D(skyTex, vec2(theta/PI/2.01+0.5,-phi/PI+0.5)).rgb;
    if(length(r2)<holeRadius*0.8)color = texture2D(mountainTex, vec2(3.0*theta/PI/2.01+0.5,3.0*phi/PI+0.5)).rgb;
  }
  gl_FragColor = vec4(color,1.);
}
