var canvas;
var engine;
var scene;
document.addEventListener("DOMContentLoaded",startGame);

function startGame(){
    canvas=document.getElementById("renderCanvas");
    engine=new BABYLON.Engine(canvas,true);
    scene=createScene();
    // modifySettings();
    var tank=scene.getMeshByName("HeroTank");
    var toRender= function() {
        tank.position.z+=1;

        scene.render();

    };
    engine.runRenderLoop(toRender);
}

var createScene = function(){
    var scene=new BABYLON.Scene(engine);
    var ground=CreateGround(scene);

    var camera=createCameara(scene);
    var tank=createTank(scene);
    var followcamera=createFollowCamera(scene,tank);
    scene.activeCamera=followcamera;
    
    var light0=new BABYLON.DirectionalLight("dir0",new BABYLON.Vector3(-.1,-1,0),scene);

    

    return scene;
};

function createFollowCamera(scene,target){
    var camera=new BABYLON.followcamera("tankFollowCamera",target.position,scene,target);
    camera.radius=20;
    camera.heightOffset=4;
    camera.rotationOffset=180;
    camera.cameraAcceleration=0.5;
    camera.maxCameraSpeed=50;
    return camera;
}

function createTank(scene){
    var tank=new BABYLON.MeshBuilder.CreateBox("HeroTank",{height:3,depth:6,width:6},scene);
    var tankMaterial=new BABYLON.StandardMaterial("tankMaterial",scene);
    tankMaterial.diffuseColor=new BABYLON.Color3.Red;
    tank.material=tankMaterial;
    tankMaterial.emissiveColor=new BABYLON.Color3.Blue;
    tank.position.y+=1;
    return tank;
}

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

function createCameara(scene){
    var camera=new BABYLON.FreeCamera("freecamera",new BABYLON.Vector3(0,0,0),scene);
    camera.attachControl(canvas);
    // camera.position.y=250;
    camera.checkCollisions=true;
    camera.applyGravity=true;
    
    //move up,down,left,right with a,w,s,d
    camera.keysUp.push('W'.charCodeAt(0));
    // camera.keysUp.push('W'.charCodeAt(0));
    camera.keysDown.push('S'.charCodeAt(0));
    // camera.keysDown.push('S'.charCodeAt(0));
    camera.keysLeft.push('A'.charCodeAt(0));
    // camera.keysLeft.push('A'.charCodeAt(0));
    camera.keysRight.push('D'.charCodeAt(0));
    // camera.keysRight.push('D'.charCodeAt(0));

    return camera;
}


window.addEventListener("resize",function(){
    engine.resize();
});

function modifySettings(){
    scene.onPointerDown=function(){
        if(!scene.alreadyLocked){
            canvas.requestPointerLock();
            canvas.requestPointerLock=canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            canvas.requestPointerLock();
        }
        
    };

    document.addEventListener("pointerlockchange",pointerLockListener);
    document.addEventListener("mspointerlockchange",pointerLockListener);
    document.addEventListener("mozpointerlockchange",pointerLockListener);
    document.addEventListener("webkitpointerlockchange",pointerLockListener);

    function pointerLockListener(){
        var element=document.pointerLockElement || document.mozPointerLockElement || document.msPointerLockElement || document.webkitPointerLockElement || null;
        if(element){
            scene.alreadyLocked=true;
        }
        else{
            scene.alreadyLocked=false;

        }
    }
}