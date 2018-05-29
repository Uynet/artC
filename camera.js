import Main from "./main.js";
import Input from "./input.js";
import EntityManager from "./entityManager.js";

export default class Camera{
  constructor(){
    this.acc = vec3(0,0,0);
    this.vel = vec3(0,0,0);
    this.pos = vec3(0,0,0),//座標
    this.forward = vec3(0,0,-1),//正面
    this.up = vec3(0,1,0),//上
    this.side = vec3(-1,0,0),//左
    this.alpha = 0;//カメラのz軸方向の回転?
    this.beta = 0;//カメラのx軸方向の回転?
    this.gamma = 0;//カメラのy軸方向の回転?
    this.asp = Main.canvas.width/Main.canvas.height;
  }
  Update(program){
    const gl = Main.gl;

    this.vel = adv(this.vel,this.acc);
    this.pos = adv(this.pos,this.vel);
    this.vel.x *= 0.15;
    this.vel.y *= 0.15;
    this.vel.z *= 0.15;

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
    let a = -this.alpha;//z
      let rotAlpha = [
        cos(a),-sin(a),0,
        sin(a),cos(a),0,
        0,0,1,
      ]
      let rotBeta = [
        1,0,0,
        0,cos(b),-sin(b),
        0,sin(b),cos(b),
      ]
      let rotGamma = [
        cos(c),0,-sin(c),
        0,1,0,
        sin(c),0,cos(c),
      ]

    let rotCamera = multMatrix3(multMatrix3(rotAlpha,rotBeta),rotGamma);
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
    this.side = cross(this.up,this.forward);
    let side = [this.side.x,this.side.y,this.side.z]; 

    //整合性
    gl.uniform3fv(gl.getUniformLocation(program.id,"eye"),eye);
    gl.uniform3fv(gl.getUniformLocation(program.id,"forward"),forward);
    gl.uniform3fv(gl.getUniformLocation(program.id,"up"),up);
    gl.uniform3fv(gl.getUniformLocation(program.id,"side"),side);
    //view and projection
    this.Matrix(program);
  }
  Matrix(program){
    this.viewMatrix = this.LookAt(this.pos,this.forward,this.up);
    let timer = Main.timer;
    const near = 0.0;
    const far = 6;
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
    Main.gl.uniform1f(Main.gl.getUniformLocation(program.id,"asp"),this.asp);
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
  RayCast(x,y){
    const u = x/Main.canvas.width -0.5;
    const v = -(y/Main.canvas.height -0.5);
    this.side = cross(this.up,this.forward);
    let side = mlv(u,this.side);
    let up = mlv(v,this.up);
    let ray = normalize(adv(adv(this.forward,side),up));
    
    EntityManager.list.forEach(e=>{
      if(dot(normalize(subv(e.pos,this.pos)),ray)<-0.97)e.Tap();
    });
  }
}
