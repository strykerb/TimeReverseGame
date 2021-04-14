// Player Prefab

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add obejct to the existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Setup Walk Animation
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', { prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });
        // idle with only one frame, so repeat is not neaded
        this.anims.create({
            key: 'idle',
            frames: [{key: 'player', frame: 'p1_stand'}],
            frameRate: 10,
        });
    }

    update(){
        if (cursors.left.isDown)
        {
            this.body.setVelocityX(-200); // move left
            this.anims.play('walk', true); // play walk animation
            this.flipX= true; // flip the sprite to the left
        }
        else if (cursors.right.isDown)
        {
            this.body.setVelocityX(200); // move right
            this.anims.play('walk', true); // play walk animatio
            this.flipX = false; // use the original sprite looking to the right
        } else {
            this.body.setVelocityX(0);
            this.anims.play('idle', true);
        }  
        if ((cursors.space.isDown || cursors.up.isDown) && this.body.onFloor())
        {
            this.body.setVelocityY(-500); // jump up
        }
    }
}