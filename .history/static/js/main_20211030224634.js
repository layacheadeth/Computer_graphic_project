///< reference path="js/babylon.max.js"></reference>
// a canvas we can draw on
var canvas;
// a pencil to draw on canvas
var engine;
//object we want to display on canvas
var scene;
///once the javascript is fully loaded, perform startgame
document.addEventListener("DOMContentLoaded",startGame);

// function startGame with a larger resolution;
function startGame(){
    // var BABYLON = require("../../dist/preview release/babylon.max");
    // var LOADERS = require("../../dist/preview release/loaders/babylonjs.loaders");
    // global.XMLHttpRequest = require('xhr2').XMLHttpRequest;

    // var engine = new BABYLON.NullEngine({
    //     renderWidth: 512,
    // renderHeight: 256,
    // textureSize: 512

    // });
    canvas=document.getElementById("rendercanvas");
    //draw on canvas
    canvas.style.width="1800px";
    canvas.style.height="1200px";
    engine=new BABYLON.Engine(canvas,true);
    canvas.style.width="100%";
    canvas.style.height="100%";

    scene=createScene();
    //this modifysettings function enable our pointer to synchronize with the game.
    // no need to left click and move. It's auto sync and we can just move directly.
    // modifySettings();
    //everytime we load a new canvas or modify it, runRenderLoop executes
    engine.runRenderLoop(function(){
        scene.render();
    });

}

// const createScene = () => {
//     const scene = new BABYLON.Scene(engine);

//     var ground=CreateGround(scene);
//     const camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 4, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene);
//     camera.attachControl(canvas, true);
    
//     const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

//     const box = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 2, depth: 1});
//     // box.position.y+=3.6;
    


//     return scene;

// };;

var createScene = function(){
    var scene=new BABYLON.Scene(engine);
    // pass this scene to ground so we know which scene that ground should be placed on. not just random scene
    var ground=CreateGround(scene);
    var camera=createCameara(scene);
    // var tank=createTank(scene);
    const box = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 2, depth: 1});

    // var camera=new BABYLON.FreeCamera("freeCamera",new BABYLON.Vector3(0,0,0),scene);
    // //give camera control so we can move around
    // camera.attachControl(canvas);
    // camera.position.y=250;
    // //to make collisions happen and not going through object.
    // camera.checkCollisions=true;
    // // make player unable to fly
    // camera.applyGravity=true;
    //this light is to give light to heightmap
    var light=new BABYLON.DirectionalLight("dir0",new BABYLON.Vector3(-.1,-1,0),scene);
    return scene;
};

function CreateGround(scene){
     //create a heightmap ground or texture.
    //input name,path,width,height,rgb color,scene,whether to change, what to do after show(callback);
    var ground=new BABYLON.Mesh.CreateGroundFromHeightMap("ground","/static/images/heightmap.jpeg",2000,2000,20,0,300,scene,false,OnGroundCreated);
    function OnGroundCreated(){
        var groundMaterial=new BABYLON.StandardMaterial("groundMaterial",scene);
        groundMaterial.diffuseTexture=new BABYLON.Texture("/static/images/wood.jpeg",scene);
        ground.material=groundMaterial;
        //to make collisions happen and not going through object.
        ground.checkCollisions=true;
    };
    // var groundMaterial=new BABYLON.StandardMaterial("ground",scene);
    // groundMaterial.diffuseTexture=new BABYLON.Texture("images/grass.jpg",scene);

    // const ground=BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground","images/heightmap.jpg",{
    //     width:200,height:200, subdivisions:2,maxHeight:300,minHeight:200
    // });
    // ground.material=groundMaterial;
    // return ground;
    return ground;
}

function createCameara(scene){
    var camera=new BABYLON.FreeCamera("freecamera",new BABYLON.Vector3(0,0,0),scene);
    camera.attachControl(canvas);
    camera.position.y=250;
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




//event listener for a higher resolutions
function createTank(scene){
    var tank=new BABYLON.MeshBuilder.CreateBox("HeroTank",{height:30,depth:3,width:6000},scene);
    var tankMaterial=new BABYLON.StandardMaterial("tankMaterial",scene);
    tankMaterial.diffuseColor=new BABYLON.Color3.Red;
    // tankMaterial.emissiveColor=new BABYLON.Color3.Blue;
    tank.material=tankMaterial;

    tank.position.y+=3.6;
    

    return tank;
}
window.addEventListener("resize",function(){
    canvas.style.width = "1800px";
    canvas.style.height = "1200px";
    engine.resize();
    canvas.style.width = '100%';
    canvas.style.height = '100%';
});


/*window.addEventListener("resize",function(){
    engine.resize();
});*/
//this function print in console when we first click to move direction. Then it prints 
// that the lock has been requested already.
function modifySettings()
{
    scene.onPointerDown=function(){
        if(!scene.alreadyLocked){
            console.log("Request pointer lock");
            //we request alot of pointer lock so we can supports all browser
            canvas.requestPointerLock=canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            canvas.requestPointerLock();
        }
        else{
            console.log("Not requesting because we are already locked");
        }      
    }
    //we need to add to various lockchange so it supports all browser
    document.addEventListener("pointerlockchange",pointerLockListener);
    document.addEventListener("mspointerlockchange",pointerLockListener);
    document.addEventListener("mozpointerlockchange",pointerLockListener);
    document.addEventListener("webkitpointerlockchange",pointerLockListener);


    function pointerLockListener(){
        var element=document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || null ;
        if (element){
            scene.alreadyLocked=true;
        }
        else{
            scene.alreadyLocked=false;
        }
    }
}
// modify setting function is used to handle all the click it does when opening camera
//it tell when you request camera open for first time, then make sure the click is supported in all
//browser

