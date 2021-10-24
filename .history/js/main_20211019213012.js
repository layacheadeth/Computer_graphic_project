///< reference path="js/babylon.max.js"></reference>
// a canvas we can draw on
var canvas;
// a pencil to draw on canvas
var engine;
//object we want to display on canvas
var scene;
///once the javascript is fully loaded, perform startgame
document.addEventListener("DOMContentLoaded",startGame);

function startGame(){
    canvas=document.getElementById("rendercanvas");
    engine=new BABYLON.Engine(canvas,true);
    scene=createScene();
    engine.runRenderLoop(function(){
        scene.render();
    });
}

