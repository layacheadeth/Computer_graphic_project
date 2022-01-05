var canvas;
var engine;
var Game = {};
Game.scenes = [];
Game.activeScene = 0;

var isWPressed = false;
var isSPressed = false;
var isAPressed = false;
var isDPressed = false;
var isBPressed = false;
var isRPressed = false;

document.addEventListener("DOMContentLoaded", startGame);


class Dude {
    constructor(dudeMesh, speed, id, scene, scaling) {
        this.dudeMesh = dudeMesh;
        this.id = id;
        this.scene = scene;
        this.health = 3;
        this.frontVector = new BABYLON.Vector3(0, 0, -1);
        dudeMesh.Dude = this;

        if (speed)
            this.speed = speed;
        else
            this.speed = 1;

        if (scaling) {
            this.scaling = scaling;
            this.dudeMesh.scaling = new BABYLON.Vector3(this.scaling, this.scaling, this.scaling);
        }
        else
            this.scaling = 1;

        if (Dude.boundingBoxParameters == undefined) {
            Dude.boundingBoxParameters = this.CalculateBoundingBoxParameters();
        }

        // this below function create particle for dude to be able to shoot and kill other

        Dude.activeScenes = {};
        if (Dude.particleSystem == undefined || Dude.activeScenes[Game.activeScene] == undefined) {
            Dude.activeScenes[Game.activeScene] = true;
            Dude.particleSystem = this.createDudeParticleSystem();
        }

        this.bounder = this.createBoundingBox();
        this.bounder.dudeMesh = this.dudeMesh;
    }

    followTank() {
        var scene = this.scene;

        if (!this.bounder) return;
        this.dudeMesh.position = new BABYLON.Vector3(this.bounder.position.x,
            this.bounder.position.y - this.scaling * Dude.boundingBoxParameters.lengthY / 2.0, this.bounder.position.z);
        var tank = scene.getMeshByName("heroTank");
        var direction = tank.position.subtract(this.dudeMesh.position);
        var distance = direction.length();
        var dir = direction.normalize();
        var alpha = Math.atan2(-1 * dir.x, -1 * dir.z);
        this.dudeMesh.rotation.y = alpha;
        if (distance > 30)
            this.bounder.moveWithCollisions(dir.multiplyByFloats(this.speed, this.speed, this.speed));
    }

    moveFPS() {
        var scene = this.scene;
        scene.activeCamera = scene.activeCameras[0];
        if (scene.activeCamera != scene.followCameraDude && scene.activeCamera != scene.freeCameraDude) {
            this.dudeMesh.animatableObject.pause();
            return;
        }
        if (isWPressed || isSPressed) {
            this.dudeMesh.animatableObject.restart();
        }
        else {
            this.dudeMesh.animatableObject.pause();
        }

        if (scene.activeCamera == scene.followCameraDude) {
            if (!this.bounder) return;
            this.adjustYPosition();
            this.adjustXZPosition();

            var direction = this.frontVector;
            var dir = direction.normalize();
            var alpha = Math.atan2(-1 * dir.x, -1 * dir.z);
            this.dudeMesh.rotation.y = alpha;
            if (isWPressed) {
                this.bounder.moveWithCollisions(this.frontVector.multiplyByFloats(this.speed, this.speed, this.speed));
            }

            if (isSPressed) {
                this.bounder.moveWithCollisions(this.frontVector.multiplyByFloats(-1 * this.speed, -1 * this.speed, -1 * this.speed));
            }
            if (isDPressed) {
                var alpha = this.dudeMesh.rotation.y;
                alpha += .1;
                this.frontVector = new BABYLON.Vector3(-1 * Math.sin(alpha), 0, -1 * Math.cos(alpha));
            }

            if (isAPressed) {
                var alpha = this.dudeMesh.rotation.y;
                alpha -= .1;
                this.frontVector = new BABYLON.Vector3(-1 * Math.sin(alpha), 0, -1 * Math.cos(alpha));
            }

            scene.freeCameraDude.position.x = this.bounder.position.x;
            scene.freeCameraDude.position.z = this.bounder.position.z;
            scene.freeCameraDude.position.y = groundHeight + this.scaling * Dude.boundingBoxParameters.lengthY + .2;
            scene.freeCameraDude.setTarget(scene.freeCameraDude.position.add(this.frontVector));
        }
        else if (scene.activeCamera == scene.freeCameraDude) {
            var groundHeight = this.adjustYPosition();
            this.adjustXZPosition();
            scene.freeCameraDude.position.y = groundHeight + this.scaling * Dude.boundingBoxParameters.lengthY + .2;
            var cameraFront = scene.freeCameraDude.getTarget().subtract(scene.freeCameraDude.position).normalize();
            this.frontVector = cameraFront;
            var dir = this.frontVector;
            var alpha = Math.atan2(-1 * dir.x, -1 * dir.z);
            this.dudeMesh.rotation.y = alpha;

            console.log(this.frontVector);
            this.bounder.position.x = scene.freeCameraDude.position.x - this.frontVector.x * 1.8 ;
            this.bounder.position.z = scene.freeCameraDude.position.z - this.frontVector.z * 1.8;

        }

    }

    fireGun()
    {
        var scene = this.scene;
        scene.assets["gunSound"].play();
        var width = scene.getEngine().getRenderWidth();
        var height = scene.getEngine().getRenderHeight();
        var pickInfo = scene.pick(width / 4, height / 2, null, false, scene.activeCameras[0]);

            if (pickInfo.pickedMesh) {
                if (pickInfo.pickedMesh.name.startsWith("bounder")) {

                    pickInfo.pickedMesh.dudeMesh.Dude.decreaseHealth(pickInfo.pickedPoint);
                }

                else if (pickInfo.pickedMesh.name.startsWith("clone")) {
                    pickInfo.pickedMesh.parent.Dude.decreaseHealth(pickInfo.pickedPoint);

                }
            }
        

    }
    adjustYPosition() {
        var scene = this.scene;
        var origin = new BABYLON.Vector3(this.dudeMesh.position.x, 1000, this.dudeMesh.position.z);
        var direction = new BABYLON.Vector3(0, -1, 0);
        var ray = new BABYLON.Ray(origin, direction, 10000);
        var pickInfo = scene.pickWithRay(ray, function (mesh) {
            if (mesh.name == "ground") return true;
            return false;
        });

        if (!pickInfo.pickedPoint) return 0;
        var groundHeight = pickInfo.pickedPoint.y;
        this.dudeMesh.position.y = groundHeight;
        this.bounder.position.y = groundHeight + this.scaling * Dude.boundingBoxParameters.lengthY / 2.0;

        return groundHeight;
    }

    adjustXZPosition() {
        this.dudeMesh.position.x = this.bounder.position.x;
        this.dudeMesh.position.z = this.bounder.position.z;
    }

    createBoundingBox() {
        var scene = this.scene;
        var lengthX = Dude.boundingBoxParameters.lengthX;
        var lengthY = Dude.boundingBoxParameters.lengthY;
        var lengthZ = Dude.boundingBoxParameters.lengthZ;
        new BABYLON.Quaternion
        var bounder = new BABYLON.Mesh.CreateBox("bounder" + (this.id).toString(), 1, this.scene);

        bounder.scaling.x = lengthX * this.scaling;
        bounder.scaling.y = lengthY * this.scaling;
        bounder.scaling.z = lengthZ * this.scaling * 2;

        bounder.isVisible = false;

        var bounderMaterial = new BABYLON.StandardMaterial("bounderMaterial", this.scene);
        bounderMaterial.alpha = .5;
        bounder.material = bounderMaterial;
        bounder.checkCollisions = true;


        bounder.position = new BABYLON.Vector3(this.dudeMesh.position.x, this.dudeMesh.position.y
             + this.scaling * lengthY / 2, this.dudeMesh.position.z);


        return bounder;
    }
    CalculateBoundingBoxParameters() {
        var minX = 999999; var minY = 99999; var minZ = 999999;
        var maxX = -99999; var maxY = -999999; var maxZ = -99999;

        var children = this.dudeMesh.getChildren();

        for (var i = 0 ; i < children.length ; i++) {
            var positions = new BABYLON.VertexData.ExtractFromGeometry(children[i]).positions;
            if (!positions) continue;

            var index = 0;
            for (var j = index ; j < positions.length ; j += 3) {
                if (positions[j] < minX)
                    minX = positions[j];
                if (positions[j] > maxX)
                    maxX = positions[j];
            }
            index = 1;
            for (var j = index ; j < positions.length ; j += 3) {
                if (positions[j] < minY)
                    minY = positions[j];
                if (positions[j] > maxY)
                    maxY = positions[j];
            }
            index = 2;
            for (var j = index ; j < positions.length ; j += 3) {
                if (positions[j] < minZ)
                    minZ = positions[j];
                if (positions[j] > maxZ)
                    maxZ = positions[j];
            }

            var _lengthX = maxX - minX;
            var _lengthY = maxY - minY;
            var _lengthZ = maxZ - minZ;

        }


        return { lengthX: _lengthX, lengthY: _lengthY, lengthZ: _lengthZ };
    }


    // this below functions is used to create bullet for dude
    // the shape of the bullet, the animation, and more

    createDudeParticleSystem() {
        var scene = this.scene;
        // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("/static/images/flare.png", scene);

        // Where the particles come from
        particleSystem.emitter = new BABYLON.Vector3(0, 0, 0); // the starting object, the emitter


        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(1, 0, 0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

        particleSystem.emitRate = 100;


        // Set the gravity of all particles
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new BABYLON.Vector3(0, -1, 0);
        particleSystem.direction2 = new BABYLON.Vector3(0, -1, 0);

        particleSystem.minEmitPower = 6;
        particleSystem.maxEmitPower = 10;
        return particleSystem;
    }

    decreaseHealth(hitPoint) {
        Dude.particleSystem.emitter = hitPoint;
        this.health--;
        Dude.particleSystem.start();
        setTimeout(function () {
            Dude.particleSystem.stop();
        }, 300);
        if (this.health <= 0) {
            this.gotKilled();
        }

    }

    gotKilled() {
        var scene = this.scene;
        scene.assets["dieSound"].play();

        Dude.particleSystem.emitter = this.bounder.position;
        console.log(this.bounder);
        Dude.particleSystem.emitRate = 2000;

        Dude.particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, -1);
        Dude.particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 1);

        // Direction of each particle after it has been emitted
        Dude.particleSystem.direction1 = new BABYLON.Vector3(0, 1, 0);
        Dude.particleSystem.direction2 = new BABYLON.Vector3(0, -1, 0);

        Dude.particleSystem.start();
        setTimeout(function () {
            Dude.particleSystem.stop();
        }, 300);

        this.bounder.dispose();
        this.dudeMesh.dispose();
    }

}

export { Dude };
