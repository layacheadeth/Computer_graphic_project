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

var createScene = function(){
    var scene=new BABYLON.Scene(engine);
    scene.clearColor=new BABYLON.Color3(1,0,1);
    return scene;
};

window.addEventListener("resize",function(){
    engine.resize();
});