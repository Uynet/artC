export default class EntityManager{
  static Init(){
    this.list = [];
    this.openCube;
    this.growingCube;
  }
  static Add(e){
    this.list.push(e);
  }
  static Update(program){
    this.list.forEach(e=>e.Update(program));
  }
  static Draw(program){
    this.list.forEach(e=>e.Draw(program));
  }
}
