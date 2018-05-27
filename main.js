import VertexBuffer from "./GLObject/vertexBuffer.js";
import IndexBuffer from "./GLObject/indexBuffer.js";
import Program from "./GLObject/program.js";
import Cube from "./cube.js";
import Shader from "./GLObject/shader.js";
import Matrix from "./matrix.js";
import Texture from "./GLObject/Texture.js";
import EntityManager from "./entityManager.js";
import Input from "./input.js";
import Camera from "./camera.js";

let gl,canvas,program;
window.ondeviceorientation = function(event) {
  Main.camera.alpha = event.alpha * 2*Math.PI/360;//z
  Main.camera.beta = event.beta * 2*Math.PI/360;//x
  Main.camera.gamma = event.gamma * 2*Math.PI/360;//y
};
window.ondevicemotion = function(event) {
  Main.camera.acc.x = e.acceleration.x;
  Main.camera.acc.y = e.acceleration.y;
  Main.camera.acc.z = e.acceleration.z;
};

export default class Main{
  static Init(){
    this.holeRadius = 0.1;
    this.camera = new Camera();
    Matrix.Init();
    Input.Init();
    EntityManager.Init();
    this.param = document.getElementById("poyo");

    this.Boot().then(Main.Run);
  }
  static Run(){
    Main.Update();
    Main.Render();
    requestAnimationFrame(Main.Run);
  }
  static Update(){
    Main.camera.Update(program);
    //debug
    Main.param.innerHTML = `${Main.camera.alpha}</br>${Main.camera.beta}<br>${Main.camera.gamma}`;
    Matrix.Update();
    EntityManager.Update(program);
    //Main.holeRadius += 0.002*Math.sin(Main.timer/120);
    Main.timer+=1;
  }
  static Render(){
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program.id);
    Main.SendUniform();

    gl.uniform1f(gl.getUniformLocation(program.id,"holeRadius"),Main.holeRadius);

    EntityManager.Draw(program);

    gl.flush();
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

        const cube = new Cube(0,0,0,30,1);
        const cube2 = new Cube(1,0,0,1.00,0);
        const cube3 = new Cube(0,0,6,0.80,2);
        EntityManager.Add(cube);
        EntityManager.Add(cube2);
        EntityManager.Add(cube3);

        const positionBuffer = new VertexBuffer(cube.position.concat(cube2.position).concat(cube3.position))
        const normalBuffer = new VertexBuffer(cube.normal.concat(cube2.normal).concat(cube3.normal))
        const texuvBuffer = new VertexBuffer(cube.texuv.concat(cube2.texuv).concat(cube3.texuv))
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
    const vi2 = gl.getUniformLocation(program.id, "viewMatrix");
    const vi4 = gl.getUniformLocation(program.id, "projMatrix");
    gl.uniformMatrix4fv(vi2,false,Matrix.viewMatrix);
    gl.uniformMatrix4fv(vi4,false,Matrix.projMatrix);
  }
}
onload = _=>{
  document.body.onclick = function() {
    if (this.webkitRequestFullScreen) {
      this.webkitRequestFullScreen();
    }
    else if (this. mozRequestFullScreen) {
      this. mozRequestFullScreen();
    }
  };
  Main.Init();
}

