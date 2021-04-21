// Clone Prefab

class Clone extends Phaser.GameObjects.Sprite {
    // Variable that stores previous player actions
    actionsList = [];
    
    constructor(scene, x, y, texture, frame, actions){
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

        // Assign actions based on param from Player
        this.actionsList = actions;
    }

    update(){
        this.takeAction();
    }

    // Updates movement the exact same as Player.js does, but reads from 
    // the first elem of actionList instead of keyboard input. 
    takeAction(){
        if (this.actionsList.length == 0){
            //console.log("action list empty. returning.");
            return;
        }
        let action = this.actionsList.shift();
        if (action["moveLeft"])
        {
            this.body.setVelocityX(-200); // move left
            this.anims.play('walk', true); // play walk animation
            this.flipX= true; // flip the sprite to the left
        }
        else if (action["moveRight"])
        {
            this.body.setVelocityX(200); // move right
            this.anims.play('walk', true); // play walk animatio
            this.flipX = false; // use the original sprite looking to the right
        } else {
            this.body.setVelocityX(0);
            this.anims.play('idle', true);
        }  
        if (action["moveJump"]  && this.body.onFloor())
        {
            this.body.setVelocityY(-500); // jump up
        }
    }
}
