export default class Input{
  static Init(){
    Input.keyList = new Array(256).fill(false);
  }
  static isKeyInput(keyCode){
    return Input.keyList[keyCode];
  }
}

document.onkeydown = e=>{
  Input.keyList[e.keyCode] = true;
  if(e.keyCode != 82)e.preventDefault();
};
document.onkeyup = e=>{
  Input.keyList[e.keyCode] = false;
};


