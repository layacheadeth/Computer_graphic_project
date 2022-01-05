var canvas;
var engine;
var Game = {};
Game.scenes = [];
Game.activeScene = 0;

var isWPressed = false;
var isSPressed = false;
var isAPressed = false;
var isDPressed = false;
var isBPressed = false;
var isRPressed = false;

document.addEventListener("DOMContentLoaded", startGame);


function createLights(scene) {
    var light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-.1, -1, 0), scene);
    var light1 = new BABYLON.DirectionalLight("dir1", new BABYLON.Vector3(-1, -1, 0), scene);

}
export { createLights };
