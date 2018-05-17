import VertexBuffer from "./vertexBuffer.js";
let gl,canvas;

export default class Main{
  static Init(){
    this.Boot().then(Main.Render);
  }
  static Boot(){
    return new Promise(res=>{
      canvas = document.getElementById("po");
      canvas.width = 800;
      canvas.height = 800;
      gl = canvas.getContext("webgl");
      this.gl = gl;

      //
      const vertex = [
        0.0,  1.0,  0.0,
        1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        0.0, -1.0,  0.0
      ];
      //
      const index = [
        0,1,2,
        1,2,3,
      ];
      const ibo = this.CreateIBO(index);
      const vertexPositionBuffer = new VertexBuffer();
      vertexPositionBuffer.Create(vertex);
      const program = gl.createProgram();
      this.CreateShader("main.vert").then(vs=>{
        gl.attachShader(program,vs);
        return this.CreateShader("main.frag");
      }).then(fs=>{
        gl.attachShader(program,fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.log(gl.getProgramInfoLog(program))
        }
        gl.useProgram(program);

        let attributeLocation = gl.getAttribLocation(program,"position");
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexPositionBuffer.id);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.enableVertexAttribArray(attributeLocation);
        gl.enable(gl.DEPTH_TEST);
        gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0)
        res();
      });
    });
  }
static CreateIBO(data){
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    return ibo;
}
  static CreateShader(path){
    return new Promise(res=>{ let ext = path.split(".")[1];
      let type;
      switch(ext){
        case "vert" : type = gl.VERTEX_SHADER;break;
        case "frag" : type = gl.FRAGMENT_SHADER;break;
      }
      const shader = gl.createShader(type);
      let xhr = new XMLHttpRequest();
      xhr.open("GET",path,true);
      xhr.addEventListener("load",event=>{
        let code = xhr.responseText;
        gl.shaderSource(shader,code);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          res(shader);
        } else {
          console.error(gl.getShaderInfoLog(shader));
        }
        res(shader);
      });

      xhr.send(null);
    });
  }
  static Render(){
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.drawArrays(gl.TRIANGLES,0,3);
    gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT, 0);
    gl.flush();
//  requestAnimationFrame(Main.Render);
  }
}


(function(){
  Main.Init();
})();
