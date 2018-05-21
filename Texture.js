import Main from "./main.js";
const id = 0;

export default class Texture{
  constructor(path,id){
    this.id = id;
    const gl = Main.gl;
    const img = new Image();
    img.src = path;
    img.onload = _ => {
      gl.activeTexture(gl["TEXTURE" + this.id]);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
      gl.generateMipmap(gl.TEXTURE_2D);
      this.tex = tex;
    };
  }
}
