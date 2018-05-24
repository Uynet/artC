import Main from "../main.js";

export default class VertexBuffer{
  constructor(data){
    this.id = Main.gl.createBuffer();
    const gl = Main.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER,this.id);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
  }
}
