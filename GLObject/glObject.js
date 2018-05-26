export default class GLObject{
  static Init(gl){
    this.gl = gl;
    this.programList = [];
  }
  static Add(program){
    this.programList.push(program);
  }
}
