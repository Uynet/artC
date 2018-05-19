import Main from "./main.js";
export default class Matrix{
  //使ってない
  static Init(){
    this.viewMatrix = [];
    this.rotMatrix = [];
  }
  static Update(){
    let timer = Main.timer;
    let rot1 = [
      cos(timer/30),0,-sin(timer/30),0,
      0,1,0,0,
      sin(timer/30),0,cos(timer/30),0,
      0,0,0,1,
    ];
    let e1 = [
      cos(timer/20),-sin(timer/20),0,0,
      sin(timer/20),cos(timer/20),0,0,
      0,0,1,0,
      0,0,0,1,
    ];
    let e2 = [
      1,0,0,0,
      0,cos(timer/15),-sin(timer/15),0,
      0,sin(timer/15),cos(timer/15),0,
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
    ]
  }
}
