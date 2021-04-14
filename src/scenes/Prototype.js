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

        // Instantiate the Player Class  
        player = new Player(this, 200, 200, 'player');
        
        //player.setBounce(0.2); // our player will bounce from items
        player.body.setCollideWorldBounds(true); // don't go out of the map
        	
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


    }
     
    update(time, delta) {
        //console.log(time);
        player.update();
    }
}
