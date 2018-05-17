import Main from "./main.js";

export default class VertexBuffer{
  constructor(){
    this.id = Main.gl.createBuffer();
  }
  Create(data) {
    const gl = Main.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER,this.id); //本当は違うけどめんどいからこう書く
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
  }
}
