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

    updateFromSource(update: ISourceObject) {
        this.updatePosition(update.position);
        if (this.mesh.scale.x != update.scale) { this.updateScale(update.scale); }
    }

    updatePosition(newPos: number[]) {
        this.mesh.position.set(newPos[0], newPos[1], newPos[2]);
    }

    updateScale(newScale: number) {
        this.mesh.scale.set(newScale, newScale, newScale);
    }
}