import Main from "./main.js";
import Input from "./input.js";
export default class Camera{
  constructor(){
    this.acc = vec3(0,0,0);
    this.vel = vec3(0,0,0);
    this.pos = vec3(0,0,-9.00),//座標
    this.up = vec3(0,0,1),//カメラの上方向
    this.alpha = 0;//カメラのz軸方向の回転?
    this.beta = 0;//カメラのx軸方向の回転?
    this.gamma = 0;//カメラのy軸方向の回転?
  }
  Update(program){
    const gl = Main.gl;

    this.vel = adv(this.vel,this.acc);
    this.pos = adv(this.pos,this.vel);

    let eye = [
      this.pos.x,
      this.pos.y,
      this.pos.z,
    ];

    //debug
    if(Input.isKeyInput(88))this.alpha += 0.02;
    if(Input.isKeyInput(90))this.alpha -= 0.02;
    if(Input.isKeyInput(38))this.beta += 0.02;
    if(Input.isKeyInput(40))this.beta -= 0.02;
    if(Input.isKeyInput(37))this.gamma += 0.02;
    if(Input.isKeyInput(39))this.gamma -= 0.02;
    if(Input.isKeyInput(32)){
      this.pos = adv(this.pos,this.forward);
    }
    if(Input.isKeyInput(70)){
      this.pos = subv(this.pos,this.forward);
    }
    if(this.gamma>Math.PI/2)this.gamma -= Math.PI;
    if(this.gamma<-Math.PI/2)this.gamma += Math.PI;
    if(this.beta>Math.PI)this.beta -= 2*Math.PI;
    if(this.beta<-Math.PI)this.beta += 2*Math.PI;
    let b = this.beta;//x
    let c = this.gamma//y;
    let a = this.alpha;//z
      let rotCameraAlpha = [
        cos(a),-sin(a),0,
        sin(a),cos(a),0,
        0,0,1,
      ]
      let rotCameraBeta = [
        1,0,0,
        0,cos(b),-sin(b),
        0,sin(b),cos(b),
      ]
      let rotCameraGamma = [
        cos(c),0,-sin(c),
        0,1,0,
        sin(c),0,cos(c),
      ]
      let rotCamera = multMatrix3(rotCameraBeta,rotCameraGamma);
    rotCamera = multMatrix3(rotCamera,rotCameraAlpha);
    let forward = multMatrixVec3(rotCamera,[0,0,-1]);
    let up = multMatrixVec3(rotCamera,[0,1,0]);
    this.forward = {
      x : forward[0],
      y : forward[1],
      z : forward[2],
    }
    this.up = {
      x : up[0],
      y : up[1],
      z : up[2],
    }

    gl.uniformMatrix3fv(gl.getUniformLocation(program.id,"rotCamera"),false,rotCamera);
    gl.uniform3fv(gl.getUniformLocation(program.id,"eye"),eye);
  }
}
