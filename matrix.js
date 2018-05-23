import Main from "./main.js";
export default class Matrix{
  static Init(){
    this.viewMatrix = [];
    this.rotMatrix = [];
    this.projMatrix = [];
  }
  static Size(t){
    let k = t%60;
    if(k < 5)k= 0.6/(k+3);
    else k =0;
    return 1-k;
  }
  static Update(){
    let timer = Main.timer;
    let s = this.Size(timer);
    const near = 0.0;
    const far = 1000;
    const t = 1;//画角
    const asp = 1;//アスペクト日
    this.projMatrix = [
      1 / (asp * t),0,0,0,
      0,1/t,0,0,
      0,0,(near+far) / (near-far), -1,
      0,0,2*near*far/(near-far),0.001
    ];
    this.poMatrix = [
      s,0,0,0,
      0,s,0,0,
      0,0,s,0,
      0,0,0,1,
    ]
    let rot1 = [
      cos(timer/57),0,-sin(timer/57),0,
      0,1,0,0,
      sin(timer/57),0,cos(timer/57),0,
      0,0,0,1,
    ];
    let e1 = [
      cos(timer/71),-sin(timer/71),0,0,
      sin(timer/71),cos(timer/71),0,0,
      0,0,1,0,
      0,0,0,1,
    ];
    let e2 = [
      1,0,0,0,
      0,cos(timer/41),-sin(timer/41),0,
      0,sin(timer/41),cos(timer/41),0,
      0,0,0,1,
    ];
    this.viewMatrix = this.LookAt(Main.camera.pos,Main.camera.forward,Main.camera.up);
    let po = multMatrix(e1,e2);
    this.rotMatrix = multMatrix(rot1,po);
  }
  static LookAt(eye,forward,up){
    const side = normalize(cross(forward,up));
    up = normalize(cross(forward, side));
    return [
      side.x, up.x, forward.x, 0,
      side.y, up.y, forward.y, 0,
      side.z, up.z, forward.z, 0,
      -dot(eye, side), -dot(eye, up), -dot(eye, forward), 1
    ];
  }
}
