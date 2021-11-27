var canvas;
var engine;
var scene;
document.addEventListener("DOMContentLoaded",startGame);

function startGame(){
    canvas=document.getElementById("renderCanvas");
    engine=new BABYLON.Engine(canvas,true);
    scene=createScene();
    var toRender= function() {
        scene.render();

    };
    engine.runRenderLoop(toRender);
}

var createScene = function(){
    var scene=new BABYLON.Scene(engine);
    var ground=CreateGround(scene);

    var camera=new BABYLON.FreeCamera("freeCamera",new BABYLON.Vector3(0,0,0),scene);
    camera.attachControl(canvas);
    
    

    return scene;
};
function CreateGround(scene){
    var ground=new BABYLON.Mesh.CreateGroundFromHeightMap("ground","/static/images/images.jpeg",200,200,20,0,100,scene,false,onGroundCreated);
    function onGroundCreated(){
        var groundMaterial=new BABYLON.StandardMaterial("groundMaterial",scene);
        groundMaterial.diffuseTexture=new BABYLON.Texture("/static/images/wood.jpg",scene);
        ground.material=groundMaterial;
    }
    return ground;
}


window.addEventListener("resize",function(){
    engine.resize();
});