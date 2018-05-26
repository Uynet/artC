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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__GLObject_indexBuffer_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__GLObject_program_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cube_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__GLObject_shader_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__matrix_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__GLObject_Texture_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__entityManager_js__ = __webpack_require__(8);









let gl,canvas,program;

window.ondeviceorientation = function(event) {
  Main.camera.alpha = event.alpha * 2*Math.PI/360;//z
  Main.camera.beta = event.beta * 2*Math.PI/360;//x
  Main.camera.gamma = event.gamma * 2*Math.PI/360;//y
};

class Main{
  static Init(){
    this.holeRadius = 0.1;
    __WEBPACK_IMPORTED_MODULE_5__matrix_js__["a" /* default */].Init();
    __WEBPACK_IMPORTED_MODULE_7__entityManager_js__["a" /* default */].Init();
    this.param = document.getElementById("poyo");

    this.Boot().then(Main.Render);
  }
  static Render(){
    Main.camera.Update();
    Main.param.innerHTML = `${Main.camera.alpha}</br>${Main.camera.beta}<br>${Main.camera.gamma}`;
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program.id);
    __WEBPACK_IMPORTED_MODULE_5__matrix_js__["a" /* default */].Update();
    Main.SendUniform();

    //Main.holeRadius += 0.002*Math.sin(Main.timer/120);
    gl.uniform1f(gl.getUniformLocation(program.id,"holeRadius"),Main.holeRadius);
    //空
    gl.uniform1i(gl.getUniformLocation(program.id,"texnum"),1);
    for(let i=0;i<6;i++){
      gl.drawArrays(gl.TRIANGLE_STRIP,4*i,4);
    }
    //鳥
    gl.uniform1i(gl.getUniformLocation(program.id,"texnum"),0);
    for(let i=6;i<12;i++){
      gl.drawArrays(gl.TRIANGLE_STRIP,4*i,4);
    }

    gl.flush();

    Main.timer+=1;
    requestAnimationFrame(Main.Render);
  }
  static Boot(){
    return new Promise(res=>{
      this.timer = 0;
      canvas = document.getElementById("po");
      canvas.width = 800;
      canvas.height = 800;
      gl = canvas.getContext("webgl");
      if(!gl)Main.param.innerHTML = "webGL対応してないよ";

      this.gl = gl;
      this.camera = {
        pos : vec3(0,0,-3.00),//座標
        forward : vec3(0,0,-1),//カメラの向き
        up : vec3(0,1,0),//カメラの上方向
        alpha : 0,//カメラのz軸方向の回転?
        beta : 0,//カメラのx軸方向の回転?
        gamma : 0,//カメラのy軸方向の回転?
        Update : function(){
          //カメラ関連
          let eye = [
            this.pos.x,
            this.pos.y,
            this.pos.z,
          ];
          this.beta += 0.01;
          let a = this.alpha;// * 2*Math.PI/360;//z
          let b = this.beta;// * 2*Math.PI/360;//x
          let c = this.gamma;// * 2*Math.PI/360;//y
          let rotCameraAlpha = [
            cos(a),-sin(a),0,
            sin(a),cos(a),0,
            0,0,1,
          ]
          let rotCameraBeta = [
            1,0,0,
            0,cos(b),-sin(b),
            0,sin(b),cos(b),
          ]
          let rotCameraGamma = [
            cos(c),0,-sin(c),
            0,1,0,
            sin(c),0,cos(c),
          ]
          let rotCamera = multMatrix3(rotCameraBeta,rotCameraGamma);
          rotCamera = multMatrix3(rotCamera,rotCameraAlpha);
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

          gl.uniformMatrix3fv(gl.getUniformLocation(program.id,"rotCamera"),false,rotCamera);
          gl.uniform3fv(gl.getUniformLocation(program.id,"eye"),eye);
        },
      }
      const texFav = new __WEBPACK_IMPORTED_MODULE_6__GLObject_Texture_js__["a" /* default */]("resource/fav.png",0);
      const texFavNorm = new __WEBPACK_IMPORTED_MODULE_6__GLObject_Texture_js__["a" /* default */]("resource/NormalMap.png",2);
      const texSkydome = new __WEBPACK_IMPORTED_MODULE_6__GLObject_Texture_js__["a" /* default */]("resource/skydome.png",1);
      const texMountaindome = new __WEBPACK_IMPORTED_MODULE_6__GLObject_Texture_js__["a" /* default */]("resource/mountain.png",3);

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

        const cube = new __WEBPACK_IMPORTED_MODULE_3__cube_js__["a" /* default */](0,0,0,30);
        const cube2 = new __WEBPACK_IMPORTED_MODULE_3__cube_js__["a" /* default */](0,0,0,1.00);
        __WEBPACK_IMPORTED_MODULE_7__entityManager_js__["a" /* default */].Add(cube);
        __WEBPACK_IMPORTED_MODULE_7__entityManager_js__["a" /* default */].Add(cube2);

        const positionBuffer = new __WEBPACK_IMPORTED_MODULE_0__GLObject_vertexBuffer_js__["a" /* default */](cube.position.concat(cube2.position))
        const normalBuffer = new __WEBPACK_IMPORTED_MODULE_0__GLObject_vertexBuffer_js__["a" /* default */](cube.normal.concat(cube2.normal))
        const texuvBuffer = new __WEBPACK_IMPORTED_MODULE_0__GLObject_vertexBuffer_js__["a" /* default */](cube.texuv.concat(cube2.texuv))
        this.SetAttribute(program.id,"uv",2,texuvBuffer.id);
        this.SetAttribute(program.id,"position",3,positionBuffer.id);
        this.SetAttribute(program.id,"normal",3,normalBuffer.id);

        gl.uniform1i(gl.getUniformLocation(program.id,"favTex"),0);
        gl.uniform1i(gl.getUniformLocation(program.id,"skyTex"),1);
        gl.uniform1i(gl.getUniformLocation(program.id,"favTexNorm"),2);
        gl.uniform1i(gl.getUniformLocation(program.id,"mountainTex"),3);
        res();
      });
    });
  }
  static SetAttribute(program,vary,stlide,vbo){
    let attributeLocation = gl.getAttribLocation(program,vary);
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.enableVertexAttribArray(attributeLocation);
    gl.vertexAttribPointer(attributeLocation,stlide,gl.FLOAT,false,0,0)
  }
  static SendUniform(){
    const vi = gl.getUniformLocation(program.id, "rotMatrix");
    const vi3 = gl.getUniformLocation(program.id, "poMatrix");
    const vi2 = gl.getUniformLocation(program.id, "viewMatrix");
    const vi4 = gl.getUniformLocation(program.id, "projMatrix");
    gl.uniformMatrix4fv(vi,false,__WEBPACK_IMPORTED_MODULE_5__matrix_js__["a" /* default */].rotMatrix);
    gl.uniformMatrix4fv(vi2,false,__WEBPACK_IMPORTED_MODULE_5__matrix_js__["a" /* default */].viewMatrix);
    gl.uniformMatrix4fv(vi3,false,__WEBPACK_IMPORTED_MODULE_5__matrix_js__["a" /* default */].poMatrix);
    gl.uniformMatrix4fv(vi4,false,__WEBPACK_IMPORTED_MODULE_5__matrix_js__["a" /* default */].projMatrix);
  }
}
/* harmony export (immutable) */ __webpack_exports__["default"] = Main;

onload =   Main.Init();
//document.addEventListener("deviceorientation", function(event) {



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
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_js__ = __webpack_require__(0);


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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Cube{
  constructor(x,y,z,e){
    this.position = [
      //1
      0,0,0,//0
      e,0,0,//1
      0,e,0,//2
      e,e,0,//3
      //2
      0,0,e,
      e,0,e,
      0,e,e,
      e,e,e,
      //3
      0,0,0,
      e,0,0,
      0,0,e,
      e,0,e,
      //4
      0,e,0,
      e,e,0,
      0,e,e,
      e,e,e,
      //5
      0,0,0,
      0,e,0,
      0,0,e,
      0,e,e,
      //6
      e,0,0,
      e,e,0,
      e,0,e,
      e,e,e,
    ];
    this.position.forEach((p,i,a)=>{
      a[i]-=e/2;
      if(i%3==0)a[i]+=x;
      if(i%3==1)a[i]+=y;
      if(i%3==2)a[i]+=z;
    });
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
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Cube;

/*
      0.0, 0.0,
      1/4, 0.0,
      2/4, 1/4,
      3/4, 1/4,

      0.0, 2/4,
      1/4, 2/4,
      2/4, 3/4,
      3/4, 3/4,

      0.0, 0.0,
      1/4, 0.0,
      0.0, 2/4,
      1/4, 2/4,

      2/4, 1/4,
      3/4, 1/4,
      2/4, 3/4,
      3/4, 3/4,

      0.0, 0.0,
      2/4, 1/4,
      0.0, 2/4,
      2/4, 3/4,

      1/4, 0.0,
      3/4, 1/4,
      1/4, 2/4,
      3/4, 3/4,
      */


/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_js__ = __webpack_require__(0);

class Matrix{
  static Init(){
    this.viewMatrix = [];
    this.rotMatrix = [];
    this.projMatrix = [];
  }
  static Size(t){
    let k = t%60;
    if(k < 5)k= 0.6/(k+3);
    else k =0;
    return 1-k;
  }
  static Update(){
    let timer = __WEBPACK_IMPORTED_MODULE_0__main_js__["default"].timer;
    let s = this.Size(timer);
    const near = 0.0;
    const far = 1000;
    const t = 1;//画角
    const asp = 1;//アスペクト日
    this.projMatrix = [
      1 / (asp * t),0,0,0,
      0,1/t,0,0,
      0,0,(near+far) / (near-far), -1,
      0,0,2*near*far/(near-far),0.001
    ];
    this.poMatrix = [
      s,0,0,0,
      0,s,0,0,
      0,0,s,0,
      0,0,0,1,
    ]
    let rot1 = [
      cos(timer/57),0,-sin(timer/57),0,
      0,1,0,0,
      sin(timer/57),0,cos(timer/57),0,
      0,0,0,1,
    ];
    let e1 = [
      cos(timer/71),-sin(timer/71),0,0,
      sin(timer/71),cos(timer/71),0,0,
      0,0,1,0,
      0,0,0,1,
    ];
    let e2 = [
      1,0,0,0,
      0,cos(timer/41),-sin(timer/41),0,
      0,sin(timer/41),cos(timer/41),0,
      0,0,0,1,
    ];
    this.viewMatrix = this.LookAt(__WEBPACK_IMPORTED_MODULE_0__main_js__["default"].camera.pos,__WEBPACK_IMPORTED_MODULE_0__main_js__["default"].camera.forward,__WEBPACK_IMPORTED_MODULE_0__main_js__["default"].camera.up);
    let po = multMatrix(e1,e2);
    this.rotMatrix = multMatrix(rot1,po);
  }
  static LookAt(eye,forward,up){
    const side = normalize(cross(forward,up));
    up = normalize(cross(forward, side));
    return [
      side.x, up.x, forward.x, 0,
      side.y, up.y, forward.y, 0,
      side.z, up.z, forward.z, 0,
      -dot(eye, side), -dot(eye, up), -dot(eye, forward), 1
    ];
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Matrix;



/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class EntityManager{
  static Init(){
    this.list = [];
  }
  static Add(e){
    this.list.push(e);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EntityManager;



/***/ })
/******/ ]);