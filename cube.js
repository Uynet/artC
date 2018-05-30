import Main from "./main.js";
import GLObject from "./GLObject/glObject.js";
import VertexBuffer from "./GLObject/vertexBuffer.js";
import EntityManager from "./entityManager.js";

let polygonID = 0;

const State = {
  usual : 0,
  growing : 1,
  open : 2,
  shrinking : 3,
}


export default class Cube{
  constructor(pos,size,textureID,program){
    this.pos = pos;
    this.textureID = textureID;
    this.polygonID = polygonID;
    polygonID += 6;
    this.seed = rand3d(15);
    this.program = program;
    this.state = State.usual;
    if(textureID == 1){
      this.state = State.open;
      EntityManager.openCube = this;
    }
    this.size = size;

    let E4 = [
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1,
    ]
    this.grow = [
      this.size,0,0,0,
      0,this.size,0,0,
      0,0,this.size,0,
      0,0,0,1,
    ]
    this.beat = E4;
    this.rotMatrix = E4;


    this.position = [
      //1
      0,0,0,//0
      1,0,0,//1
      0,1,0,//2
      1,1,0,//3
      //2
      0,0,1,
      1,0,1,
      0,1,1,
      1,1,1,
      //3
      0,0,0,
      1,0,0,
      0,0,1,
      1,0,1,
      //4
      0,1,0,
      1,1,0,
      0,1,1,
      1,1,1,
      //5
      0,0,0,
      0,1,0,
      0,0,1,
      0,1,1,
      //6
      1,0,0,
      1,1,0,
      1,0,1,
      1,1,1,
    ];
    this.position.forEach((p,i,a)=>{
      a[i]-=1/2;
    });
    this.positionBuffer = new VertexBuffer(this.position);
    this.normal = [
      0,0,1,
      0,0,1,
      0,0,1,
      0,0,1,

      0,0,-1,
      0,0,-1,
      0,0,-1,
      0,0,-1,
      
      0,1,0,
      0,1,0,
      0,1,0,
      0,1,0,

      0,-1,0,
      0,-1,0,
      0,-1,0,
      0,-1,0,

      1,0,0,
      1,0,0,
      1,0,0,
      1,0,0,

      -1,0,0,
      -1,0,0,
      -1,0,0,
      -1,0,0,
    ]
    this.normalBuffer = new VertexBuffer(this.normal);
    this.texuv = [
      0.0,0.0,
      0.0,1.0,
      1.0,0.0,
      1.0,1.0,
      //
      0.0,0.0,
      0.0,1.0,
      1.0,0.0,
      1.0,1.0,
      //
      0.0,0.0,
      0.0,1.0,
      1.0,0.0,
      1.0,1.0,
      //
      0.0,0.0,
      0.0,1.0,
      1.0,0.0,
      1.0,1.0,
      //
      0.0,0.0,
      0.0,1.0,
      1.0,0.0,
      1.0,1.0,
      //
      0.0,0.0,
      0.0,1.0,
      1.0,0.0,
      1.0,1.0,
      //
    ];
    this.texuvBuffer = new VertexBuffer(this.texuv);

  }
  rotX4(a){
    return [
      1,0,0,0,
      0,cos(a),-sin(a),0,
      0,sin(a),cos(a),0,
      0,0,0,1,
    ];
  }
  rotY4(a){
    return [
      cos(a),0,-sin(a),0,
      0,1,0,0,
      sin(a),0,cos(a),0,
      0,0,0,1,
    ];
  }
  rotZ4(a){
    return [
      1,0,0,0,
      0,cos(a),-sin(a),0,
      0,sin(a),cos(a),0,
      0,0,0,1,
    ];
  }
  Rot(){
    let timer = Main.timer;
    let rotX = this.rotX4(timer/(this.seed.x+50));
    let rotY = this.rotY4(timer/(this.seed.y+50));
    let rotZ = this.rotX4(timer/(this.seed.z+50));
    this.rotMatrix = multMatrix(multMatrix(rotY,rotZ),rotX);
  }
  Beat(){
    let timer = Main.timer;
    let s = this.Size(timer);
    this.beat = [
      s,0,0,0,
      0,s,0,0,
      0,0,s,0,
      0,0,0,1,
    ];
  }
  Tap(){
    switch(this.state){
      case State.usual : 
        this.state = State.growing;
        EntityManager.openCube.pos = mlv(-12,Main.camera.forward);
        EntityManager.growingCube = this;
        EntityManager.openCube.state = State.shrinking;
        break;
    }
  }
  Update(){
    switch(this.state){
      case State.usual :
        this.Beat();
        this.Rot();
        break;
      case State.growing :
        this.Grow();
        break;
      case State.open :
        break;
      case State.shrinking :
        this.Rot();
        this.Shrink();
        break;
      default : cl("po");
    }
  }
  Bind(){ Main.SetAttribute(this.program.id,"uv",2,this.texuvBuffer.id);
    Main.SetAttribute(this.program.id,"position",3,this.positionBuffer.id);
    Main.SetAttribute(this.program.id,"normal",3,this.normalBuffer.id);
  }
  Grow(){
    let s = this.size;
    this.grow =[
      s,0,0,0,
      0,s,0,0,
      0,0,s,0,
      0,0,0,1,
    ];
    this.size *= 0.60;
    if(this.size <= 0.01){
      this.size = 30;
      this.pos = vec3(0,0,0);
      s = this.size;
      this.grow =[
        s,0,0,0,
        0,s,0,0,
        0,0,s,0,
        0,0,0,1,
      ];
      this.state = State.open;
      EntityManager.growingCube = null;
      EntityManager.openCube = this;
    }
  }
  Shrink(){
    let s = this.size;
    this.grow =[
      s,0,0,0,
      0,s,0,0,
      0,0,s,0,
      0,0,0,1,
    ];
    this.size = (this.size-1.5)*0.9 + 1.5;
    if(this.size <= 1.501){
      this.size = 1.5;
      s = this.size;
      this.grow =[
        s,0,0,0,
        0,s,0,0,
        0,0,s,0,
        0,0,0,1,
      ];
      this.state = State.usual;
    }
  }
  Draw(){
    this.Bind();
    //座標変換
    let center = [this.pos.x,this.pos.y,this.pos.z];
    const loc0 = Main.gl.getUniformLocation(this.program.id, "center");
    Main.gl.uniform3fv(loc0,center);

    const loc2 = Main.gl.getUniformLocation(this.program.id, "rotMatrix");
    Main.gl.uniformMatrix4fv(loc2,false,this.rotMatrix);

    Main.gl.uniform1i(Main.gl.getUniformLocation(this.program.id,"texnum"),this.textureID);
    Main.gl.uniform1i(Main.gl.getUniformLocation(this.program.id,"openTexnum"),EntityManager.openCube.textureID);
    Main.gl.uniform1i(Main.gl.getUniformLocation(this.program.id,"state"),this.state);
    //拍動
    const loc1 = Main.gl.getUniformLocation(this.program.id,"beat");
    Main.gl.uniformMatrix4fv(loc1,false,this.beat);
    const loc3 = Main.gl.getUniformLocation(this.program.id,"size");
    Main.gl.uniformMatrix4fv(loc3,false,this.grow);
    for(let i=0;i<6;i++){
      Main.gl.drawArrays(Main.gl.TRIANGLE_STRIP,4*i,4);
    }
  }
  Size(t){
    let k = t%60;
    if(k < 5)k= 0.6/(k+3);
    else k =0;
    return 1-k;
  }
}
