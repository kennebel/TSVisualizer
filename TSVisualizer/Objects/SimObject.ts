/// <reference path="../Root/Includes.ts" />

class SimObject {
    // Properties
    root: IRoot;
    mesh: THREE.Mesh;

    id: number;

    // Constuct / Destruct
    constructor(newRoot: IRoot, newId: number) {
        this.root = newRoot;
        this.id = newId;
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