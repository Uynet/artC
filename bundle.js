/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__GLObject_vertexBuffer_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__GLObject_indexBuffer_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__GLObject_program_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cube_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__GLObject_shader_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__GLObject_Texture_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__entityManager_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__input_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__camera_js__ = __webpack_require__(10);










let gl,canvas,program;
window.ondeviceorientation = function(event) {
  Main.camera.alpha = event.alpha * 2*Math.PI/360;//z
  Main.camera.beta = event.beta * 2*Math.PI/360;//x
  Main.camera.gamma = event.gamma * 2*Math.PI/360;//y
};
window.ontouchstart = function(e){
  let touch = e.changedTouches[0];
  Main.camera.RayCast(touch.pageX,touch.pageY);
}
window.ontouchmove = e=>{
  e.preventDefault;
}

class Main{
  static Init(){
    this.holeRadius = 0.1;
    __WEBPACK_IMPORTED_MODULE_7__input_js__["a" /* default */].Init();
    __WEBPACK_IMPORTED_MODULE_6__entityManager_js__["a" /* default */].Init();
    this.param = document.getElementById("poyo");

    this.Boot().then(Main.Run);
  }
  static Run(){
    Main.Update();
    Main.Render();
    requestAnimationFrame(Main.Run);
  }
  static Update(){
    Main.camera.Update(program);
    __WEBPACK_IMPORTED_MODULE_6__entityManager_js__["a" /* default */].Update(program);
    //Main.holeRadius += 0.002*Math.sin(Main.timer/120);
    Main.timer+=1;
  }
  static Render(){
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program.id);

    gl.uniform1f(gl.getUniformLocation(program.id,"holeRadius"),Main.holeRadius);

    __WEBPACK_IMPORTED_MODULE_6__entityManager_js__["a" /* default */].Draw(program);

    gl.flush();
  }
  static Boot(){
    return new Promise(res=>{
      this.timer = 0;
      canvas = document.getElementById("po");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl = canvas.getContext("webgl");
      if(!gl)Main.param.innerHTML = "webGL対応してないよ";

      this.gl = gl;
      this.canvas = canvas;
      new __WEBPACK_IMPORTED_MODULE_5__GLObject_Texture_js__["a" /* default */]("resource/fav.png",0);
      new __WEBPACK_IMPORTED_MODULE_5__GLObject_Texture_js__["a" /* default */]("resource/NormalMap.png",2);
      new __WEBPACK_IMPORTED_MODULE_5__GLObject_Texture_js__["a" /* default */]("resource/skydome.png",1);
      new __WEBPACK_IMPORTED_MODULE_5__GLObject_Texture_js__["a" /* default */]("resource/mountain.png",3);
      new __WEBPACK_IMPORTED_MODULE_5__GLObject_Texture_js__["a" /* default */]("resource/dome3.png",4);
      new __WEBPACK_IMPORTED_MODULE_5__GLObject_Texture_js__["a" /* default */]("resource/dome4.png",5);
      new __WEBPACK_IMPORTED_MODULE_5__GLObject_Texture_js__["a" /* default */]("resource/dome5.png",6);

      this.camera = new __WEBPACK_IMPORTED_MODULE_8__camera_js__["a" /* default */]();

      this.SetShader().then(res);
    });
  }
  static SetShader(){
    return new Promise(res=>{
      //Cube
      program = new __WEBPACK_IMPORTED_MODULE_2__GLObject_program_js__["a" /* default */]();
      __WEBPACK_IMPORTED_MODULE_4__GLObject_shader_js__["a" /* default */].CreateShader("cube.vert").then(vs=>{
        gl.attachShader(program.id,vs);
        return __WEBPACK_IMPORTED_MODULE_4__GLObject_shader_js__["a" /* default */].CreateShader("cube.frag");
      }).then(fs=>{
        gl.attachShader(program.id,fs);
        gl.linkProgram(program.id);
        gl.useProgram(program.id);
        gl.enable(gl.DEPTH_TEST);
        if (!gl.getProgramParameter(program.id, gl.LINK_STATUS)) {
          console.log(gl.getProgramInfoLog(program.id))
        }

        const cube = new __WEBPACK_IMPORTED_MODULE_3__cube_js__["a" /* default */](vec3(0,0,0),30,1,program);
        const cube2 = new __WEBPACK_IMPORTED_MODULE_3__cube_js__["a" /* default */](vec3(0,-14,0),1.5,2,program);
        const cube3 = new __WEBPACK_IMPORTED_MODULE_3__cube_js__["a" /* default */](vec3(14,0,0),1.5,4,program);
        const cube4 = new __WEBPACK_IMPORTED_MODULE_3__cube_js__["a" /* default */](vec3(0,14,0),1.5,5,program);
        const cube5 = new __WEBPACK_IMPORTED_MODULE_3__cube_js__["a" /* default */](vec3(-14,0,0),1.5,6,program);
        __WEBPACK_IMPORTED_MODULE_6__entityManager_js__["a" /* default */].Add(cube);
        __WEBPACK_IMPORTED_MODULE_6__entityManager_js__["a" /* default */].Add(cube2);
        __WEBPACK_IMPORTED_MODULE_6__entityManager_js__["a" /* default */].Add(cube3);
        __WEBPACK_IMPORTED_MODULE_6__entityManager_js__["a" /* default */].Add(cube4);
        __WEBPACK_IMPORTED_MODULE_6__entityManager_js__["a" /* default */].Add(cube5);

        gl.uniform1i(gl.getUniformLocation(program.id,"favTex"),0);
        gl.uniform1i(gl.getUniformLocation(program.id,"skyTex"),1);
        gl.uniform1i(gl.getUniformLocation(program.id,"favTexNorm"),2);
        gl.uniform1i(gl.getUniformLocation(program.id,"mountainTex"),3);
        gl.uniform1i(gl.getUniformLocation(program.id,"dome3Tex"),4);
        gl.uniform1i(gl.getUniformLocation(program.id,"dome4Tex"),5);
        gl.uniform1i(gl.getUniformLocation(program.id,"dome5Tex"),6);
        res();
      });
    });
  }
  static SetAttribute(program,vary,stlide,vbo){
    let attributeLocation = gl.getAttribLocation(program,vary);
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.enableVertexAttribArray(attributeLocation);
    gl.vertexAttribPointer(attributeLocation,stlide,gl.FLOAT,false,0,0)
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
  }
}
/* harmony export (immutable) */ __webpack_exports__["default"] = Main;

onload = _=>{
  Main.Init();
}



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_js__ = __webpack_require__(0);


class VertexBuffer{
  constructor(data){
    this.id = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.createBuffer();
    const gl = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl;
    gl.bindBuffer(gl.ARRAY_BUFFER,this.id);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = VertexBuffer;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class EntityManager{
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
/* harmony export (immutable) */ __webpack_exports__["a"] = EntityManager;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Input{
  static Init(){
    Input.keyList = new Array(256).fill(false);
  }
  static isKeyInput(keyCode){
    return Input.keyList[keyCode];
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Input;


document.onkeydown = e=>{
  Input.keyList[e.keyCode] = true;
  if(e.keyCode != 82)e.preventDefault();
};
document.onkeyup = e=>{
  Input.keyList[e.keyCode] = false;
};




/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_js__ = __webpack_require__(0);


class IndexBuffer{
  constructor(data){
    this.id = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.createBuffer();
    const gl = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl;
    this.bind();
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
  bind(){
    const gl = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
  }
}
/* unused harmony export default */



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vertexBuffer_js__ = __webpack_require__(1);



class Program{
  constructor(){
    const gl = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl;
    this.id = gl.createProgram();
    this.index = [];
    this.po = 1;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Program;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__GLObject_glObject_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__GLObject_vertexBuffer_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__entityManager_js__ = __webpack_require__(2);





let polygonID = 0;

const State = {
  usual : 0,
  growing : 1,
  open : 2,
  shrinking : 3,
}


class Cube{
  constructor(pos,size,textureID,program){
    this.pos = pos;
    this.textureID = textureID;
    this.polygonID = polygonID;
    polygonID += 6;
    this.seed = rand3d(15);
    this.program = program;
    this.state = State.usual;
    if(textureID == 1){
      this.state = State.open;
      __WEBPACK_IMPORTED_MODULE_3__entityManager_js__["a" /* default */].openCube = this;
    }
    this.size = size;

    let E4 = [
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1,
    ]
    this.grow = [
      this.size,0,0,0,
      0,this.size,0,0,
      0,0,this.size,0,
      0,0,0,1,
    ]
    this.beat = E4;
    this.rotMatrix = E4;


    this.position = [
      //1
      0,0,0,//0
      1,0,0,//1
      0,1,0,//2
      1,1,0,//3
      //2
      0,0,1,
      1,0,1,
      0,1,1,
      1,1,1,
      //3
      0,0,0,
      1,0,0,
      0,0,1,
      1,0,1,
      //4
      0,1,0,
      1,1,0,
      0,1,1,
      1,1,1,
      //5
      0,0,0,
      0,1,0,
      0,0,1,
      0,1,1,
      //6
      1,0,0,
      1,1,0,
      1,0,1,
      1,1,1,
    ];
    this.position.forEach((p,i,a)=>{
      a[i]-=1/2;
    });
    this.positionBuffer = new __WEBPACK_IMPORTED_MODULE_2__GLObject_vertexBuffer_js__["a" /* default */](this.position);
    this.normal = [
      0,0,1,
      0,0,1,
      0,0,1,
      0,0,1,

      0,0,-1,
      0,0,-1,
      0,0,-1,
      0,0,-1,
      
      0,1,0,
      0,1,0,
      0,1,0,
      0,1,0,

      0,-1,0,
      0,-1,0,
      0,-1,0,
      0,-1,0,

      1,0,0,
      1,0,0,
      1,0,0,
      1,0,0,

      -1,0,0,
      -1,0,0,
      -1,0,0,
      -1,0,0,
    ]
    this.normalBuffer = new __WEBPACK_IMPORTED_MODULE_2__GLObject_vertexBuffer_js__["a" /* default */](this.normal);
    this.texuv = [
      0.0,0.0,
      0.0,1.0,
      1.0,0.0,
      1.0,1.0,
      //
      0.0,0.0,
      0.0,1.0,
      1.0,0.0,
      1.0,1.0,
      //
      0.0,0.0,
      0.0,1.0,
      1.0,0.0,
      1.0,1.0,
      //
      0.0,0.0,
      0.0,1.0,
      1.0,0.0,
      1.0,1.0,
      //
      0.0,0.0,
      0.0,1.0,
      1.0,0.0,
      1.0,1.0,
      //
      0.0,0.0,
      0.0,1.0,
      1.0,0.0,
      1.0,1.0,
      //
    ];
    this.texuvBuffer = new __WEBPACK_IMPORTED_MODULE_2__GLObject_vertexBuffer_js__["a" /* default */](this.texuv);

  }
  rotX4(a){
    return [
      1,0,0,0,
      0,cos(a),-sin(a),0,
      0,sin(a),cos(a),0,
      0,0,0,1,
    ];
  }
  rotY4(a){
    return [
      cos(a),0,-sin(a),0,
      0,1,0,0,
      sin(a),0,cos(a),0,
      0,0,0,1,
    ];
  }
  rotZ4(a){
    return [
      1,0,0,0,
      0,cos(a),-sin(a),0,
      0,sin(a),cos(a),0,
      0,0,0,1,
    ];
  }
  Rot(){
    let timer = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].timer;
    let rotX = this.rotX4(timer/(this.seed.x+50));
    let rotY = this.rotY4(timer/(this.seed.y+50));
    let rotZ = this.rotX4(timer/(this.seed.z+50));
    this.rotMatrix = multMatrix(multMatrix(rotY,rotZ),rotX);
  }
  Beat(){
    let timer = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].timer;
    let s = this.Size(timer);
    this.beat = [
      s,0,0,0,
      0,s,0,0,
      0,0,s,0,
      0,0,0,1,
    ];
  }
  Tap(){
    switch(this.state){
      case State.usual : 
        this.state = State.growing;
        __WEBPACK_IMPORTED_MODULE_3__entityManager_js__["a" /* default */].openCube.pos = mlv(-12,__WEBPACK_IMPORTED_MODULE_0__main_js__["default"].camera.forward);
        __WEBPACK_IMPORTED_MODULE_3__entityManager_js__["a" /* default */].growingCube = this;
        __WEBPACK_IMPORTED_MODULE_3__entityManager_js__["a" /* default */].openCube.state = State.shrinking;
        break;
    }
  }
  Update(){
    switch(this.state){
      case State.usual :
        this.Beat();
        this.Rot();
        break;
      case State.growing :
        this.Grow();
        break;
      case State.open :
        break;
      case State.shrinking :
        this.Rot();
        this.Shrink();
        break;
      default : cl("po");
    }
  }
  Bind(){ __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].SetAttribute(this.program.id,"uv",2,this.texuvBuffer.id);
    __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].SetAttribute(this.program.id,"position",3,this.positionBuffer.id);
    __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].SetAttribute(this.program.id,"normal",3,this.normalBuffer.id);
  }
  Grow(){
    let s = this.size;
    this.grow =[
      s,0,0,0,
      0,s,0,0,
      0,0,s,0,
      0,0,0,1,
    ];
    this.size *= 0.60;
    if(this.size <= 0.01){
      this.size = 30;
      this.pos = vec3(0,0,0);
      s = this.size;
      this.grow =[
        s,0,0,0,
        0,s,0,0,
        0,0,s,0,
        0,0,0,1,
      ];
      this.state = State.open;
      __WEBPACK_IMPORTED_MODULE_3__entityManager_js__["a" /* default */].growingCube = null;
      __WEBPACK_IMPORTED_MODULE_3__entityManager_js__["a" /* default */].openCube = this;
    }
  }
  Shrink(){
    let s = this.size;
    this.grow =[
      s,0,0,0,
      0,s,0,0,
      0,0,s,0,
      0,0,0,1,
    ];
    this.size = (this.size-1.5)*0.9 + 1.5;
    if(this.size <= 1.501){
      this.size = 1.5;
      s = this.size;
      this.grow =[
        s,0,0,0,
        0,s,0,0,
        0,0,s,0,
        0,0,0,1,
      ];
      this.state = State.usual;
    }
  }
  Draw(){
    this.Bind();
    //座標変換
    let center = [this.pos.x,this.pos.y,this.pos.z];
    const loc0 = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.getUniformLocation(this.program.id, "center");
    __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.uniform3fv(loc0,center);

    const loc2 = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.getUniformLocation(this.program.id, "rotMatrix");
    __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.uniformMatrix4fv(loc2,false,this.rotMatrix);

    __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.uniform1i(__WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.getUniformLocation(this.program.id,"texnum"),this.textureID);
    __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.uniform1i(__WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.getUniformLocation(this.program.id,"openTexnum"),__WEBPACK_IMPORTED_MODULE_3__entityManager_js__["a" /* default */].openCube.textureID);
    __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.uniform1i(__WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.getUniformLocation(this.program.id,"state"),this.state);
    //拍動
    const loc1 = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.getUniformLocation(this.program.id,"beat");
    __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.uniformMatrix4fv(loc1,false,this.beat);
    const loc3 = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.getUniformLocation(this.program.id,"size");
    __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.uniformMatrix4fv(loc3,false,this.grow);
    for(let i=0;i<6;i++){
      __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.drawArrays(__WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.TRIANGLE_STRIP,4*i,4);
    }
  }
  Size(t){
    let k = t%60;
    if(k < 5)k= 0.6/(k+3);
    else k =0;
    return 1-k;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Cube;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class GLObject{
  static Init(gl){
    this.gl = gl;
    this.programList = [];
  }
  static Add(program){
    this.programList.push(program);
  }
}
/* unused harmony export default */



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_js__ = __webpack_require__(0);


class Shader{
  static CreateShader(path){
    const gl = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl;
    return new Promise(res=>{ let ext = path.split(".")[1];
      let type;
      switch(ext){
        case "vert" : type = gl.VERTEX_SHADER;break;
        case "frag" : type = gl.FRAGMENT_SHADER;break;
      }
      const shader = gl.createShader(type);
      let xhr = new XMLHttpRequest();
      xhr.open("GET",path,true);
      xhr.addEventListener("load",event=>{
        let code = xhr.responseText;
        gl.shaderSource(shader,code);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          res(shader);
        } else {
          console.error(gl.getShaderInfoLog(shader));
        }
        res(shader);
      });

      xhr.send(null);
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Shader;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_js__ = __webpack_require__(0);

const id = 0;

class Texture{
  constructor(path,id){
    this.id = id;
    const gl = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl;
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Texture;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__input_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__entityManager_js__ = __webpack_require__(2);




class Camera{
  constructor(){
    this.acc = vec3(0,0,0);
    this.vel = vec3(0,0,0);
    this.pos = vec3(0,0,0),//座標
    this.forward = vec3(0,0,-1),//正面
    this.up = vec3(0,1,0),//上
    this.side = vec3(-1,0,0),//左
    this.alpha = 0;//カメラのz軸方向の回転?
    this.beta = 0;//カメラのx軸方向の回転?
    this.gamma = 0;//カメラのy軸方向の回転?
    this.asp = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].canvas.width/__WEBPACK_IMPORTED_MODULE_0__main_js__["default"].canvas.height;
  }
  Update(program){
    const gl = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl;

    this.vel = adv(this.vel,this.acc);
    this.pos = adv(this.pos,this.vel);
    this.vel.x *= 0.15;
    this.vel.y *= 0.15;
    this.vel.z *= 0.15;

    let eye = [
      this.pos.x,
      this.pos.y,
      this.pos.z,
    ];

    //debug
    if(__WEBPACK_IMPORTED_MODULE_1__input_js__["a" /* default */].isKeyInput(88))this.alpha += 0.02;
    if(__WEBPACK_IMPORTED_MODULE_1__input_js__["a" /* default */].isKeyInput(90))this.alpha -= 0.02;
    if(__WEBPACK_IMPORTED_MODULE_1__input_js__["a" /* default */].isKeyInput(38))this.beta += 0.02;
    if(__WEBPACK_IMPORTED_MODULE_1__input_js__["a" /* default */].isKeyInput(40))this.beta -= 0.02;
    if(__WEBPACK_IMPORTED_MODULE_1__input_js__["a" /* default */].isKeyInput(37))this.gamma += 0.02;
    if(__WEBPACK_IMPORTED_MODULE_1__input_js__["a" /* default */].isKeyInput(39))this.gamma -= 0.02;
    if(__WEBPACK_IMPORTED_MODULE_1__input_js__["a" /* default */].isKeyInput(32)){
      this.pos = adv(this.pos,this.forward);
    }
    if(__WEBPACK_IMPORTED_MODULE_1__input_js__["a" /* default */].isKeyInput(70)){
      this.pos = subv(this.pos,this.forward);
    }
    let b = this.beta;//x
    let c = this.gamma//y;
    let a = -this.alpha;//z
      let rotAlpha = [
        cos(a),-sin(a),0,
        sin(a),cos(a),0,
        0,0,1,
      ]
      let rotBeta = [
        1,0,0,
        0,cos(b),-sin(b),
        0,sin(b),cos(b),
      ]
      let rotGamma = [
        cos(c),0,-sin(c),
        0,1,0,
        sin(c),0,cos(c),
      ]

    let rotCamera = multMatrix3(multMatrix3(rotAlpha,rotBeta),rotGamma);
    b = -Math.PI/2;
    rotCamera = multMatrix3([
      1,0,0,
      0,cos(b),-sin(b),
      0,sin(b),cos(b),
    ],rotCamera);
    //ここは転置しない
    let forward = multMatrixVec3(rotCamera,[0,0,-1]);
    let up = multMatrixVec3(rotCamera,[0,1,0]);
    this.forward = {
      x : forward[0],
      y : forward[1],
      z : forward[2],
    }
    this.up = {
      x : up[0],
      y : up[1],
      z : up[2],
    }
    this.side = cross(this.up,this.forward);
    let side = [this.side.x,this.side.y,this.side.z]; 

    //整合性
    gl.uniform3fv(gl.getUniformLocation(program.id,"eye"),eye);
    gl.uniform3fv(gl.getUniformLocation(program.id,"forward"),forward);
    gl.uniform3fv(gl.getUniformLocation(program.id,"up"),up);
    gl.uniform3fv(gl.getUniformLocation(program.id,"side"),side);
    //view and projection
    this.Matrix(program);
  }
  Matrix(program){
    this.viewMatrix = this.LookAt(this.pos,this.forward,this.up);
    let timer = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].timer;
    const near = 0.0;
    const far = 6000;
    const t = 0.8;//画角

    this.projMatrix = [
      1 / (this.asp * t),0,0,0,
      0,1/t,0,0,
      0,0,(near+far) / (near-far), -1,
      0,0,2*near*far/(near-far),0.001
    ];
    const loc2 = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.getUniformLocation(program.id, "viewMatrix");
    const loc3 = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.getUniformLocation(program.id, "projMatrix");
    __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.uniformMatrix4fv(loc2,false,this.viewMatrix);
    __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.uniformMatrix4fv(loc3,false,this.projMatrix);
    __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.uniform1f(__WEBPACK_IMPORTED_MODULE_0__main_js__["default"].gl.getUniformLocation(program.id,"asp"),this.asp);
  }
  LookAt(eye,forward,up){
    const side = normalize(cross(forward,up));
    up = normalize(cross(forward, side));
    return [
      side.x, up.x, forward.x, 0,
      side.y, up.y, forward.y, 0,
      side.z, up.z, forward.z, 0,
      -dot(eye, side), -dot(eye, up), -dot(eye, forward), 1
    ];
  }
  RayCast(x,y){
    const u = x/__WEBPACK_IMPORTED_MODULE_0__main_js__["default"].canvas.width -0.5;
    const v = -(y/__WEBPACK_IMPORTED_MODULE_0__main_js__["default"].canvas.height -0.5);
    this.side = cross(this.up,this.forward);
    let side = mlv(u,this.side);
    let up = mlv(v,this.up);
    let ray = normalize(adv(adv(this.forward,side),up));
    cl(ray);
    
    __WEBPACK_IMPORTED_MODULE_2__entityManager_js__["a" /* default */].list.forEach(e=>{
      if(dot(normalize(subv(e.pos,this.pos)),ray)<-0.97)e.Tap();
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Camera;



/***/ })
/******/ ]);