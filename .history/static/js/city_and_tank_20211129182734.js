var canvas = document.getElementById("renderCanvas");

        var engine = null;
        var scene = null;
        var sceneToRender = null;
        var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
        // You have to create a function called createScene. This function must return a BABYLON.Scene object
        // You can reference the following variables: scene, canvas
        // You must at least define a camera
        
        var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
        // var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
        
        /******* Add the create scene function ******/
            var delayCreateScene = function()
            {  
            // Create the scene space
            var scene = new BABYLON.Scene(engine);
            scene.collisionsEnabled=true;
            // This creates and initially positions a follow camera 	
            var camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(0, 1, 1), scene);
        	
        	//The goal distance of camera from target
        	camera.radius = 5;
        	
        	// The goal height of camera above local origin (centre) of target
        	camera.heightOffset = 2.5;
        	
        	// The goal rotation of camera around local origin (centre) of target in x y plane
        	camera.rotationOffset = 180;
        	
        	//Acceleration of camera in moving from current to goal position
        	camera.cameraAcceleration = 0.005;
        	
        	//The speed at which acceleration is halted 
        	camera.maxCameraSpeed = 10;
            
        	// This attaches the camera to the canvas
            camera.attachControl(canvas, true);
        
            // turn off camera collisions
            camera.checkCollisions=false;
        
            // Add a light
            // var light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(0,4,0), scene);
            // light1.diffuse = new BABYLON.Color3(1, 0.4, 0.4);
        	// light1.specular = new BABYLON.Color3(0.5, 0.2, 0.2);
            // light1.intensity = 4;
            // light1.range = 10;

            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0)); 
        
            // gravity
            scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        
            // no gravity for camera
            camera.applyGravity = true;
            
            // camera elipsoid
            camera.ellipsoid = new BABYLON.Vector3(0.2, 0.2, 0.2);

            BABYLON.SceneLoader.ImportMeshAsync("", "/static/Model/city-street-babylon/", "city-street.babylon");
        
            // skybox
            // var skybox = BABYLON.Mesh.CreateBox('SkyBox', 1000, scene, false, BABYLON.Mesh.BACKSIDE);
            // skybox.material = new BABYLON.SkyMaterial('sky', scene);
            // skybox.material.inclination = 0;
            // skybox.material.cameraOffset.y = scene.activeCamera.globalPosition.y;
            // skybox.material.raleigh=0;
            // skybox.material.useSunPosition = true;
            // skybox.material.sunPosition = new BABYLON.Vector3(-200, 50, 0);
            // skybox.material.turbidity = 4;
        
            // ground
            // var gnd=BABYLON.MeshBuilder.CreateGround("gnd", {width: 16, height: 16, subdivsions: 1}, scene);
            // var gnd_mat=new BABYLON.StandardMaterial("gnd_mat", scene);
            // gnd_mat.diffuseColor=new BABYLON.Color3(1, 1, 1);
            // gnd.material=gnd_mat;
            // gnd.checkCollisions=true;
        
            //wall texture
            var wall_mat=new BABYLON.StandardMaterial("wall_mat", scene);
            wall_mat.diffuseColor = new BABYLON.Color3(0.5, 1, 0.5);
        
            // walls
            var wallNorth=BABYLON.MeshBuilder.CreatePlane("wallNorth", {width: 70, height: 3, subdivsions: 1}, scene);
            wallNorth.position.y=1.35;
            wallNorth.position.x=0;
            wallNorth.position.z=-32;
            wallNorth.addRotation(0, Math.PI, 0);
            wallNorth.material=wall_mat;
            wallNorth.checkCollisions=true;
        
            var wallSouth=BABYLON.MeshBuilder.CreatePlane("wallSouth", {width: 70, height: 3, subdivsions: 1}, scene);
            wallSouth.position.y=1.35;
            wallSouth.position.x=32;
            wallSouth.position.z=0;
            wallSouth.addRotation(0, Math.PI/2, 0);
            wallSouth.material=wall_mat;
            wallSouth.checkCollisions=true;
        
            var wallEast=BABYLON.MeshBuilder.CreatePlane("wallEast", {width: 70, height: 3, subdivsions: 1}, scene);
            wallEast.position.y=1.35;
            wallEast.position.x=0;
            wallEast.position.z=32;
            wallEast.addRotation(0, 0, 0);
            wallEast.material=wall_mat;
            wallEast.checkCollisions=true;
        
            var wallWest=BABYLON.MeshBuilder.CreatePlane("wallWest", {width: 70, height: 3, subdivsions: 1}, scene);
            wallWest.position.y=1.35;
            wallWest.position.x=-32;
            wallWest.position.z=0;
            wallWest.addRotation(0, -Math.PI/2, 0);
            wallWest.material=wall_mat;
            wallWest.checkCollisions=true;
        
            // pylons (obstacles)
            var pyl_mat = new BABYLON.StandardMaterial("pyl_mat", scene);
            pyl_mat.diffuseColor = new BABYLON.Color3(0.8, 0.9, 0.3);
        
            pyl=[];
            pyl[0]=BABYLON.MeshBuilder.CreateCylinder
                (
                'pyl0',
                    {
                    diameterTop: 0.5,
                    diameterBottom: 0.5,
                    height: 2.75,
                    tessellation: 16
                    },
                scene
                );
            pyl[0].position.y=1.35;
            pyl[0].material=pyl_mat;
            pyl[0].checkCollisions=true;
        
            for (var i=1;i<6;i++)
            {
            pyl[i] = pyl[0].createInstance("pyl"+i);
            pyl[i].checkCollisions=true;
            }
        
            var i=0;
            pyl[i].position.x=2;
            pyl[i].position.z=4;
            i=1;
            pyl[i].position.x=-2;
            pyl[i].position.z=4;
            i=2;
            pyl[i].position.x=2;
            pyl[i].position.z=-4;
            i=3;
            pyl[i].position.x=-2;
            pyl[i].position.z=-4;
            i=4;
            pyl[i].position.x=4;
            pyl[i].position.z=2;
            i=5;
            pyl[i].position.x=4;
            pyl[i].position.z=-2;
        
            var playerMesh=[];
        
            // Player "character" version 1. They're a bit boxy, but it works.
            var playerMesh = BABYLON.Mesh.CreateBox("playerMesh", 1.0, scene);
            playerMesh.position.x=0;
            playerMesh.position.z=0;
            playerMesh.position.y=1;
            playerMesh.checkCollisions=true;
            camera.lockedTarget = playerMesh;
        
            // Player "character" version 2. They're a cool shark, but it doesn't work.
            /*
            BABYLON.SceneLoader.ImportMesh
            (
                '',
                'https://models.babylonjs.com/',
                'shark.glb',
                scene,
                function(meshes)
                {          
                playerMesh=meshes[0];
                playerMesh.scaling=new BABYLON.Vector3(0.1,0.1,0.1);
                playerMesh.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
                playerMesh.checkCollisions=true;
                camera.lockedTarget = playerMesh;
                });
            */
        
            // WASD control of Player "character".
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
        
            scene.registerBeforeRender
            (   function()
                {   if(!scene.isReady()){return;}
                    if(isWPressed || isSPressed)
                    {   
                    var playerSpeed=0.1;
                    var gravity=0;
                    var x=playerSpeed*parseFloat(Math.sin(playerMesh.rotation.y));
                    var z=playerSpeed*parseFloat(Math.cos(playerMesh.rotation.y));
                        if(isWPressed==true)
                        {
                        //playerMesh.locallyTranslate(new BABYLON.Vector3(0, 0, 0.1));
                        var forwards = new BABYLON.Vector3(x, gravity, z);
                        playerMesh.moveWithCollisions(forwards);
                        }
                        if(isSPressed==true)
                        {
                        //playerMesh.locallyTranslate(new BABYLON.Vector3(0, 0, -0.1));
                        var backwards = new BABYLON.Vector3(-x, gravity, -z);
                        playerMesh.moveWithCollisions(backwards);
                        }
                    }
                    if(isAPressed==true)
                    {
                    playerMesh.addRotation(0,-0.05,0);
                    }
                    if(isDPressed==true)
                    {
                    playerMesh.addRotation(0,0.05,0);
                    }
                }
            );
        
            return scene;
            };
        var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        var scene = delayCreateScene();
        
        engine.runRenderLoop(function () {
            if (scene) {
                scene.render();
            }
        });
        
        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });
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
        window.scene = delayCreateScene();};
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
