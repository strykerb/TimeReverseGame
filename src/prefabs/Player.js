// Player Prefab

class Player extends Phaser.GameObjects.Sprite {
    //TIME_JUMP = 400;
    TIME_JUMP = 200;
    MOVE_SPEED = 300;
    JUMP_HEIGHT = 590;
    ATTATCH_OFFSET = 10;
    curr_scene;
    past_pos;
    cloned = false;
    count = 1;
    jumping = false;
    landing = false;
    falling = false;
    tutorialActive = false;
    
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add obejct to the existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 0);
        
        this.timeAnim = scene.physics.add.sprite(this.x, this.y + this.height/2);
        this.timeAnim.body.allowGravity = false;
        this.timeAnim.scaleX = 0.5;
        this.timeAnim.scaleY = 0.5;
        this.timeAnim.setDepth(-1);
        this.timeAnim.alpha = 0;

        this.createAnims();

        this.jsonObj = [];
        this.jsonObj.push({"count": 1});
        this.curr_scene = scene;
        this.past_pos = {"posX":this.x, "posY":this.y};

        this.attatched = false;
        this.TELEPORT_TIME = 1000;
        this.teleporting = false;
        this.cloned = false;
        this.clone = null;
        this.collidingPlate = null;
        this.body.setSize(32, 64, 16, 0);
        this.line = new Phaser.Geom.Line(x-16, y+64, x+16, y+64);

        this.timeAnim.anims.play('timeAnim');
        this.setupEmitter();
    }

    update(){
        // Update all enemies in the scene
        this.scene.enemies.forEach(enemy => {
            enemy.update();
        });

        this.timeAnim.x = this.x;
        this.timeAnim.y = this.y + this.height/2;

        // Block player input if the tutorial is active
        if (this.tutorialActive){
            this.scene.futureSelf.update();
            return;
        }
        
        // Check if player should no longer be attatched to the clone
        let netVelocity = 0;

        // block player input during teleport
        if (this.teleporting){
            return;
        }
        
        if(this.attatched){
            //console.log("check: " + this.y + " < " + (this.clone.y - this.height - this.ATTATCH_OFFSET));
            if (this.x < this.clone.x - this.width/2 || this.x > this.clone.x + this.width/2){
                this.attatched = false;
            }
            if (this.y < this.clone.y - this.height - this.ATTATCH_OFFSET){
                this.attatched = false;
            }
            if(this.attatched){
                netVelocity = this.clone.body.velocity.x;
                this.body.setVelocityY(this.clone.body.velocity.y);
                if (this.y > this.clone.y - this.height){
                    this.y = this.clone.y - this.height;
                }
            }
        }

        if (this.falling){
            if (this.body.onFloor() || this.attatched){
                this.anims.play("land");
                this.falling = false;
                this.landing = true;
            }
        }

        this.falling = !(this.jumping || this.body.onFloor() || this.attatched);
        
        if (keyLEFT.isDown)
        {
            this.body.setVelocityX(netVelocity - this.MOVE_SPEED); // move left
            if (!this.falling && !this.jumping){this.anims.play('run', true);} // play walk animation
            this.flipX= true; // flip the sprite to the left\
            this.landing = false;
        }
        else if (keyRIGHT.isDown)
        {
            this.body.setVelocityX(netVelocity + this.MOVE_SPEED); // move right
            if (!this.falling && !this.jumping){this.anims.play('run', true);} // play walk animation
            this.flipX = false; // use the original sprite looking to the right
            this.landing = false;
        } else {
            this.body.setVelocityX(netVelocity);
            if (!this.falling && !this.jumping && !this.landing){this.anims.play('idle', true);}
        }  
        if (keyUP.isDown && (this.body.onFloor() || this.attatched))
        {
            this.jump();
        }
        if (keySPACE.isDown && this.jsonObj.length >= this.TIME_JUMP-1){
            this.makeClone();
        }

        if (this.falling){
            this.anims.play("fall");
        }

        // Store Position and keyboard input, if a clone doen't currently exist
        if (!this.cloned && !this.teleporting){
            this.addTimeStamp();
        }
        
        // Decide whether clone should expire, and process accordingly
        this.processClone();

        if (this.jsonObj.length >= this.TIME_JUMP-1){
            this.scene.pastEmitter.resume();
            this.scene.pastEmitter.setPosition(this.past_pos["posX"], this.past_pos["posY"]+64);
        } else {
            this.scene.pastEmitter.pause();
            this.scene.pastEmitter.killAll();
        }
    }

    createAnims(){
        // Setup Walk Animation
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('player', { prefix: 'run', start: 1, end: 12 }),
            frameRate: 30,
            //repeat: -1
        });
        // idle with only one frame, so repeat is not neaded
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('player', { prefix: 'idle', start: 1, end: 6 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNames('player', { prefix: 'jump', start: 1, end: 7 }),
            frameRate: 30,
        });
        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNames('player', { prefix: 'fall', start: 1, end: 3 }),
            frameRate: 5,
        });
        this.anims.create({
            key: 'land',
            frames: this.anims.generateFrameNames('player', { prefix: 'land', start: 1, end: 5 }),
            frameRate: 30
        });
        this.timeAnim.anims.create({
            key: 'timeAnim',
            frames: this.anims.generateFrameNames('timeAnim', { prefix: 'sprite', start: 1, end: 51 }),
            frameRate: 30,
            yoyo: true,
            repeat: -1
        });

        this.on('animationcomplete', this.animComplete, this);

    }

    animComplete(animation, frame)
    {
        
        if (animation.key == "jump"){
            this.jumping = false;
            this.falling = true;
            this.anims.play("fall");
        } else if (animation.key == "land"){
            this.landing = false;
            this.anims.play("idle");
        }
    }

    jump(){
        this.anims.play("jump");
        this.jumping = true;
        this.body.setVelocityY(-this.JUMP_HEIGHT); // jump up
        // console.log(this.x, this.y);
    }

    // Appends position and input at the current moment to jsonObj
    addTimeStamp(){
        let item = {};
        item ["posX"] = this.x;
        item ["posY"] = this.y;
        item ["velY"] = this.body.velocity["y"];
        item ["moveLeft"] = keyLEFT.isDown;
        item ["moveRight"] = keyRIGHT.isDown;
        item ["moveJump"] = keyUP.isDown;
        item["animation"] = this.anims.currentAnim.key;
        
        // If we are exceeding the maximum recorded actions, remove the first elem of jsonObj
        if (this.jsonObj.push(item) >= this.TIME_JUMP){
            this.past_pos = this.jsonObj.shift();
            this.timeAnim.alpha = 0.25;
        } else {
            this.past_pos = this.jsonObj[0];
        }
    }

    // Creates a child clone, and passes it the jsonObj
    // Also calls revert on all reversible game objects
    makeClone(){
        console.log(this.body.x, (this.body.y+64));
        this.teleporting = true;
        this.timeAnim.alpha = 0;

        this.scene.ellipse = new Phaser.Geom.Ellipse(this.x, this.y+this.height/2, this.width/2, this.height);

        this.scene.movingEmitter = this.scene.particleManager.createEmitter({
            x: this.x,
            y: this.y+this.height/2,
            moveToX:    {min: this.past_pos["posX"]-this.width/4, max: this.past_pos["posX"]+this.width/4},
            moveToY:    {min: this.past_pos["posY"], max: this.past_pos["posY"]+ this.height},
            speed: 50,
            scale: { start: 0.1, end: 1 },
            alpha: { start: 0.5, end: 1 },
            // higher steps value = more time to go btwn min/max
            lifespan: { min: 2000, max: 7000, steps: 1000 },
            blendMode: 'ADD',
            emitZone: {
                type: 'edge',
                source: this.scene.ellipse
            },
        });
        
        this.setVisible(false);
        this.body.enable = false;
        
        // Disable Input
        //this.scene.input.keyboard.enabled = false;
        
        // Play teleport sound
        this.scene.teleportSound.play();

        const cam = this.scene.cameras.main;
        cam.pan(this.past_pos["posX"], this.past_pos["posY"], this.TELEPORT_TIME, Phaser.Math.Easing.Quadratic.InOut);

        if (this.scene.doors){
            this.scene.doors.forEach(door => {
                door.revert();
            });
        }

        if (this.scene.enemies){
            this.scene.enemies.forEach(enemy => {
                enemy.revert();
            });
        }

        this.clock = this.scene.time.delayedCall(this.TELEPORT_TIME, () => {
            this.teleporting = false;
            this.cloned = true;
            this.setVisible(true);
            this.body.enable = true;
            this.scene.movingEmitter.pause();
            this.scene.movingEmitter.killAll()

            // Move Player
            this.x = this.past_pos["posX"];
            this.y = this.past_pos["posY"];
            this.body.setVelocityY(this.jsonObj[0]["velY"]);

            // Spawn clone instance
            //this.clone = new Clone(this.curr_scene, this.past_pos["posX"], this.past_pos["posY"], 'player', 0, this.jsonObj);
            this.clone = new Clone(this.scene, this.x, this.y, 'player', 0, this.jsonObj);
            this.clone.body.setCollideWorldBounds(true); // don't go out of the map
            this.curr_scene.physics.add.collider(groundLayer, this.clone);
            this.clone.body.setVelocityY(this.jsonObj[0]["velY"]);
            if (this.scene.doors){
                this.scene.doors.forEach(door => {
                    this.scene.physics.add.collider(door, this.clone);
                });
            }

            //this.scene.input.keyboard.enabled = true;

            // Reset action list
            this.jsonObj = [];
            this.past_pos = [];
            
        }, null, this);

    }

    setupEmitter(){
        // create line for particle emitter source
        
        this.scene.pastEmitter = this.scene.particleManager.createEmitter({
            x: this.x,
            y: this.y + 64,
            gravityY: -100,
            lifespan: { min: 500, max: 1000, steps: 1000 },
            scale: { start: 1, end: 0.1 },
            tint: [ 0x00ffff, 0x0000ff ],
            angle: { min: 0, max: 360 },
            // emitZone: { type: 'random', source: this.line, quantity: 100 }
        });
        
    }

    // Decide whether clone has expired or not
    processClone(){
        if (this.cloned){
            this.count++;
            if (this.count >= this.TIME_JUMP){
                this.scene.physics.world.removeCollider(this.clone.playerCollider);
                this.clone.destroy();
                this.clone = null;
                this.attatched = false;
                this.cloned = false;
                this.count = 1;
                return;
            }
            this.clone.update();
        }
    }

    attatchToClone(clone){
        this.attatched = true;
    }

    startTutorial(){
        this.tutorialActive = true;
        this.body.setVelocityX(0);
        this.anims.play('idle');
    }

    endTutorial(){
        this.tutorialActive = false;
    }
}