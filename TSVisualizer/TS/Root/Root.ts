/// <reference path="Includes.ts" />

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
    raycaster: THREE.Raycaster;

    options: IRootOptions;

    canvasWidth: number;
    canvasHeight: number;
    mousePos: THREE.Vector2;

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

        this.renderer = new THREE.WebGLRenderer({ antialias: true }); 
        this.renderer.setClearColor(0x000000, 1);
        this.raycaster = new THREE.Raycaster();

        this.mousePos = new THREE.Vector2();

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

        this.updateFromSource();
        //var tb: TestBox = new TestBox(this, 2, "test");
    }

    private setDefaults(options: IRootOptions): IRootOptions {
        if (options == undefined) {
            options = {};
        }

        if (options.container == undefined || options.container.trim() == "") { options.container = "WebGLCanvas"; }
        if (options.fov == undefined) { options.fov = 45; }
        if (options.camPosition == undefined) { options.camPosition = new THREE.Vector3(0, 40, 0.1); }
        if (options.camIsPerspective == undefined) { options.camIsPerspective = true; }

        if (options.lockX == undefined) { options.lockX = false; }
        if (options.lockY == undefined) { options.lockY = false; }
        if (options.lockZ == undefined) { options.lockZ = false; }

        return options;
    }

    destructor() {
        
    }

    /// Events
    windowResize() {
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight; 

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

    mouseDown(event: MouseEvent): void {
        this.mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mousePos.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mousePos, this.camera);

        var intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            this.objMgr.select(parseInt(intersects[0].object.name));
        }
        else {
            this.objMgr.select(0); // Clear selection
        }
    }

    mouseUp(event: MouseEvent): void {
    }

    mouseWheel(event: MouseWheelEvent): void {
        this.log(String(event.wheelDelta));
    }

    updateFromSource() {
        $.getJSON("http://localhost/source.php", result => { this.objMgr.updateFromSource(result); });
    }

    /// Methods
    log(message: string) {
        if (this.debugContainer != undefined) {
            this.debugContainer.innerText = message;
        }
        else {
            console.log(message);
        }
    }

    addSimObject(toAdd: SimObject): void {
        this.objMgr.add(toAdd);
        this.scene.add(toAdd.mesh);
        //this.log("please add: " + toAdd.name);
    }

    removeSimObject(toRemove: SimObject): void {
        this.objMgr.remove(toRemove);
        this.scene.remove(toRemove.mesh);
    }

    addTemp(toAdd: THREE.Object3D): void {
        this.scene.add(toAdd);
    }

    removeTemp(toRemove: THREE.Object3D): void {
        this.scene.remove(toRemove);
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

        //this.log("COunt: " + this.scene.children.length);
    }
}
