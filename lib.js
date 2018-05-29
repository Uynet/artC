const cl = console.log;
const vec0 = ()=>{
  return {
    x : 0,
    y : 0,
  }
}
const vec2 = (x,y)=>{
  return {
    x : x,
    y : y,
  }
}
const vec3 = (x,y,z)=>{
  return {
    x : x,
    y : y,
    z : z,
  }
}
const adv = (v1,v2)=>{
  return {
    x : v1.x+v2.x,
    y : v1.y+v2.y,
    z : v1.z+v2.z,
  }
}
const subv = (v1,v2)=>{
  return {
    x : v1.x-v2.x,
    y : v1.y-v2.y,
    z : v1.z-v2.z,
  }
}
//スカラー倍
const mlv = (a,v)=>{
  return {
    x : a*v.x,
    y : a*v.y,
    z : a*v.z,
  }
}
const dist = (p1,p2)=>{
  return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
}
const lenqth =(v)=>{
  return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
}
const lenqth2 = (v)=>{
  return v.x*v.x + v.y*v.y + v.z*v.z;
}
//正規化
const normalize = (v)=>{
  let d = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
  return {
    x : v.x/d,
    y : v.y/d,
    z : v.z/d,
  }
}
//4次元のみ　
const multMatrix = (m1,m2)=>{
  let m = new Array(16).fill(0);
  for(let y=0;y<4;y++){
    for(let x=0;x<4;x++){
      for(let i = 0;i<4;i++){
        m[4*y+x] += m1[4*y+i]*m2[4*i+x]; 
      }
    }
  }
  return m;
}
//3次元のみ　
const multMatrix3 = (m1,m2)=>{
  let m = new Array(9).fill(0);
  for(let y=0;y<3;y++){
    for(let x=0;x<3;x++){
      for(let i = 0;i<3;i++){
        m[3*y+x] += m1[3*y+i]*m2[3*i+x]; 
      }
    }
  }
  return m;
}

const multMatrixVec3 = (m1,v1)=>{
  let v = new Array(3).fill(0);
  for(let y=0;y<3;y++){
    for(let x=0;x<3;x++){
      v[y] += m1[3*y+x]*v1[x]; 
    }
  }
  return v;
}
//外積 3次元のみ
const cross = (v1,v2)=>{
  return {
    x : v1.y*v2.z - v1.z*v2.y,
    y : v1.z*v2.x - v1.x*v2.z,
    z : v1.x*v2.y - v1.y*v2.x,
  }
}
const dot = (v1,v2)=>{
  return v1.x*v2.x+v1.y*v2.y+v1.z*v2.z;
}
const rand = (d)=>{
  return d*(Math.random()-0.5);
}
const rand3d = (d)=>{
  return {
    x:d*(Math.random()-0.5),
    y:d*(Math.random()-0.5),
    z:d*(Math.random()-0.5),
  }
}
const cos = Math.cos;
const sin = Math.sin;

const rotX4 = (a)=>{
  return [
    1,0,0,0,
    0,cos(a),-sin(a),0,
    0,sin(a),cos(a),0,
    0,0,0,1,
  ]
}
