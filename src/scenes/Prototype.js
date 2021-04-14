// Protype Scene for testing feasibility of the project

class Prototype extends Phaser.Scene {
    
    constructor() {
        super("prototypeScene");
    }

    preload() {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', '../../assets/map.json');
        // tiles in spritesheet 
        this.load.spritesheet('tiles', '../../assets/tiles.png', {frameWidth: 70, frameHeight: 70});
        // simple coin image
        this.load.image('coin', '../../assets/coinGold.png');
        // player animations
        this.load.atlas('player', '../../assets/player.png', 'assets/player.json');
    }
     
    create() {
        
        // load the map 
        map = this.make.tilemap({key: 'map'});
        
        // tiles for the ground layer
        var groundTiles = map.addTilesetImage('tiles');
        // create the ground layer
        groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
        // the player will collide with this layer
        groundLayer.setCollisionByExclusion([-1]);
     
        // set the boundaries of our game world
        this.physics.world.bounds.width = groundLayer.width;
        this.physics.world.bounds.height = groundLayer.height;

        // create the player sprite    
        player = this.physics.add.sprite(200, 200, 'player'); 
        //player.setBounce(0.2); // our player will bounce from items
        player.setCollideWorldBounds(true); // don't go out of the map
        	
        // Add collision with the ground
        this.physics.add.collider(groundLayer, player);

        // Adding keyboard input
        cursors = this.input.keyboard.createCursorKeys();

        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(player);
        
        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#ccccff'); 

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
     
    update() {
        if (cursors.left.isDown)
        {
            player.body.setVelocityX(-200); // move left
            player.anims.play('walk', true); // play walk animation
            player.flipX= true; // flip the sprite to the left
        }
        else if (cursors.right.isDown)
        {
            player.body.setVelocityX(200); // move right
            player.anims.play('walk', true); // play walk animatio
            player.flipX = false; // use the original sprite looking to the right
        } else {
            player.body.setVelocityX(0);
            player.anims.play('idle', true);
        }  
        if ((cursors.space.isDown || cursors.up.isDown) && player.body.onFloor())
        {
            player.body.setVelocityY(-500); // jump up
    }
    }

}