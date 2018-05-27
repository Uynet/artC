import Main from "./main.js";
import GLObject from "./GLObject/glObject.js";
let polygonID = 0;

export default class Cube{
  constructor(pos,e,textureID,program){
    this.pos = pos;
    this.textureID = textureID;
    this.polygonID = polygonID;
    polygonID += 6;
    this.seed = rand3d(15);

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

  }
  Update(program){
    //拍動
    let timer = Main.timer;
    let s = this.Size(timer);
    this.beat = [
      s,0,0,0,
      0,s,0,0,
      0,0,s,0,
      0,0,0,1,
    ];
    const loc1 = Main.gl.getUniformLocation(program.id, "beat");
    Main.gl.uniformMatrix4fv(loc1,false,this.beat);
    //回転
    let yy = timer/(this.seed.y+50);
    let rotY = [
      cos(yy),0,-sin(yy),0,
      0,1,0,0,
      sin(yy),0,cos(yy),0,
      0,0,0,1,
    ];
    let zz = timer/(this.seed.z+50);
    let rotZ = [
      cos(zz),-sin(zz),0,0,
      sin(zz),cos(zz),0,0,
      0,0,1,0,
      0,0,0,1,
    ];
    let xx = timer/(this.seed.x+50);
    let rotX = [
      1,0,0,0,
      0,cos(xx),-sin(xx),0,
      0,sin(xx),cos(xx),0,
      0,0,0,1,
    ];
    this.rotMatrix = multMatrix(rotY,rotZ);
    this.rotMatrix = multMatrix(this.rotMatrix,rotX);
  }
  Draw(program){
    //座標変換
    let center = [this.pos.x,this.pos.y,this.pos.z];
    const loc0 = Main.gl.getUniformLocation(program.id, "center");
    Main.gl.uniform3fv(loc0,center);

    const loc2 = Main.gl.getUniformLocation(program.id, "rotMatrix");
    Main.gl.uniformMatrix4fv(loc2,false,this.rotMatrix);

    Main.gl.uniform1i(Main.gl.getUniformLocation(program.id,"texnum"),this.textureID);
    for(let i=this.polygonID;i<this.polygonID+6;i++){
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
