import Main from "./main.js";

export default class IndexBuffer{
  constructor(data){
    this.id = Main.gl.createBuffer();
    const gl = Main.gl;
    this.bind();
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
  bind(){
    const gl = Main.gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
  }
}
