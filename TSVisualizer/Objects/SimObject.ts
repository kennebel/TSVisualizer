/// <reference path="../Root/Includes.ts" />

class SimObject {
    // Properties
    root: IRoot;
    mesh: THREE.Mesh;
    selected: THREE.BoxHelper;

    id: number;
    name: string;

    // Constuct / Destruct
    constructor(newRoot: IRoot, newId: number, newName: string) {
        this.root = newRoot;
        this.id = newId;
        this.name = newName;
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
        if (this.selected != undefined) {
            this.selected.update(this.mesh);
        }
    }

    updateScale(newScale: number) {
        this.mesh.scale.set(newScale, newScale, newScale);
        if (this.selected != undefined) {
            this.selected.update(this.mesh);
        }
    }

    select() {
        if (this.selected == undefined) {
            this.selected = new THREE.BoxHelper(this.mesh);
            this.root.addTemp(this.selected);
        }
    }

    unselect() {
        if (this.selected != undefined) {
            this.root.removeTemp(this.selected);
            this.selected = undefined;
        }
    }
}