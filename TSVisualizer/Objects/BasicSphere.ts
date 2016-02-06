/// <reference path="../Root/Includes.ts" />

class BasicSphere extends SimObject {
    constructor(root: IRoot) {
        super(root);

        var sphereGeometry = new THREE.SphereGeometry(1, 10, 10);
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0088FF });

        this.mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.addMe();
    }
}
