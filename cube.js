export default class Cube{
  constructor(x,y,z,e){
    this.position = [
      0,0,0,
      e,0,0,
      0,e,0,
      e,e,0,
      0,0,e,
      e,0,e,
      0,e,e,
      e,e,e,
    ];
    this.position.forEach((p,i,a)=>{
      a[i]-=e/2;
      if(i%3==0)a[i]+=x;
      if(i%3==1)a[i]+=y;
      if(i%3==2)a[i]+=z;
    });
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
