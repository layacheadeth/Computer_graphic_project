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

    
    var light0=new BABYLON.DirectionalLight("dir0",new BABYLON.Vector3(-.1,-1,0),scene);

    

    return scene;
};
function CreateGround(scene){
    var ground=new BABYLON.Mesh.CreateGroundFromHeightMap("ground","/static/images/images.jpeg",2500,2500,200,-10,0,scene,false,onGroundCreated);
    function onGroundCreated(){
        var groundMaterial=new BABYLON.StandardMaterial("groundMaterial",scene);
        groundMaterial.diffuseTexture=new BABYLON.Texture("/static/images/wood.jpg",scene);
        ground.material=groundMaterial;
        ground.checkCollisions=true;
    }
    return ground;
}

function createCamera(scene){
    var camera=new BABYLON.FreeCamera("freeCamera",new BABYLON.Vector3(0,0,0),scene);
    camera.attachControl(canvas);
    camera.checkCollisions=true;
    camera.applyGravity=true;

    camera.keysUp.push('w',charCodeAt(0));
    camera.keysUp.push('W',charCodeAt(0));
    camera.keysDown.push('s',charCodeAt(0));
    camera.keysDown.push('S',charCodeAt(0));
    camera.keysLeft.push('a',charCodeAt(0));
    camera.keysLeft.push('A',charCodeAt(0));
    camera.keysRight.push('d',charCodeAt(0));
    camera.keysRight.push('D',charCodeAt(0));

    return camera;
}


window.addEventListener("resize",function(){
    engine.resize();
});