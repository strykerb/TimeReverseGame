// Player Prefab

class Player extends Phaser.GameObjects.Sprite {
    TIME_JUMP = 1000;
    curr_scene;
    past_pos;
    cloned = false;
    count = 1;
    
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
        this.jsonObj = [];
        this.jsonObj.push({"count": 1});
        this.curr_scene = scene;
        this.past_pos = {"posX":this.x, "posY":this.y};
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
        if (cursors.down.isDown && this.jsonObj.length >= 499){
            this.makeClone();
        }

        // Store Position and keyboard input, if a clone doen't currently exist
        if (!this.cloned){
            this.addTimeStamp();
        }
        
        // Decide whether clone should expire, and process accordingly
        this.processClone();
    }

    // Appends position and input at the current moment to jsonObj
    addTimeStamp(){
        let item = {};
        item ["posX"] = this.x;
        item ["posY"] = this.y;
        item ["moveLeft"] = cursors.left.isDown;
        item ["moveRight"] = cursors.right.isDown;
        item ["moveJump"] = cursors.space.isDown || cursors.up.isDown;
        
        // If we are exceeding the maximum recorded actions, remove the first elem of jsonObj
        if (this.jsonObj.push(item) >= this.TIME_JUMP){
            this.past_pos = this.jsonObj.shift();
        }
    }

    // Creates a child clone, and passes it the jsonObj
    makeClone(){
        this.cloned = true;
        this.x = this.past_pos["posX"];
        this.y = this.past_pos["posY"] - this.height;
        this.clone = new Clone(this.curr_scene, this.past_pos["posX"], this.past_pos["posY"], 'player', 0, this.jsonObj);
        this.clone.body.setCollideWorldBounds(true); // don't go out of the map
        	
        // Add collision with the ground
        this.curr_scene.physics.add.collider(groundLayer, this.clone);
        this.jsonObj = [];

    }

    // Decide whether clone has expired or not
    processClone(){
        if (this.cloned){
            this.count++;
            if (this.count >= this.TIME_JUMP){
                this.clone.destroy();
                this.cloned = false;
                this.count = 1;
                return;
            }
            this.clone.update();
        }
    }
}