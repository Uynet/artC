import Main from "./main.js";
import GLObject from "./GLObject/glObject.js";
let polygonID = 0;

export default class Cube{
  constructor(x,y,z,e,textureID){
    this.textureID = textureID;
    this.polygonID = polygonID;
    polygonID += 6;
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
      if(i%3==0)a[i]+=x;
      if(i%3==1)a[i]+=y;
      if(i%3==2)a[i]+=z;
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
  Draw(program){
    Main.gl.uniform1i(Main.gl.getUniformLocation(program.id,"texnum"),this.textureID);
    for(let i=this.polygonID;i<this.polygonID+6;i++){
      Main.gl.drawArrays(Main.gl.TRIANGLE_STRIP,4*i,4);
    }
  }
}
