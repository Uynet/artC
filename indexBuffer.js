import Main from "./main.js";

export default class IndexBuffer{
  constructor(data){
    this.id = Main.gl.createBuffer();
    const gl = Main.gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
  }
}
