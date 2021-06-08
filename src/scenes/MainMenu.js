class MainMenu extends Phaser.Scene {

    constructor() {
        super("mainMenuScene");
    }

    preload () {
        loadFont("Orbitron", "./assets/fonts/Orbitron-Bold.ttf");
    }

    create() {

        this.creditsConfig = {
            fontFamily: 'Orbitron',
            fontSize: '56px',
            color: '#faf5c8',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            }
        }

        // Add Play Button to the Screen
        this.play = this.add.text(game.config.width/3 , 3*game.config.height/4, "PLAY", this.creditsConfig).setOrigin(0.5, 0.5);
        this.play.setInteractive();
        this.play.on('pointerover', () => { enterButtonHoverState(this.play); });
        this.play.on('pointerout', () => { enterButtonRestState(this.play); });
        this.play.on('pointerdown', () => { 
            this.scene.start("menuScene"); 
        });

        // Add Credits Button to the Screen
        // this.tutorial = this.add.text(game.config.width/3 , 3*game.config.height/4, "TUTORIAL", CREDITSConfig).setOrigin(0.5, 0.5);
        // this.tutorial.setInteractive();
        // this.tutorial.on('pointerover', () => { enterButtonHoverState(this.tutorial); });
        // this.tutorial.on('pointerout', () => { enterButtonRestState(this.tutorial); });
        // this.tutorial.on('pointerdown', () => { 
        //     this.UISound.play();
        //     this.scene.start("tutorialScene"); 
        // });

        // Add Credits Button to the Screen
        this.credits = this.add.text((2 * game.config.width)/3 -20, 3*game.config.height/4, "CREDITS", this.creditsConfig).setOrigin(0.5, 0.5);
        this.credits.setInteractive();
        this.credits.on('pointerover', () => { enterButtonHoverState(this.credits); });
        this.credits.on('pointerout', () => { enterButtonRestState(this.credits); });
        this.credits.on('pointerdown', () => { 
            this.scene.start("creditsScene");
        });
    }
}