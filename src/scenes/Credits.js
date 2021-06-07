class Credits extends Phaser.Scene {

    constructor() {
        super("creditsScene");
    }

    create(){
        
        this.creditsText = this.add.text(0, 0, 'Credits', 
        { fontFamily: 'cyberfunk',
        fontSize: '56px',
        color: '#faf5c8', });
        this.madeByText = this.add.text(0, 0, 'Created By:', 
        { fontFamily: 'cyberfunk',
        fontSize: '56px',
        color: '#faf5c8', });
        this.zone = this.add.zone(config.width/2, config.height/2, config.width, config.height);
        this.peopleCredits = this.add.text(0, 0, ' \n Programmer, Level Designer and Production Manager By \n Strker Buffington \n\n Artwork By \n Lauren Nakamura \n\n Sound and Tilemap Implementation By \n Rohan Jhangiani \n\n Additional Sound Effects From \n Zapsplat - Alan Mckinney', 
        { fontFamily: 'cyberfunk',
        fontSize: '30px',
        color: '#faf5c8', });
        
        Phaser.Display.Align.In.Center(
        this.creditsText,
        this.zone
        );
        
        Phaser.Display.Align.In.Center(
        this.madeByText,
        this.zone
        );

        Phaser.Display.Align.In.Center(
        this.peopleCredits,
        this.zone
        );


        
        this.creditsText.setY(100);
        this.madeByText.setY(200);
        this.peopleCredits.setY(250);
        
    }
}