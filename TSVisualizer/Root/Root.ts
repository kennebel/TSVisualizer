﻿/// <reference path="Includes.ts" />

interface IRootOptions {
    container?: string;
    debugContainer?: string;

    fov?: number;
    camPosition?: THREE.Vector3;
    camIsPerspective?: boolean;

    lockX?: boolean;
    lockY?: boolean;
    lockZ?: boolean;
}

class Root implements IRoot {
    /// Properties
    container: HTMLElement;
    debugContainer: HTMLElement;

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;

    options: IRootOptions;

    canvasWidth: number;
    canvasHeight: number;

    objMgr: ObjectManager;
    inpMgr: InputManager;
    keys: string[];

    private camDefaultPos: THREE.Vector3;

    /// Construct / Destruct
    // Used as a base: http://www.johannes-raida.de/tutorials/three.js/tutorial05/tutorial05.htm
    constructor(options?: IRootOptions) {
        this.options = this.setDefaults(options);

        this.container = document.getElementById(this.options.container);
        if (this.options.debugContainer != undefined) {
            this.debugContainer = document.getElementById(this.options.debugContainer);
        }

        this.log("startup");

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); 
        this.renderer.setClearColor(0x000000, 0); 

        this.windowResize();

        this.container.appendChild(this.renderer.domElement); 
 
        this.scene = new THREE.Scene(); 

        this.camDefaultPos = this.options.camPosition;
        this.camera = new THREE.PerspectiveCamera(this.options.fov, this.canvasWidth / this.canvasHeight, 1, 100);
        this.resetCamera();
        this.scene.add(this.camera); 

        this.objMgr = new ObjectManager(this);

        this.keys = new Array();
        this.inpMgr = new InputManager(this);
    }

    private setDefaults(options: IRootOptions): IRootOptions {
        if (options == undefined) {
            options = {};
        }

        if (options.container == undefined || options.container.trim() == "") { options.container = "WebGLCanvas"; }
        if (options.fov == undefined) { options.fov = 45; }
        if (options.camPosition == undefined) { options.camPosition = new THREE.Vector3(0, 10, 0); }
        if (options.camIsPerspective == undefined) { options.camIsPerspective = true; }

        if (options.lockX == undefined) { options.lockX = false; }
        if (options.lockY == undefined) { options.lockY = false; }
        if (options.lockZ == undefined) { options.lockZ = false; }

        return options;
    }

    destructor() {
        
    }

    /// Methods
    log(message: string) {
        if (this.debugContainer != undefined) {
            this.debugContainer.innerText = message;
        }
    }

    windowResize() {
        this.canvasWidth = this.container.offsetWidth;
        this.canvasHeight = this.container.offsetHeight;

        // Used instead when you just want full screen
        //this.canvasWidth = window.innerWidth;
        //this.canvasHeight = window.innerHeight; 

        this.renderer.setSize(this.canvasWidth, this.canvasHeight); 

        if (this.camera != null) {
            this.camera.aspect = this.canvasWidth / this.canvasHeight;
            this.camera.updateProjectionMatrix();
        }
    }

    animateScene() {
        this.objMgr.update();
        this.update();

        this.renderScene();
    }

    private renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    keyActive(checkFor: string): boolean {
        if (this.keys.indexOf(checkFor) > -1) {
            return true;
        }
        return false;
    }

    keyDown(pressed: string): void {
        switch (pressed) {
            case "r":
                this.resetCamera();
                break;
        }
    }

    keyUp(pressed: string): void {
    }

    addSimObject(toAdd: SimObject): void {
        this.objMgr.add(toAdd);
        this.scene.add(toAdd.mesh);
    }

    removeSimObject(toRemove: SimObject): void {
        this.objMgr.remove(toRemove);
        this.scene.remove(toRemove.mesh);
    }

    resetCamera(): void {
        this.camera.position.set(this.camDefaultPos.x, this.camDefaultPos.y, this.camDefaultPos.z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    private update() {
        var step: number = 0.1;
        if (this.keyActive("shift")) {
            step = 1;
        }

        if (!this.options.lockX) {
            if (this.keyActive("left")) {
                this.camera.position.x -= step;;
            }
            else if (this.keyActive("right")) {
                this.camera.position.x += step;
            }
        }
        if (!this.options.lockZ) {
            if (this.keyActive("up")) {
                this.camera.position.z -= step;
            }
            else if (this.keyActive("down")) {
                this.camera.position.z += step;
            }
        }
    }
}