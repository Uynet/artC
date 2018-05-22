export default class Cube{
  constructor(x,y,z){
    this.position = [
      0,0,0,
      z,0,0,
      0,z,0,
      z,z,0,
      0,0,z,
      z,0,z,
      0,z,z,
      z,z,z,
    ];
    this.position.forEach((e,i,a)=>{a[i]-=z/2});
    this.normal = this.position;
    this.index = [
      0,1,2,1,2,3,
      4,5,6,5,6,7,
      0,6,4,0,6,2,
      1,7,5,1,7,3,
      0,5,4,0,5,1,
      2,7,6,2,7,3,
    ];
    this.texuv = [
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 1.0,
      0.0, 1.0,
      1.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
    ];
    this.color = [];
    for(let i = 0;i<this.position.length/3;i++){
      this.color.push(i%2);
      this.color.push(i%3/3+0.3);
      this.color.push(i%5/5+0.3);
      this.color.push(1);
    };
  }
}
