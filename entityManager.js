export default class EntityManager{
  static Init(){
    this.list = [];
  }
  static Add(e){
    this.list.push(e);
  }
}
