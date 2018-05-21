import VertexBuffer from "./vertexBuffer.js";
import IndexBuffer from "./indexBuffer.js";
import Cube from "./cube.js";
import Shader from "./shader.js";
import Matrix from "./matrix.js";
import Texture from "./Texture.js";

let gl,canvas,program;
let index;

export default class Main{
  static Init(){
    Matrix.Init();
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
        pos : vec3(0,0,-0.50),//座標
        forward : vec3(0,0,-1),//カメラの向き
        up : vec3(0,1,0),//カメラの上方向
      }
      const texFav = new Texture("fav.png",0);
      const texSkydome = new Texture("skydome.png",1);

      this.SetShader().then(res);
    });
  }
  static SetShader(){
    return new Promise(res=>{

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
        const texuv = [
          0.0, 0.0,
          1.0, 0.0,
          0.0, 1.0,
          1.0, 1.0,
          0.0, 1.0,
          1.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,
        ]

        const cube = new Cube(0,0,0.13);
        index = cube.index;

        const ibo = new IndexBuffer(index);
        const positionBuffer = new VertexBuffer(cube.position);
        const colorBuffer = new VertexBuffer(cube.color);
        const texuvBuffer = new VertexBuffer(texuv);
        this.SetAttribute("uv",2,texuvBuffer.id);
        this.SetAttribute("color",4,colorBuffer.id);
        this.SetAttribute("position",3,positionBuffer.id);
        const texL = gl.getUniformLocation(program,"tex");
        gl.uniform1i(texL, 0);
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
    const vi3 = gl.getUniformLocation(program, "poMatrix");
    const vi4 = gl.getUniformLocation(program, "projMatrix");
    gl.uniformMatrix4fv(vi,false,Matrix.rotMatrix);
    gl.uniformMatrix4fv(vi2,false,Matrix.viewMatrix);
    gl.uniformMatrix4fv(vi3,false,Matrix.poMatrix);
    gl.uniformMatrix4fv(vi4,false,Matrix.projMatrix);
  }
}


(function(){
  Main.Init();
})();
