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
const cos = Math.cos;
const sin = Math.sin;
