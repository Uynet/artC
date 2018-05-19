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
const adv = (v1,v2)=>{
  return {
    x : v1.x+v2.x,
    y : v1.y+v2.y,
  }
}
const subv = (v1,v2)=>{
  return {
    x : v1.x-v2.x,
    y : v1.y-v2.y,
  }
}
//スカラー倍
const mlv = (a,v)=>{
  return {
    x : a*v.x,
    y : a*v.y,
  }
}
const dist = (p1,p2)=>{
  return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
}
const lenqth =(v)=>{
  return Math.sqrt(v.x*v.x + v.y*v.y);
}
const lenqth2 = (v)=>{
  return v.x*v.x + v.y*v.y;
}
//正規化
const nomalize = (v)=>{
  let d = v.x*v.x + v.y*v.y;
  return {
    x : v.x/d,
    y : v.y/d,
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
const cos = Math.cos;
const sin = Math.sin;
