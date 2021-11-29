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

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0)); 

    BABYLON.SceneLoader.ImportMeshAsync("", "/static/Model/city-street-babylon/", "city-street.babylon");
    BABYLON.SceneLoader.ImportMeshAsync("", "/static/Model/Tank_model/", "german-panzer-ww2-ausf-b.babylon").then((result) => {
        const tank = scene.getMeshByName("tank");
        tank.position.y = 2;
        const tank1 = result.meshes[2];
        tank1.position.y = 1;
    });
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