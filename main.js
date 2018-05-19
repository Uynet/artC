import VertexBuffer from "./vertexBuffer.js";
import IndexBuffer from "./indexBuffer.js";
import Cube from "./cube.js";
import Shader from "./shader.js";
import Matrix from "./matrix.js";

let gl,canvas,program;
let index;

export default class Main{
  static Init(){
    this.Boot().then(Main.Render);
  }
  static Render(){
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    Matrix.Update();
    Main.SendUniform();

    gl.drawElements(gl.TRIANGLES,index.length,gl.UNSIGNED_SHORT,0);
    gl.flush();

    Main.timer+=1;
    requestAnimationFrame(Main.Render);
  }
  static Boot(){
    return new Promise(res=>{
      this.timer = 0;
      canvas = document.getElementById("po");
      canvas.width = 800;
      canvas.height = 800;
      gl = canvas.getContext("webgl");
      this.gl = gl;
      this.camera = {
        pos : vec3(0,0,-1.00),//座標
        forward : vec3(0,0,-1),//カメラの向き
        up : vec3(0,1,0),//カメラの上方向
      }
      this.SetShader().then(res);
    });
  }
  static SetShader(){
    return new Promise(res=>{
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
        gl.enable(gl.DEPTH_TEST);
        this.SetAttribute("color",4,colorBuffer.id);
        this.SetAttribute("position",3,vertexPositionBuffer.id);

        res();
      });
    })
  }
  static SetAttribute(vary,stlide,vbo){
    let attributeLocation = gl.getAttribLocation(program,vary);
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.enableVertexAttribArray(attributeLocation);
    gl.vertexAttribPointer(attributeLocation,stlide,gl.FLOAT,false,0,0)
  }
  static SendUniform(){
    const vi = gl.getUniformLocation(program, "rotMatrix");
    const vi2 = gl.getUniformLocation(program, "viewMatrix");
    gl.uniformMatrix4fv(vi,false,Matrix.rotMatrix);
    gl.uniformMatrix4fv(vi2,false,Matrix.viewMatrix);
  }
}


(function(){
  Main.Init();
})();
