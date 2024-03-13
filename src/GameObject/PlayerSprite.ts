import Phaser, { LEFT }  from "phaser";
import { GameOption } from "../GameOption";
import PlayGameScene from "../PlayGameScene";

export default class PlayerSprite extends Phaser.Physics.Arcade.Sprite{
    arrowKeys : Phaser.Types.Input.Keyboard.CursorKeys;
    firstMove:boolean = false;
    moveDirection:number =0;
    
    constructor(scene: Phaser.Scene){
        let x = GameOption.gameSize.width * 0.5;
        super(scene,x,100,'hero');

        scene.add.existing(this);
        this.scale = GameOption.pixelScale;
        scene.physics.add.existing(this);
        this.initAnimation(this.scene.anims);

        this.arrowKeys = this.scene.input.keyboard.createCursorKeys();
        this.scene.input.on("pointerdown",this.handlePointer,this);
        this.scene.events.on(Phaser.Scenes.Events.UPDATE,this.update,this);

        this.body.setOffset(0,15);
        this.body.setSize(20,30);
    }
    handlePointer(e: Phaser.Input.Pointer):void{
    }
    update(time:number,delta:number): void {
        const{left, right} = this.arrowKeys;
        
        if(left.isDown){
            this.setFlipX(true);
            this.anims.play('run',true);
            this.moveDirection = -1;
        }
        else if(right.isDown){
            this.setFlipX(false);
            this.anims.play('run',true);
            this.moveDirection = 1;
        }else{
            this.anims.play('idle',true);
            this.moveDirection = 0;
        }
        if((left.isDown||right.isDown)&&this.firstMove == false){
            this.firstMove = true;
            (this.scene as PlayGameScene).startMove();
        }
        this.setVelocityX(this.moveDirection*GameOption.heroSpeed);
    }
    initAnimation(anim:Phaser.Animations.AnimationManager):void{
        this.scene.anims.create({
            key :"idle",
            frames : anim.generateFrameNumbers("hero",{start:0,end:10}),
            frameRate:20,
            repeat: -1,
        })
        this.scene.anims.create({
            key :"run",
            frames : anim.generateFrameNumbers("hero_run",{start:0,end:11}),
            frameRate:20,
            repeat: -1,
        })
    }
}