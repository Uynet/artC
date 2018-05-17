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

      //
      const vertex = [
        0.0, 0.5,
        0.5, 0.0,
        -0.5, 0.0
      ];
      //

      const vertexPositionBuffer = this.CreateVBO(vertex);
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
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.enableVertexAttribArray(attributeLocation);
        gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0)
        res();
      });
    });
  }
  static CreateVBO(vertex){
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
    return vbo;
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
    gl.drawArrays(gl.TRIANGLES,0,3);
    gl.flush();
//    requestAnimationFrame(Main.Render);
  }
}


(function(){
  Main.Init();
})();
