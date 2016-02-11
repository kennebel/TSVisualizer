/// <reference path="Includes.ts" />
var InputManager = (function () {
    function InputManager(newRoot) {
        this.root = newRoot;
    }
    // Event Handlers
    InputManager.prototype.keyPressed = function (event) {
        //console.log(" Pressed: " + event.which);
        var key = this.keyConvert(event);
        if (this.root.keys.indexOf(key) == -1) {
            this.root.keys.push(key);
            this.root.keyDown(key);
        }
    };
    InputManager.prototype.keyReleased = function (event) {
        //console.log("Released: " + event.which);
        var key = this.keyConvert(event);
        var index = this.root.keys.indexOf(key);
        if (index != -1) {
            this.root.keys.splice(index, 1);
            this.root.keyUp(key);
        }
    };
    InputManager.prototype.keyConvert = function (event) {
        switch (event.which) {
            case 16:
                return "shift";
                break;
            case 17:
                return "control";
                break;
            case 18:
                return "alt";
                break;
            case 37:
                return "left";
                break;
            case 38:
                return "up";
                break;
            case 39:
                return "right";
                break;
            case 40:
                return "down";
                break;
            case 82:
                return "r";
                break;
        }
        return "";
    };
    return InputManager;
})();
/// <reference path="../Root/Includes.ts" />
var ObjectManager = (function () {
    // Construct / Destruct
    function ObjectManager(newRoot) {
        this.root = newRoot;
        this.objects = {};
        this.selected = 0;
    }
    // Methods
    ObjectManager.prototype.update = function () {
        for (var i in this.objects) {
            this.objects[i].update();
        }
    };
    ObjectManager.prototype.add = function (toAdd) {
        this.objects[toAdd.id] = toAdd;
    };
    ObjectManager.prototype.remove = function (toRemove) {
        if (this.objects[toRemove.id] != undefined) {
            delete this.objects[toRemove.id];
        }
    };
    ObjectManager.prototype.updateFromSource = function (toUpdate) {
        var tu;
        for (var i = 0; i < toUpdate.length; i++) {
            tu = toUpdate[i];
            if (this.objects[tu.id] == undefined) {
                this.add(new BasicSphere(this.root, tu.id, tu.name));
            }
            this.objects[tu.id].updateFromSource(tu);
        }
    };
    ObjectManager.prototype.select = function (toSelect) {
        if (toSelect != this.selected) {
            if (this.selected != 0 && this.objects[this.selected] != undefined) {
                this.objects[this.selected].unselect();
            }
            this.selected = toSelect;
            if (this.selected != 0) {
                this.objects[this.selected].select();
            }
            else {
                this.root.log("");
            }
        }
    };
    return ObjectManager;
})();
/// <reference path="../Root/Includes.ts" />
var SimObject = (function () {
    // Constuct / Destruct
    function SimObject(newRoot, newId, newName) {
        this.root = newRoot;
        this.id = newId;
        this.name = newName;
    }
    // Methods
    SimObject.prototype.update = function () {
    };
    SimObject.prototype.addMe = function () {
        this.root.addSimObject(this);
    };
    SimObject.prototype.removeMe = function () {
        this.root.removeSimObject(this);
    };
    SimObject.prototype.updateFromSource = function (update) {
        this.updatePosition(update.position);
        if (this.mesh.scale.x != update.scale) {
            this.updateScale(update.scale);
        }
    };
    SimObject.prototype.updatePosition = function (newPos) {
        this.mesh.position.set(newPos[0], newPos[1], newPos[2]);
        if (this.selected != undefined) {
            this.selected.update(this.mesh);
        }
    };
    SimObject.prototype.updateScale = function (newScale) {
        this.mesh.scale.set(newScale, newScale, newScale);
        if (this.selected != undefined) {
            this.selected.update(this.mesh);
        }
    };
    SimObject.prototype.select = function () {
        if (this.selected == undefined) {
            this.selected = new THREE.BoxHelper(this.mesh);
            this.root.addTemp(this.selected);
            this.root.log("Selected: " + this.name);
        }
    };
    SimObject.prototype.unselect = function () {
        if (this.selected != undefined) {
            this.root.removeTemp(this.selected);
            this.selected = undefined;
        }
    };
    return SimObject;
})();
/// <reference path="../Root/Includes.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BasicSphere = (function (_super) {
    __extends(BasicSphere, _super);
    function BasicSphere(root, newId, newName) {
        _super.call(this, root, newId, newName);
        var sphereGeometry = new THREE.SphereGeometry(1, 15, 15);
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0088FF });
        this.mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.mesh.name = String(newId);
        this.addMe();
    }
    return BasicSphere;
})(SimObject);
/// <reference path="../Root/Includes.ts" />
var TestBox = (function (_super) {
    __extends(TestBox, _super);
    function TestBox(root, newId, newName) {
        _super.call(this, root, newId, newName);
        var boxGeometry = new THREE.BoxGeometry(5, 5, 5);
        var boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF88 });
        this.mesh = new THREE.Mesh(boxGeometry, boxMaterial);
        this.addMe();
    }
    TestBox.prototype.update = function () {
        _super.prototype.update.call(this);
        var pos = this.mesh.position;
        this.mesh.position.set(pos.x + 0.01, pos.y, pos.z);
    };
    return TestBox;
})(SimObject);
/// <reference path="../DefinitelyTyped/three.d.ts" />
/// <reference path="../DefinitelyTyped/tween.js.d.ts" />
/// <reference path="../DefinitelyTyped/jquery.d.ts" />
/// <reference path="../Root/IRoot.ts" />
/// <reference path="../Root/Root.ts" />
/// <reference path="../Root/InputManager.ts" />
/// <reference path="../Root/ObjectManager.ts" />
/// <reference path="../Objects/SimObject.ts" />
/// <reference path="../Objects/ISourceObject.ts" />
/// <reference path="../Objects/BasicSphere.ts" />
/// <reference path="../Objects/TestBox.ts" />
/// <reference path="Includes.ts" />
var Root = (function () {
    /// Construct / Destruct
    // Used as a base: http://www.johannes-raida.de/tutorials/three.js/tutorial05/tutorial05.htm
    function Root(options) {
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
    Root.prototype.setDefaults = function (options) {
        if (options == undefined) {
            options = {};
        }
        if (options.container == undefined || options.container.trim() == "") {
            options.container = "WebGLCanvas";
        }
        if (options.fov == undefined) {
            options.fov = 45;
        }
        if (options.camPosition == undefined) {
            options.camPosition = new THREE.Vector3(0, 40, 0.1);
        }
        if (options.camIsPerspective == undefined) {
            options.camIsPerspective = true;
        }
        if (options.lockX == undefined) {
            options.lockX = false;
        }
        if (options.lockY == undefined) {
            options.lockY = false;
        }
        if (options.lockZ == undefined) {
            options.lockZ = false;
        }
        return options;
    };
    Root.prototype.destructor = function () {
    };
    /// Events
    Root.prototype.windowResize = function () {
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        if (this.camera != null) {
            this.camera.aspect = this.canvasWidth / this.canvasHeight;
            this.camera.updateProjectionMatrix();
        }
    };
    Root.prototype.animateScene = function () {
        this.objMgr.update();
        this.update();
        this.renderScene();
    };
    Root.prototype.renderScene = function () {
        this.renderer.render(this.scene, this.camera);
    };
    Root.prototype.keyActive = function (checkFor) {
        if (this.keys.indexOf(checkFor) > -1) {
            return true;
        }
        return false;
    };
    Root.prototype.keyDown = function (pressed) {
        switch (pressed) {
            case "r":
                this.resetCamera();
                break;
        }
    };
    Root.prototype.keyUp = function (pressed) {
    };
    Root.prototype.mouseDown = function (event) {
        this.mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mousePos, this.camera);
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            this.objMgr.select(parseInt(intersects[0].object.name));
        }
        else {
            this.objMgr.select(0); // Clear selection
        }
    };
    Root.prototype.mouseUp = function (event) {
    };
    Root.prototype.mouseWheel = function (event) {
        this.log(String(event.wheelDelta));
    };
    Root.prototype.updateFromSource = function () {
        var _this = this;
        $.getJSON("http://localhost/source.php", function (result) { _this.objMgr.updateFromSource(result); });
    };
    /// Methods
    Root.prototype.log = function (message) {
        if (this.debugContainer != undefined) {
            this.debugContainer.innerText = message;
        }
        else {
            console.log(message);
        }
    };
    Root.prototype.addSimObject = function (toAdd) {
        this.objMgr.add(toAdd);
        this.scene.add(toAdd.mesh);
        //this.log("please add: " + toAdd.name);
    };
    Root.prototype.removeSimObject = function (toRemove) {
        this.objMgr.remove(toRemove);
        this.scene.remove(toRemove.mesh);
    };
    Root.prototype.addTemp = function (toAdd) {
        this.scene.add(toAdd);
    };
    Root.prototype.removeTemp = function (toRemove) {
        this.scene.remove(toRemove);
    };
    Root.prototype.resetCamera = function () {
        this.camera.position.set(this.camDefaultPos.x, this.camDefaultPos.y, this.camDefaultPos.z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    };
    Root.prototype.update = function () {
        var step = 0.1;
        if (this.keyActive("shift")) {
            step = 1;
        }
        if (!this.options.lockX) {
            if (this.keyActive("left")) {
                this.camera.position.x -= step;
                ;
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
    };
    return Root;
})();
/// <reference path="Root/Root.ts" />
var root;
var settings = {};
window.onload = function () {
    root = new Root(settings);
    animateScene();
    setInterval(function () { return root.updateFromSource(); }, 500);
};
window.onresize = function (event) {
    root.windowResize();
};
document.addEventListener("keydown", function (event) { root.inpMgr.keyPressed(event); });
document.addEventListener("keyup", function (event) { root.inpMgr.keyReleased(event); });
document.addEventListener("mousedown", function (event) { root.mouseDown(event); });
document.addEventListener("mouseup", function (event) { root.mouseUp(event); });
document.addEventListener("mousewheel", function (event) { console.log(event); root.mouseWheel(event); });
function animateScene() {
    root.animateScene();
    requestAnimationFrame(animateScene);
}
//interface ITriggerEvent<T> {
//    on(handler: { (data?: T): void });
//    off(handler: { (data?: T): void });
//}
///// <see cref="http://stackoverflow.com/a/14657922/2577071">
//class TriggerEvent<T> implements ITriggerEvent<T> {
//    private handlers: { (data?: T): void; }[] = [];
//    public on(handler: { (data?: T): void }) {
//        this.handlers.push(handler);
//    }
//    public off(handler: { (data?: T): void }) {
//        this.handlers = this.handlers.filter(h => h !== handler);
//    }
//    public trigger(data?: T) {
//        this.handlers.slice(0).forEach(h => h(data));
//    }
//} 
//# sourceMappingURL=main.js.map