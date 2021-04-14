// Player Prefab

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add obejct to the existing scene
        scene.add.existing(this);
        this.isFiring = false;      // Track rocket firing status
        this.moveSpeed = 2;
    }
}