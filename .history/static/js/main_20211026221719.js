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

var createScene = function(){
    var scene=new BABYLON.Scene(engine);
    // pass this scene to ground so we know which scene that ground should be placed on. not just random scene
    var ground=CreateGround(scene);
    var camera=createCameara(scene);
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
        groundMaterial.diffuseTexture=new BABYLON.Texture("/static/images/map.jpeg",scene);
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



/*function startGame(){
    canvas=document.getElementById("rendercanvas");
    //draw on canvas
    engine=new BABYLON.Engine(canvas,true);
    scene=createScene();
    //everytime we load a new canvas or modify it, runRenderLoop executes
    engine.runRenderLoop(function(){
        scene.render();
    });
}*/

// var createScene=function(){
//     var scene=new BABYLON.Scene(engine);
//     scene.ambientColor=new BABYLON.Color3(0,1,0);

//     //Geometries & materials
//     var ground=BABYLON.Mesh.CreateGround("myground",60,60,50,scene);
//     var mirror=new BABYLON.StandardMaterial("mirror",scene);
//     //give some diffuse color
//     mirror.diffuseColor=new BABYLON.Color3(0.4,1,0.4);
//     //give some specular color
//     mirror.specularColor=new BABYLON.Color3.Black;
//     //initialize reflection on the scene
//     mirror.reflectionTexture=new BABYLON.MirrorTexture("mirror",1024,scene,true);
//     //build a mirror that reflect directly with the scene
//     mirror.reflectionTexture.mirrorPlane= new BABYLON.Plane(0,-1,0,-2);
//     //level of reflect, the lighter such as 0.1, the more invisible of reflection. The heavier, the more visible.
//     //ex. 1, 2
//     mirror.reflectionTexture.level=1
//     ground.material=mirror;

//     var spheres=[];
//     var sphereMaterials=[];

//     //this generate many sphere, different pos(x,y), different sphere.
//     for (var i=0; i<10;i++){
//         spheres[i]=BABYLON.Mesh.CreatSphere("mysphere"+i,32,2,scene);
//         spheres[i].position.x+=3*i-9;
//         spheres[i].position.y+=2;
//         sphereMaterials[i]=new BABYLON.StandardMaterial("sphereMaterial"+i,scene);
//         spheres[i].material=spheresMaterial[i];
//         //push reflection to scene, if not push. reflection not shown. 
//         mirror.reflectionTexture.renderList.push(spheres[i]);
//     }

// };


//create scene to display sphere,ground,and some light on it
// var createScene=function(){
//     var scene=new BABYLON.Scene(engine);
//     scene.clearColor=new BABYLON.Color3(1,0,1);
//     //
//         //create a sphere with appropriate dimenstion and pass to scene, since we want to display
//         var sphere= BABYLON.Mesh.CreateSphere("mysphere",32,2,scene);
//         // same as sphere
//         var ground=BABYLON.Mesh.CreateGround("myground",20,20,50,scene);
//         // camera must be defined for an object to show. Camera always new. 
//         var camera= new BABYLON.FreeCamera("mycamera",new BABYLON.Vector3(0,1,-10),scene);
//         //this attachControl allows you to lookaround the object using pointer, or left-right-up-down key.
//         // you can let the camera move around the object as u like.
//         camera.attachControl(canvas);
//         // default color black, want white? add some light
//         var light=new BABYLON.PointLight("mypointlight",new BABYLON.Vector3(0,10,0),scene);
//         //manipuate light intensity, light by default is not shown, only if you create it dimension.
//         light.intensity=.5;
//         //change color. this case, it is red. Diffuse display color in illuminated environment
//         light.diffuse=new BABYLON.Color3(1,0,0);
//         //

//     return scene;
// };
//event listener for a higher resolutions
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
            canvas.requestPointerLock();
        }
        else{
            console.log("Not requesting because we are already locked");
        }      
    }
    document.addEventListener("pointerlockchange",pointerLockListener);
    function pointerLockListener(){
        var element=document.pointerLockElement || null ;
        if (element){
            scene.alreadyLocked=true;
        }
        else{
            scene.alreadyLocked=false;
        }
    }
}
