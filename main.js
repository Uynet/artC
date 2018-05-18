import VertexBuffer from "./vertexBuffer.js";
let gl,canvas,program,timer;
let index;

export default class Main{
  static Init(){
    timer = 0;
    this.Po();
    this.Boot().then(Main.Render);
  }
  static Boot(){
    return new Promise(res=>{
      canvas = document.getElementById("po");
      canvas.width = 800;
      canvas.height = 800;
      gl = canvas.getContext("webgl");
      this.gl = gl;

      let rad = 0.3;
      let z = 0.00;
      const position = [
        0,0,z,
        rad,0,z,
      ];
      const color = [
        1,0,0,1,
        0,1,0,1,
        0,0,1,1,
        1,1,0,1,
        0,1,1,1,
        1,0,1,1,
      ];
      index = [];
      let arg = 0;

      for(let i=0;i<4;i++){
        arg += Math.PI/2;
        position.push(rad * cos(arg));
        position.push(rad * sin(arg));
        position.push(z);
        index.push(0);
        index.push(i+1);
        index.push(i+2);
      }

      const ibo = this.CreateIBO(index);
      const vertexPositionBuffer = new VertexBuffer();
      const colorBuffer = new VertexBuffer();
      vertexPositionBuffer.Create(position);
      colorBuffer.Create(color);

      program = gl.createProgram();
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
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        //color
        let colorLocation = gl.getAttribLocation(program,"color");
        gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer.id);
        gl.enableVertexAttribArray(colorLocation);
        gl.vertexAttribPointer(colorLocation,4,gl.FLOAT,false,0,0)
        //pos
        let attributeLocation = gl.getAttribLocation(program,"position");
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexPositionBuffer.id);
        gl.enableVertexAttribArray(attributeLocation);
        gl.vertexAttribPointer(attributeLocation,3,gl.FLOAT,false,0,0)

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
static Po(){
  let rot1 = [
    cos(timer/100),0,-sin(timer/100),0,
    0,1,0,0,
    sin(timer/100),0,cos(timer/100),0,
    0,0,0,1,
  ];
  let e = [
    1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1,
    ];

    Main.viewMatrix = multMatrix(rot1,e);
  }
  static Render(){
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    Main.Po();
    const vi = gl.getUniformLocation(program, "viewMatrix");
    gl.uniformMatrix4fv(vi,false,Main.viewMatrix);
    gl.drawElements(gl.TRIANGLES,index.length,gl.UNSIGNED_SHORT,0);
    gl.flush();
    requestAnimationFrame(Main.Render);
    timer+=1;
  }
}


(function(){
  Main.Init();
})();
