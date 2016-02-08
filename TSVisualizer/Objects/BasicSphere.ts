/// <reference path="../Root/Includes.ts" />

class BasicSphere extends SimObject {
    constructor(root: IRoot, newId: number, newName: string) {
        super(root, newId, newName);

        var sphereGeometry = new THREE.SphereGeometry(1, 15, 15);
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0088FF });

        this.mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.mesh.name = String(newId);
        this.addMe();
    }
}
