import Main from "../main.js";
import VertexBuffer from "./vertexBuffer.js";

export default class Program{
  constructor(){
    const gl = Main.gl;
    this.id = gl.createProgram();
    this.index = [];
    this.po = 1;
  }
}
