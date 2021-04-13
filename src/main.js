var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    scene: [Prototype]
};
 
console.log("main runs!");
var game = new Phaser.Game(config);
//game.scene.start("Prototype");

var map;
var player;
var cursors;
var groundLayer, coinLayer;
var text;