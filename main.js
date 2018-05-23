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
    Main.camera.pos.z *= 0.8
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //p
    gl.useProgram(program.id);
    Matrix.Update();
    Main.SendUniform();
    let eye = [
      Main.camera.pos.x,
      Main.camera.pos.y,
      Main.camera.pos.z,
    ]
    gl.uniform3fv(gl.getUniformLocation(program.id,"eye"),eye);

    //鳥
    gl.uniform1i(gl.getUniformLocation(program.id,"texnum"),1);
    for(let i=0;i<6;i++){
      gl.drawArrays(gl.TRIANGLE_STRIP,4*i,4);
    }
    //空
    gl.uniform1i(gl.getUniformLocation(program.id,"texnum"),0);
    for(let i=6;i<12;i++){
      gl.drawArrays(gl.TRIANGLE_STRIP,4*i,4);
    }

    gl.flush();

    Main.timer+=0.4;
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
        pos : vec3(0,0,-7800.50),//座標
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

        const cube = new Cube(0,0,0,3.00);
        const cube2 = new Cube(0,0,0,0.00030);

        const positionBuffer = new VertexBuffer(cube.position.concat(cube2.position));
        const normalBuffer = new VertexBuffer(cube.normal.concat(cube2.normal));
        const texuvBuffer = new VertexBuffer(cube.texuv.concat(cube2.texuv));
        this.SetAttribute(program.id,"uv",2,texuvBuffer.id);
        this.SetAttribute(program.id,"position",3,positionBuffer.id);
        this.SetAttribute(program.id,"normal",3,normalBuffer.id);

        gl.uniform1i(gl.getUniformLocation(program.id,"favTex"),0);
        gl.uniform1i(gl.getUniformLocation(program.id,"skyTex"),1);
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

window.addEventListener("deviceorientation", function(event) {
    this.alpha = event.alpha;
    this.beta = event.beta;
    this.gamma = event.gamma;
}, false);

(function(){
  Main.Init();
})();
