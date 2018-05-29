uniform vec3 forward;
uniform vec3 up;
uniform vec3 side;

uniform sampler2D mountainTex;
uniform sampler2D skyTex;

int main(){
  vec2 uv = gl_FragCoord.xy/800.0;
  uv -= 0.5;
  vec3 dist = normalize(forward + uv.x*side + uv.y*up);
  float theta = atan(-dist.z,dist.x);
  float phi = atan(dist.y,length(dist.xz));
  color = texture2D(skyTex, vec2(theta/PI/2.01+0.5,-phi/(PI+0.01)+0.5)).rgb;
  gl_FragColor = vec4(color,1.0);
}

