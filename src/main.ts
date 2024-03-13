import 'phaser';
import PlayGameScene from './PlayGameScene';
import preloadAssetScene from './PreloadAssetScene';
import { GameOption } from './GameOption';
import { Physics } from 'phaser';

const {width,height} = GameOption.gameSize;

let physicsConfig: Phaser.Types.Core.PhysicsConfig = {
    default:'arcade',
    arcade:{
        gravity:{
            y:1200
        },
        debug:false
    }
}
let scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent:'theGame',
    width,
    height,
}
let config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor:0x444444,
    scale: scaleObject,
    scene: [preloadAssetScene,PlayGameScene],
    physics : physicsConfig,
    pixelArt: true
};
new Phaser.Game(config);