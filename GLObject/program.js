import Main from "../main.js";

export default class Program{
  constructor(){
    const gl = Main.gl;
    this.id = gl.createProgram();
    this.index = [];
    this.po = 1;
  }
}
