import Main from "../main.js";

export default class RenderBuffer{
  constructor(){
    const renderBuffer = Main.gl.createRenderbuffer();
    Main.gl.bindRenderbuffer(Main.gl.RENDERBUFFER,renderBuffer);
    Main.gl.renderbufferStrage(gl.RGBA4,800,800);
  }
}
