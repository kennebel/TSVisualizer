interface IRoot {
    // Properties
    keys: string[];

    // Event Handlers
    keyActive(checkFor: string): boolean;
    keyDown(pressed: string): void;
    keyUp(pressed: string): void;

    // Methods
    addSimObject(toAdd: SimObject): void;
    removeSimObject(toRemove: SimObject): void;
    addTemp(toAdd: THREE.Object3D): void;
    removeTemp(toREmove: THREE.Object3D): void;
}
