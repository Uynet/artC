import VertexBuffer from "./vertexBuffer.js";
import IndexBuffer from "./indexBuffer.js";
import Program from "./program.js";
import Cube from "./cube.js";
import Shader from "./shader.js";
import Matrix from "./matrix.js";
import Texture from "./Texture.js";

let gl,canvas,program,sphereProgram;

export default class Main{
  static Init(){
    Matrix.Init();
    this.Boot().then(Main.Render);
  }
  static Render(){
    Main.camera.pos.z *= 0.99;
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //p
    gl.useProgram(program.id);
    Matrix.Update();
    Main.SendUniform();
    program.ibo.bind();

    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    gl.drawArrays(gl.TRIANGLE_STRIP,4,4);
    gl.drawArrays(gl.TRIANGLE_STRIP,8,4);
    gl.drawArrays(gl.TRIANGLE_STRIP,12,4);
    gl.drawArrays(gl.TRIANGLE_STRIP,16,4);
    gl.drawArrays(gl.TRIANGLE_STRIP,20,4);

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
        pos : vec3(0,0,-4.00),//座標
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
      //Cube
      program = new Program();
      Shader.CreateShader("cube.vert").then(vs=>{
        gl.attachShader(program.id,vs);
        return Shader.CreateShader("cube.frag");
      }).then(fs=>{
        gl.attachShader(program.id,fs);
        gl.linkProgram(program.id);
        gl.useProgram(program.id);
        gl.enable(gl.DEPTH_TEST);
        if (!gl.getProgramParameter(program.id, gl.LINK_STATUS)) {
          console.log(gl.getProgramInfoLog(program.id))
        }

        const cube = new Cube(0,0,0,0.30);

        const ibo = new IndexBuffer(cube.index);
        const positionBuffer = new VertexBuffer(cube.position);
        const texuvBuffer = new VertexBuffer(cube.texuv);
        this.SetAttribute(program.id,"uv",2,texuvBuffer.id);
        this.SetAttribute(program.id,"position",3,positionBuffer.id);

        program.index = cube.index;
        program.ibo = ibo;

        gl.uniform1i(gl.getUniformLocation(program.id,"favTex"),0);
        res();
      });
    });
  }
  static SetAttribute(program,vary,stlide,vbo){
    let attributeLocation = gl.getAttribLocation(program,vary);
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.enableVertexAttribArray(attributeLocation);
    gl.vertexAttribPointer(attributeLocation,stlide,gl.FLOAT,false,0,0)
  }
  static SendUniform(){
    const vi = gl.getUniformLocation(program.id, "rotMatrix");
    const vi3 = gl.getUniformLocation(program.id, "poMatrix");
    const vi2 = gl.getUniformLocation(program.id, "viewMatrix");
    const vi4 = gl.getUniformLocation(program.id, "projMatrix");
    gl.uniformMatrix4fv(vi,false,Matrix.rotMatrix);
    gl.uniformMatrix4fv(vi2,false,Matrix.viewMatrix);
    gl.uniformMatrix4fv(vi3,false,Matrix.poMatrix);
    gl.uniformMatrix4fv(vi4,false,Matrix.projMatrix);
  }
}


(function(){
  Main.Init();
})();
