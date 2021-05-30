class Menu extends Phaser.Scene {
    
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.image('particle', './assets/sprites/5x5_white.png');
        this.load.image('backdrop', './assets/tiles/repairsky.png');

        // player animations
        this.load.atlas('player', './assets/anims/player.png', './assets/anims/player.json');

        this.load.atlas('timeAnim', './assets/anims/timeAnim.png', './assets/anims/timeAnim.json');

        this.load.audio("teleportSound", ["./assets/sounds/timeReverseSound.wav"]);
    }

    create(){
        // Config for Play Button
        let LOCKEDConfig = {
            fontFamily: 'Courier',
            fontSize: '45px',
            color: '#2e2e2e',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            }
        }

        let PREVIOUSConfig = {
            fontFamily: 'Courier',
            fontSize: '45px',
            color: '#faf5c8',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            }
        }

        let NEXTConfig = {
            fontFamily: 'Courier',
            fontSize: '45px',
            color: '#820101',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            }
        }

        if (!progress){
            progress = 0;
        }

        let i;
        this.levels = [];
        for (i = 0; i < 5; i++){
            let levelName = "level" + (i+1);
            let year = 2052-i;
            if (progress != i){
                this.levels[i] = this.add.text((i+1)*game.config.width/6 , game.config.height/2, year, LOCKEDConfig).setOrigin(0.5, 0.5);
            } else{
                this.levels[i] = this.add.text((i+1)*game.config.width/6 , game.config.height/2, year, NEXTConfig).setOrigin(0.5, 0.5);
                this.levels[i].setInteractive();
            } 

            console.log(this.levels[i]);
            let index = i;

            this.levels[i].on('pointerover', () => {
                enterButtonHoverState(index);
            });
            this.levels[i].on('pointerout', () => {
                enterButtonRestState(index);
            });
            this.levels[i].on('pointerdown', () => { 
                this.scene.start(levelName); 
            });
        }
        console.log(this.levels)
        
        
        // // Add Play Button to the Screen
        // this.lvl1 = this.add.text(game.config.width/6 , game.config.height/2, "2052", PLAYConfig).setOrigin(0.5, 0.5);
        // this.lvl1.setInteractive();
        // this.lvl1.on('pointerover', () => { enterButtonHoverState(this.lvl1); });
        // this.lvl1.on('pointerout', () => { enterButtonRestState(this.lvl1); });
        // this.lvl1.on('pointerdown', () => { 
        //     this.scene.start("level1"); 
        // });

        // // Add Play Button to the Screen
        // this.lvl2 = this.add.text(game.config.width/3, game.config.height/2, "2051", PLAYConfig).setOrigin(0.5, 0.5);
        // if (progress > 0){this.lvl2.setInteractive();}
        // this.lvl2.on('pointerover', () => { enterButtonHoverState(this.lvl2); });
        // this.lvl2.on('pointerout', () => { enterButtonRestState(this.lvl2); });
        // this.lvl2.on('pointerdown', () => { 
        //     this.scene.start("level2"); 
        // });
    }

}