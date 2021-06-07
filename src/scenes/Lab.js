// Protype Scene for testing feasibility of the project

class Lab extends Phaser.Scene {
    
    constructor() {
        super("lab");

        this.LETTER_TIMER = 10;		// # ms each letter takes to "type" onscreen
        this.NEXT_TEXT = '[ENTER]';	// text to display for next prompt
        this.NEXT_X = 2500;			// next text prompt x-position
        this.NEXT_Y = 1200;			// next text prompt y-position
        this.dialogIndex = 0;
        this.prevSpeaker = 1;
        this.dialogueTweenDuration = 500;
    }

    preload() {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('labtilemap', './assets/tiles/Lab.json');
        // tiles in spritesheet 
        this.load.image('cyberpunk-corridor.png', './assets/tiles/cyberpunk-corridor.png');
        this.load.image('cyberpunk-corridor copy.png', './assets/tiles/cyberpunk-corridor copy.png');
        this.load.spritesheet('tiles', './assets/tiles/Tiles70x70.png', {frameWidth: 70, frameHeight: 70});

        this.load.image('coin', './assets/sprites/coinGold.png');
        
    }
     
    create() {
       
        // load the map 
        map = this.make.tilemap({key: 'labtilemap'});
        
        // tiles for the ground layer
        var groundTiles = map.addTilesetImage('TileSetRe','tiles');
        // create the ground layer
        groundLayer = map.createLayer('Tile Layer 1', groundTiles, 0, 0);
        groundLayer.setDepth(-2);
        // the player will collide with this layer
        groundLayer.setCollisionByExclusion([-1]);

        map.createLayer("Acc", groundTiles, 0, 0);
     
        // set the boundaries of our game world
        this.physics.world.bounds.width = 300;
        this.physics.world.bounds.height = 200;

        this.particleManager = this.add.particles('particle');

        // Instantiate the Player Class  
        this.player = new Player(this, 200, 200, 'player');
        // this.player = new Player(this, 2000, 1200, 'player');

        //player.setBounce(0.2); // our player will bounce from items
        this.player.body.setCollideWorldBounds(true); // don't go out of the map
        	
        // Add collision with the ground
        this.physics.add.collider(groundLayer, this.player);

        this.doors = [];

        this.plates = [];

        this.enemies = [];
        
        this.enemyEmitters = [];

        // Adding keyboard input
        // Create key bindings
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        //cursors = this.input.keyboard.createCursorKeys();

        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(this.player);
        
        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#ccccff'); 

        // Create ability cooldown bar
        //this.coolDownBar = this.makeBar(game.config.width/2 - this.coolDownBarWidth/2, 20, 0x2ecc71);
        // this.setValue(this.coolDownBar, 0);
        //this.coolDownBar.setScrollFactor(0, 0);

        // Load Sound
        this.teleportSound = this.sound.add("teleportSound", {loop: false, volume: 0.7});

        this.scoreConfig = {
            fontFamily: 'cyberfunk',
            fontSize: '30px',
            color: '#faf5c8',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            }
        }

        this.hintConfig = {
            fontFamily: 'cyberfunk',
            fontSize: '60px',
            color: '#faf5c8',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            }
        }

        this.dialogueConfig = {
            fontFamily: 'cyberfunk',
            fontSize: '30px',
            color: '#faf5c8',
            align: 'left', 
            wordWrap: { width: 750, useAdvancedWrap: true }
        }
        

        this.finishLevel = () => {
            this.scene.start("menuScene");
        }

    }
     
    update(time, delta) {
        
        this.player.update();
        
    }

}