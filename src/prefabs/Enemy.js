class Enemy extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5, 1);
        this.body.allowGravity = false;
        this.body.setSize(48, 48, 16, 0);
        this.body.setVelocity(-100, 0).setBounce(1).setCollideWorldBounds(true);
        
        const enterPlatePlayer = (_this, _player) => {
            _player.scene.scene.restart();    // restart current scene
        };

        scene.physics.add.overlap(
            this, 
            scene.player,
            enterPlatePlayer,
            null,
            this
        );

        this.createAnims();
        this.anims.play("walk");

    }

    update(){
        if (this.body.velocity["x"] < 0){
            this.flipX = true; 
        } else {
            this.flipX = false;

        }
    }

    createAnims(){
        // Setup Walk Animation
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('enemy', { prefix: 'walk', start: 1, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
    }
}