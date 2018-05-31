precision mediump float;
varying vec4 vColor;
varying vec2 vUV;

uniform sampler2D favTex;
uniform sampler2D favTexNorm;
uniform sampler2D mountainTex;
uniform sampler2D skyTex;
uniform sampler2D dome3Tex;
uniform sampler2D dome4Tex;
uniform sampler2D dome5Tex;

varying vec3 vNorm;
varying vec3 vPos;
varying float z;
uniform int texnum;
uniform int openTexnum;
//0 : usual
//1 : growing
//2 : open 
//3 : shrink
uniform int state;

uniform vec3 eye;
uniform vec3 forward;
uniform vec3 up;
uniform vec3 side;

uniform float asp;
uniform float holeRadius;


vec3 TextureColor(int tex,vec2 pos){
  if(pos.x>1.0)pos.x = 0.99;
  if(pos.x<0.0)pos.x = 0.01;
  if(pos.y>1.0)pos.y = 0.99;
  if(pos.y<0.0)pos.y = 0.01;
  if(tex == 0)return texture2D(favTex,pos).rgb;
  if(tex == 1)return texture2D(skyTex,pos).rgb;
  if(tex == 2)return texture2D(mountainTex,pos).rgb;
  if(tex == 3)return texture2D(dome3Tex,pos).rgb;
  if(tex == 4)return texture2D(dome4Tex,pos).rgb;
  if(tex == 5)return texture2D(dome5Tex,pos).rgb;
}
void main() {
  vec2 uv = gl_FragCoord.xy/800.0;
  vec3 light = normalize(vec3(1,1,0));
  vec3 normal = vNorm;
  vec3 color;
  float PI = 3.14159265;
  if(state == 0||state == 1) {
    vec3 normalMap = texture2D(favTexNorm,vUV).rgb;//法線マップのデータ
    normal = normalize(vNorm + normalMap);
    float diff = max(0.0,dot(normal,light));//拡散光
    color = mix(vec3(diff) , TextureColor(texnum, vUV).rgb , 0.7);

    vec3 ref = normalize(reflect(eye-vPos,normalize(normal)));
    float theta = atan(ref.z,ref.x);
    float phi = atan(ref.y,length(ref.xz));
    vec3 refColor = TextureColor(openTexnum,vec2(theta/PI/2.+0.5,-phi/PI+0.5));
    color = mix(color,refColor,0.3)-0.3;
  }
  if( state == 2 || state == 3){
    uv -= 0.5;
    //極座標変換する
    /*
    float r = length(uv);
    float t = atan(uv.y,uv.x);
    float b = holeRadius;
    float r3 = r-b;//半径
    float r2 = r;
    vec2 uv2 = vec2(r2*cos(t),r2*sin(t));
    */
    vec3 dist = normalize(forward + uv.x*asp*side + uv.y*up);
    float theta = atan(-dist.z,dist.x);
    float phi = atan(dist.y,length(dist.xz));
    color = TextureColor(texnum,vec2(theta/PI/2.00+0.5,-phi/(PI+0.00)+0.5));
    //color = texture2D(skyTex, vec2(-phi/PI+0.5,theta/PI/2.0+0.5)).rgb;
    //ブラックホール
    /*
    dist = rotCamera*normalize(vec3(uv,-1.0));
    theta = atan(dist.z,dist.x);
    phi = atan(dist.y,length(dist.xz));
    if(length(uv2)<holeRadius)color = texture2D(skyTex, vec2(theta/PI/2.01+0.5,-phi/PI+0.5)).rgb;
    if(length(uv2)<holeRadius*0.8)color = texture2D(mountainTex, vec2(3.0*theta/PI/2.01+0.5,3.0*phi/PI+0.5)).rgb;
    */
  }
  gl_FragColor = vec4(color,1.);
}
