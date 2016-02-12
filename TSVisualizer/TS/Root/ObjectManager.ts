/// <reference path="../Root/Includes.ts" />

class ObjectManager {
    // Properties
    root: IRoot;
    objects: Object;
    selected: number;

    // Construct / Destruct
    constructor(newRoot: IRoot) {
        this.root = newRoot;
        this.objects = {};
        this.selected = 0;
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
            if (this.objects[tu.id] == undefined) {
                this.add(new BasicSphere(this.root, tu.id, tu.name));
            }
            (<SimObject>this.objects[tu.id]).updateFromSource(tu);
        }
    }

    select(toSelect: number) {
        if (toSelect != this.selected) {
            if (this.selected != 0 && this.objects[this.selected] != undefined) {
                (<SimObject>this.objects[this.selected]).unselect();
            }
            this.selected = toSelect;
            if (this.selected != 0) {
                (<SimObject>this.objects[this.selected]).select();
            }
            else {
                this.root.log("");
            }
        }
    }
}