import VertexBuffer from "./GLObject/vertexBuffer.js";
import IndexBuffer from "./GLObject/indexBuffer.js";
import Program from "./GLObject/program.js";
import Cube from "./cube.js";
import Shader from "./GLObject/shader.js";
import Matrix from "./matrix.js";
import Texture from "./GLObject/Texture.js";
import EntityManager from "./entityManager.js";

let gl,canvas,program;

window.ondeviceorientation = function(event) {
  cl(event.alpha)
  Main.camera.alpha = event.alpha * 2*Math.PI/360;//z
  Main.camera.beta = event.beta * 2*Math.PI/360;//x
  Main.camera.gamma = event.gamma * 2*Math.PI/360;//y
};

export default class Main{
  static Init(){
    this.holeRadius = 0.1;
    Matrix.Init();
    EntityManager.Init();
    this.param = document.getElementById("poyo");

    this.Boot().then(Main.Render);
  }
  static Render(){
    Main.camera.Update();
    Main.param.innerHTML = Main.camera.alpha;
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program.id);
    Matrix.Update();
    Main.SendUniform();

    //Main.holeRadius += 0.007*Math.sin(Main.timer/60);
    gl.uniform1f(gl.getUniformLocation(program.id,"holeRadius"),Main.holeRadius);
    //空
    gl.uniform1i(gl.getUniformLocation(program.id,"texnum"),1);
    for(let i=0;i<6;i++){
      gl.drawArrays(gl.TRIANGLE_STRIP,4*i,4);
    }
    //鳥
    gl.uniform1i(gl.getUniformLocation(program.id,"texnum"),0);
    for(let i=6;i<12;i++){
      gl.drawArrays(gl.TRIANGLE_STRIP,4*i,4);
    }

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
      if(!gl)Main.param.innerHTML = "webGL対応してないよ";

      this.gl = gl;
      this.camera = {
        pos : vec3(0,0,-3.00),//座標
        forward : vec3(0,0.0,-1),//カメラの向き
        up : vec3(0,1,0),//カメラの上方向
        alpha : 0,//カメラのz軸方向の回転?
        beta : 0,//カメラのx軸方向の回転?
        gamma : 0,//カメラのy軸方向の回転?
        Update : function(){
          //カメラ関連
          let eye = [
            this.pos.x,
            this.pos.y,
            this.pos.z,
          ];
          let a = this.alpha;
          let b = this.beta;
          let c = this.gamma;
          let rotCameraAlpha = [
            cos(a),-sin(a),0,
            sin(a),cos(a),0,
            0,0,1,
          ]
          let rotCameraBeta = [
            1,0,0,
            0,cos(b),-sin(b),
            0,sin(b),cos(b),
          ]
          let rotCameraGamma = [
            cos(c),0,-sin(c),
            0,1,0,
            sin(c),0,cos(c),
          ]
          //this.forward = vec3(Math.sin(t),0,Math.cos(t))//カメラの向き
            /*
          let forward = multMatrixVec3(rotCameraTheta,[this.forward.x,this.forward.y,this.forward.z]);
          this.forward = {
            x : forward[0],
            y : forward[1],
            z : forward[2],
          }
          */
          gl.uniformMatrix3fv(gl.getUniformLocation(program.id,"rotCameraAlpha"),false,rotCameraAlpha);
          gl.uniformMatrix3fv(gl.getUniformLocation(program.id,"rotCameraBeta"),false,rotCameraBeta);
          gl.uniformMatrix3fv(gl.getUniformLocation(program.id,"rotCameraGamma"),false,rotCameraGamma);
          gl.uniform3fv(gl.getUniformLocation(program.id,"eye"),eye);
        },
      }
      const texFav = new Texture("resource/fav.png",0);
      const texFavNorm = new Texture("resource/NormalMap.png",2);
      const texSkydome = new Texture("resource/skydome.png",1);
      const texMountaindome = new Texture("resource/mountain.png",3);

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

        const cube = new Cube(0,0,0,30);
        const cube2 = new Cube(0,0,0,1.00);
        EntityManager.Add(cube);
        EntityManager.Add(cube2);

        const positionBuffer = new VertexBuffer(cube.position.concat(cube2.position))
        const normalBuffer = new VertexBuffer(cube.normal.concat(cube2.normal))
        const texuvBuffer = new VertexBuffer(cube.texuv.concat(cube2.texuv))
        this.SetAttribute(program.id,"uv",2,texuvBuffer.id);
        this.SetAttribute(program.id,"position",3,positionBuffer.id);
        this.SetAttribute(program.id,"normal",3,normalBuffer.id);

        gl.uniform1i(gl.getUniformLocation(program.id,"favTex"),0);
        gl.uniform1i(gl.getUniformLocation(program.id,"skyTex"),1);
        gl.uniform1i(gl.getUniformLocation(program.id,"favTexNorm"),2);
        gl.uniform1i(gl.getUniformLocation(program.id,"mountainTex"),3);
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
onload =   Main.Init();
//document.addEventListener("deviceorientation", function(event) {

