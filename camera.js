import Main from "./main.js";
import Input from "./input.js";

export default class Camera{
  constructor(){
    this.acc = vec3(0,0,0);
    this.vel = vec3(0,0,0);
    this.pos = vec3(0,0,0),//座標
    this.up = vec3(0,0,1),//カメラの上方向
    this.alpha = 0;//カメラのz軸方向の回転?
    this.beta = 0;//カメラのx軸方向の回転?
    this.gamma = 0;//カメラのy軸方向の回転?
    this.asp = Main.canvas.width/Main.canvas.height;
  }
  Update(program){
    const gl = Main.gl;

    this.vel = adv(this.vel,this.acc);
    this.vel.x *= 0.95;
    this.vel.y *= 0.95;
    this.vel.z *= 0.95;
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
    //beta  x
    //gamm  y
    //alpha z
    //
    // gba
    // gab
    // agb
    // abg
    // bag

    let rotCamera = multMatrix3(rotCameraBeta,rotCameraAlpha);
    rotCamera = multMatrix3(rotCamera,rotCameraGamma);
    //ここは転置しない
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
    gl.uniform3fv(gl.getUniformLocation(program.id,"forward"),forward);
    //view and projection
    this.Matrix(program);
  }
  Matrix(program){
    this.viewMatrix = this.LookAt(this.pos,this.forward,this.up);
    let timer = Main.timer;
    const near = 0.0;
    const far = 6
    const t = 0.8;//画角

    this.projMatrix = [
      1 / (this.asp * t),0,0,0,
      0,1/t,0,0,
      0,0,(near+far) / (near-far), -1,
      0,0,2*near*far/(near-far),0.001
    ];
    const loc2 = Main.gl.getUniformLocation(program.id, "viewMatrix");
    const loc3 = Main.gl.getUniformLocation(program.id, "projMatrix");
    Main.gl.uniformMatrix4fv(loc2,false,this.viewMatrix);
    Main.gl.uniformMatrix4fv(loc3,false,this.projMatrix);
  }
  LookAt(eye,forward,up){
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
