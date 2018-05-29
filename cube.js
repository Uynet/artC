import Main from "./main.js";
import GLObject from "./GLObject/glObject.js";
import VertexBuffer from "./GLObject/vertexBuffer.js";

let polygonID = 0;

const State = {
  usual : "usual",
  growing : "growing",
  open : "open",
}

export default class Cube{
  constructor(pos,e,textureID,program){
    this.pos = pos;
    this.textureID = textureID;
    this.polygonID = polygonID;
    polygonID += 6;
    this.seed = rand3d(15);
    this.program = program;
    this.state = State.usual;
    if(textureID == 1)this.state = State.open;
    this.size = 1;

    let E4 = [
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1,
    ]
    this.grow = E4;
    this.beat = E4;
    this.rotMatrix = E4;

    this.position = [
      //1
      0,0,0,//0
      e,0,0,//1
      0,e,0,//2
      e,e,0,//3
      //2
      0,0,e,
      e,0,e,
      0,e,e,
      e,e,e,
      //3
      0,0,0,
      e,0,0,
      0,0,e,
      e,0,e,
      //4
      0,e,0,
      e,e,0,
      0,e,e,
      e,e,e,
      //5
      0,0,0,
      0,e,0,
      0,0,e,
      0,e,e,
      //6
      e,0,0,
      e,e,0,
      e,0,e,
      e,e,e,
    ];
    this.position.forEach((p,i,a)=>{
      a[i]-=e/2;
      if(i%3==0)a[i]+=pos.x;
      if(i%3==1)a[i]+=pos.y;
      if(i%3==2)a[i]+=pos.z;
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
  Rot(){
    //回転
    let timer = Main.timer;
    let rotX = rotX4(timer/(this.seed.x+50));
    let rotY = rotY4(timer/(this.seed.y+50));
    let rotZ = rotX4(timer/(this.seed.z+50));
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
    cl(this.state);
    switch(this.state){
      case "usual" : this.state = "growing"; break;
      case "growing" : this.state = "growing"; break;
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
      case State.shrink :
        break;
      default : cl("po");
    }
  }
  Bind(){
    Main.SetAttribute(this.program.id,"uv",2,this.texuvBuffer.id);
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
    this.size *= 1.21;
    if(this.size >= 30){
      this.size = 30;
      this.state = "open";
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
    //拍動
    const loc1 = Main.gl.getUniformLocation(this.program.id,"beat");
    Main.gl.uniformMatrix4fv(loc1,false,this.beat);
    const loc3 = Main.gl.getUniformLocation(this.program.id,"grow");
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
