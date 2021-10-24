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
    //draw on canvas
    engine=new BABYLON.Engine(canvas,true);
    scene=createScene();
    //everytime we load a new canvas or modify it, runRenderLoop executes
    engine.runRenderLoop(function(){
        scene.render();
    });
}

var createScene=function(){
    var scene=new BABYLON.Scene(engine);
    scene.clearColor=new BABYLON.Color3(1,0,1);
    //
        //create a sphere with appropriate dimenstion and pass to scene, since we want to display
        var sphere= BABYLON.Mesh.CreateSphere("mysphere",32,2,scene);
        // same as sphere
        var ground=BABYLON.Mesh.CreateGround("myground",20,20,50,scene);
        // camera must be defined for an object to show. Camera always new. 
        var camera= new BABYLON.FreeCamera("mycamera",new BABYLON.Vector3(0,1,-10),scene);
    //

    return scene;
};

window.addEventListener("resize",function(){
    engine.resize();
});

