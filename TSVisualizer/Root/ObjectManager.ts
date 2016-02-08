/// <reference path="../Root/Includes.ts" />

class ObjectManager {
    // Properties
    root: IRoot;
    objects: Object;

    // Construct / Destruct
    constructor(newRoot: IRoot) {
        this.root = newRoot;
        this.objects = {};
    }

    // Methods
    update() {
        for (var i in this.objects) {
            (<SimObject>this.objects[i]).update();
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

    updateFromSource(toUpdate: ISourceObject[]) {
        var tu: ISourceObject;
        for (var i = 0; i < toUpdate.length; i++) {
            tu = toUpdate[i];
            if (this.objects[i] == undefined) {
                this.add(new BasicSphere(this.root, tu.id));
            }
            (<SimObject>this.objects[tu.id]).updateFromSource(tu);
        }
    }
}