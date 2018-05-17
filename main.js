let gl,canvas;
export default class Main{
  static Init(){
    canvas = document.getElementById("po");
    canvas.width = 800;
    canvas.height = 800;
    gl = canvas.getContext("webgl");
    Main.Render();

    const vertex = [
      -0.5,1.0,
      0.5,1.0,
      0.5,1.0,
    ]
    const program = gl.createProgram();
    const vertexPositionBuffer = this.CreateVBO();
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
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0)
    });
  }
  static CreateVBO(vertex){
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertex),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
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
    gl.flush();
//    requestAnimationFrame(Main.Render);
  }
}


(function(){
  Main.Init();
})();
