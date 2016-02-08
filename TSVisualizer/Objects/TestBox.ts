/// <reference path="../Root/Includes.ts" />

class TestBox extends SimObject {
    constructor(root: IRoot, newId: number) {
        super(root, newId);

        var boxGeometry = new THREE.BoxGeometry(5, 5, 5);
        var boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF88 });

        this.mesh = new THREE.Mesh(boxGeometry, boxMaterial);
        this.addMe();
    }

    update() {
        super.update();

        var pos: THREE.Vector3 = this.mesh.position;
        this.mesh.position.set(pos.x + 0.01, pos.y, pos.z);
    }
}
