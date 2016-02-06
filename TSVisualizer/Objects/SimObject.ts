/// <reference path="../Root/Includes.ts" />

class SimObject {
    // Properties
    root: IRoot;
    mesh: THREE.Mesh;

    id: number;

    // Constuct / Destruct
    constructor(newRoot: IRoot) {
        this.root = newRoot;
    }

    // Methods
    update() {
    }

    addMe() {
        this.root.addSimObject(this);
    }

    removeMe() {
        this.root.removeSimObject(this);
    }
}