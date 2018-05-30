import VertexBuffer from "./GLObject/vertexBuffer.js";
import IndexBuffer from "./GLObject/indexBuffer.js";
import Program from "./GLObject/program.js";
import Cube from "./cube.js";
import Shader from "./GLObject/shader.js";
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
window.ontouchstart = function(e){
  let touch = e.changedTouches[0];
  Main.camera.RayCast(touch.pageX,touch.pageY);
}
window.ontouchmove = e=>{
  e.preventDefault;
}

export default class Main{
  static Init(){
    this.holeRadius = 0.1;
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
    EntityManager.Update(program);
    //Main.holeRadius += 0.002*Math.sin(Main.timer/120);
    Main.timer+=1;
  }
  static Render(){
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program.id);

    gl.uniform1f(gl.getUniformLocation(program.id,"holeRadius"),Main.holeRadius);

    EntityManager.Draw(program);

    gl.flush();
  }
  static Boot(){
    return new Promise(res=>{
      this.timer = 0;
      canvas = document.getElementById("po");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl = canvas.getContext("webgl");
      if(!gl)Main.param.innerHTML = "webGL対応してないよ";

      this.gl = gl;
      this.canvas = canvas;
      const texFav = new Texture("resource/fav.png",0);
      const texFavNorm = new Texture("resource/NormalMap.png",2);
      const texSkydome = new Texture("resource/skydome.png",1);
      const texMountaindome = new Texture("resource/mountain.png",3);

      this.camera = new Camera();

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

        const cube = new Cube(vec3(0,0,0),30,1,program);
        const cube2 = new Cube(vec3(0,-14,0),1.5,2,program);
        const cube3 = new Cube(vec3(14,0,0),1.5,0,program);
        const cube4 = new Cube(vec3(0,14,0),1.5,0,program);
        const cube5 = new Cube(vec3(-14,0,0),1.5,0,program);
        EntityManager.Add(cube);
        EntityManager.Add(cube2);
        EntityManager.Add(cube3);
        EntityManager.Add(cube4);
        EntityManager.Add(cube5);

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
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
  }
}
onload = _=>{
  Main.Init();
}

