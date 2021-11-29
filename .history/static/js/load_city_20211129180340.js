var canvas = document.getElementById("renderCanvas");

        var engine = null;
        var scene = null;
        var sceneToRender = null;
        var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
        // You have to create a function called createScene. This function must return a BABYLON.Scene object
// You can reference the following variables: engine, canvas
// You must at least define a camera

const createScene=()=>{
    const scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled=true;
    // const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    var camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(0, 1, 1), scene);

    camera.radius = 5;
    camera.heightOffset = 2.5;
    camera.rotationOffset = 180;
    camera.cameraAcceleration = 0.005;
    camera.maxCameraSpeed = 10;

    camera.attachControl(canvas, true);

    camera.checkCollisions=false;


    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0)); 

    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(0.2, 0.2, 0.2);

    BABYLON.SceneLoader.ImportMeshAsync("", "/static/Model/city-street-babylon/", "city-street.babylon");

    // var skybox = BABYLON.Mesh.CreateBox('SkyBox', 1000, scene, false, BABYLON.Mesh.BACKSIDE);
    // skybox.material = new BABYLON.SkyMaterial('sky', scene);
    // skybox.material.inclination = 0;
    // skybox.material.cameraOffset.y = scene.activeCamera.globalPosition.y;
    // skybox.material.raleigh=0;
    // skybox.material.useSunPosition = true;
    // skybox.material.sunPosition = new BABYLON.Vector3(-200, 50, 0);
    // skybox.material.turbidity = 4;

    var playerMesh = BABYLON.Mesh.CreateBox("playerMesh", 1.0, scene);
    playerMesh.position.x=0;
    playerMesh.position.z=0;
    playerMesh.position.y=1;
    playerMesh.checkCollisions=true;
    camera.lockedTarget = playerMesh;


    let isWPressed = false;
    let isAPressed = false;
    let isSPressed = false;
    let isDPressed = false;

    document.addEventListener
            (
                'keydown',
                (e) =>
                {
                if(e.keyCode == 87){isWPressed=true;}
                if(e.keyCode == 65){isAPressed=true;}
                if(e.keyCode == 83){isSPressed = true;}
                if(e.keyCode == 68){isDPressed=true;}
                }
            );
    
            document.addEventListener
            (
                'keyup', (e) =>
                {
                if (e.keyCode == 87) { isWPressed = false; }
                if (e.keyCode == 65) { isAPressed = false; }
                if (e.keyCode == 83) { isSPressed = false; }
                if (e.keyCode == 68) { isDPressed = false; }
                }
            );

    // BABYLON.SceneLoader.ImportMeshAsync("", "/static/Model/Tank_model/", "german-panzer-ww2-ausf-b.babylon").then((result) => {
    //     const tank = scene.getMeshByName("Body 2");
    //     tank.position.y = 2;
    //     const tank1 = result.meshes[2];
    //     tank1.position.y = 3;
    //     tank1.position.z=106;
    // });
    // BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.glb").then(() => {
    //     const car = scene.getMeshByName("car");
    //     car.rotation = new BABYLON.Vector3(Math.PI / 2, 0, -Math.PI / 2);
    //     car.position.y = 0.5;
    //     car.position.x = -3;
    //     car.position.z = 8;

    //     const animCar = new BABYLON.Animation("carAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    //     const carKeys = []; 

    //     carKeys.push({
    //         frame: 0,
    //         value: 8
    //     });

    //     carKeys.push({
    //         frame: 150,
    //         value: -7
    //     });

    //     carKeys.push({
    //         frame: 2000,
    //         value: 20
    //     });

    //     animCar.setKeys(carKeys);

    //     car.animations = [];
    //     car.animations.push(animCar);

    //     scene.beginAnimation(car, 0, 200, true);
      
    //     //wheel animation
    //     const wheelRB = scene.getMeshByName("wheelRB");
    //     const wheelRF = scene.getMeshByName("wheelRF");
    //     const wheelLB = scene.getMeshByName("wheelLB");
    //     const wheelLF = scene.getMeshByName("wheelLF");
      
    //     scene.beginAnimation(wheelRB, 0, 30, true);
    //     scene.beginAnimation(wheelRF, 0, 30, true);
    //     scene.beginAnimation(wheelLB, 0, 30, true);
    //     scene.beginAnimation(wheelLF, 0, 30, true);
    // });

    return scene;
}




window.initFunction = async function() {
                    
                    
    var asyncEngineCreation = async function() {
        try {
        return createDefaultEngine();
        } catch(e) {
        console.log("the available createEngine function failed. Creating the default engine instead");
        return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
if (!engine) throw 'engine should not be null.';
window.scene = createScene();};
initFunction().then(() => {sceneToRender = scene        
engine.runRenderLoop(function () {
if (sceneToRender && sceneToRender.activeCamera) {
    sceneToRender.render();
}
});
});


// Resize
window.addEventListener("resize", function () {
engine.resize();
});
engine.runRenderLoop(function () {
scene.render();
});