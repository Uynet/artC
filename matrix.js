import Main from "./main.js";
export default class Matrix{
  static Init(){
    this.viewMatrix = [];
    this.rotMatrix = [];
    this.projMatrix = [];
  }
  static Update(){
    this.viewMatrix = this.LookAt(Main.camera.pos,Main.camera.forward,Main.camera.up);
    let timer = Main.timer;
    const near = 0.0;
    const far = 6
    const t = 0.8;//画角
    const asp = 1;//アスペクト日
    this.projMatrix = [
      1 / (asp * t),0,0,0,
      0,1/t,0,0,
      0,0,(near+far) / (near-far), -1,
      0,0,2*near*far/(near-far),0.001
    ];
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
