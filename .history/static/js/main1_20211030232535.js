var canvas;
var engine;
var scene;
document.addEventListener("DOMContentLoaded",startGame);

function startGame(){
    canvas=document.getElementById("renderCanvas");
    engine=new BABYLON.Engine(canvas,true);
    scene=createScene();
    engine.runRenderLoop(function(){
        scene.render();
    });
}