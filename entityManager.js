export default class EntityManager{
  static Init(){
    this.list = [];
  }
  static Add(e){
    this.list.push(e);
  }
  static Draw(program){
    this.list.forEach(e=>e.Draw(program));
  }
}
