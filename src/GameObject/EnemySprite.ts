import { Bounds } from "matter";
import GameUtil from "../Core/GameUtil";
import { GameOption } from "../GameOption";
import EnemyGroup from "./EnemyGroup";
import PlatformSprite from "./PlatformSprite";

export default class EnemySprite extends Phaser.Physics.Arcade.Sprite
{
    platform: PlatformSprite;
    body:Phaser.Physics.Arcade.Body;
    constructor(scene:Phaser.Scene,platform:PlatformSprite,group:EnemyGroup){
        super(scene,platform.x,platform.y-100,'enemy');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scale = GameOption.pixelScale;
        this.platform = platform;
        group.add(this);
        this.initAnimation(scene.anims);
        this.setVelocityX(GameUtil.Rand(GameOption.patrolSpeed)*Phaser.Math.RND.sign());

        this.anims.play("enemy_run");
    }

    patrol():void{
        this.setFlipX(this.body.velocity.x>0);
        let pBound = this.platform.getBounds();
        let eBound = this.getBounds();
        let xVelo = this.body.velocity.x;

        let offset:number =20;
        if((xVelo<0&&eBound.left+offset<pBound.left)||(xVelo>0&&eBound.right-offset>pBound.right))
        {
            this.setVelocityX(xVelo*-1);
        }
    }
    initAnimation(anims:Phaser.Animations.AnimationManager): void {
        anims.create({
            key:"enemy_run",
            frames:anims.generateFrameNumbers("enemy",{start:0,end:11}),
            frameRate:20,
            repeat:-1
        });
        anims.create({
            key:"enemy_hit",
            frames:anims.generateFrameNumbers("enemy_hit",{start:0,end:2}),
            frameRate:20,
            repeat:-1
        });
    }
}