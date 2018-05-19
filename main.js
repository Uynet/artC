import VertexBuffer from "./vertexBuffer.js";
import IndexBuffer from "./indexBuffer.js";
import Cube from "./cube.js";
import Shader from "./shader.js";

let gl,canvas,program,timer;
let index;

export default class Main{
  static Init(){
    timer = 0;
    this.Po();
    this.Boot().then(Main.Render);
  }
  static Boot(){
    return new Promise(res=>{
      canvas = document.getElementById("po");
      canvas.width = 800;
      canvas.height = 800;
      gl = canvas.getContext("webgl");
      this.gl = gl;

      const cube = new Cube(0,0,0.20);
      const position = cube.position;
      const color = cube.color;
      index = cube.index;

      const ibo = new IndexBuffer(index);
      const vertexPositionBuffer = new VertexBuffer(position);
      const colorBuffer = new VertexBuffer(color);
      program = gl.createProgram();

      Shader.CreateShader("main.vert").then(vs=>{
        gl.attachShader(program,vs);
        return Shader.CreateShader("main.frag");
      }).then(fs=>{
        gl.attachShader(program,fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.log(gl.getProgramInfoLog(program))
        }
        gl.useProgram(program);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo.id);
        //color
        let colorLocation = gl.getAttribLocation(program,"color");
        gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer.id);
        gl.enableVertexAttribArray(colorLocation);
        gl.enable(gl.DEPTH_TEST);
        gl.vertexAttribPointer(colorLocation,4,gl.FLOAT,false,0,0)
        //pos
        let attributeLocation = gl.getAttribLocation(program,"position");
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexPositionBuffer.id);
        gl.enableVertexAttribArray(attributeLocation);
        gl.vertexAttribPointer(attributeLocation,3,gl.FLOAT,false,0,0)

        res();
      });
    });
  }
static Po(){
  let rot1 = [
    cos(timer/30),0,-sin(timer/30),0,
    0,1,0,0,
    sin(timer/30),0,cos(timer/30),0,
    0,0,0,1,
  ];
  let e = [
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
  let e3 = [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,-1,1,
  ];

  let po = multMatrix(e,e2);
  Main.rotMatrix = multMatrix(rot1,po);
  Main.viewMatrix = e3;
  }
  static Render(){
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    Main.Po();
    const vi = gl.getUniformLocation(program, "rotMatrix");
    const vi2 = gl.getUniformLocation(program, "viewMatrix");
    gl.uniformMatrix4fv(vi,false,Main.rotMatrix);
    gl.uniformMatrix4fv(vi2,false,Main.viewMatrix);

    gl.drawElements(gl.TRIANGLES,index.length,gl.UNSIGNED_SHORT,0);
    gl.flush();
    requestAnimationFrame(Main.Render);
    timer+=1;
  }
}


(function(){
  Main.Init();
})();
