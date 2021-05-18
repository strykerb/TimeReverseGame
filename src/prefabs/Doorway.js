class Doorway extends Phaser.GameObjects.Sprite {
    
    MOVE_VECTOR_Y = 0;
    OPEN_SPEED = 0.2;
    ORIGINAL_POS_Y = 0;

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add obejct to the existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setImmovable(true);
        this.setOrigin(0.5, 0);
        this.body.allowGravity = false;
        
        scene.physics.add.collider(this, scene.player);
        scene.physics.add.collider(this, scene.player.clone);

        this.MOVE_VECTOR_Y = this.height;
        this.ORIGINAL_POS_Y = y;
        this.isOpen = false;
    }


    open (delta) {
        if (this.y >= this.ORIGINAL_POS_Y + this.MOVE_VECTOR_Y){
            return;
        } else {
            this.y += Math.round(this.OPEN_SPEED * delta);
        }
    }

    close(delta){
        if (this.y <= this.ORIGINAL_POS_Y){
            return;
        } else {
            this.y -=  Math.round(this.OPEN_SPEED * delta);
        }
        
    }

    update(){
        
    }
    
}