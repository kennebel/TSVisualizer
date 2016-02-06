/// <reference path="../Root/Includes.ts" />

class ObjectManager {
    // Properties
    root: IRoot;
    objects: {};

    // Construct / Destruct
    constructor(newRoot: IRoot) {
        this.root = newRoot;

        this.objects = new Array();
    }

    // Methods
    update() {
        for (var i in this.objects) {
            (<SimObject>i).update();
        }
    }

    add(toAdd: SimObject): void {
        this.objects[toAdd.id] = toAdd;
    }

    remove(toRemove: SimObject): void {
        if (this.objects[toRemove.id] != undefined) {
            delete this.objects[toRemove.id];
        }
    }
}