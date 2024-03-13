import EnemyGroup from "./GameObject/EnemyGroup";
import EnemySprite from "./GameObject/EnemySprite";
import platformGroup from "./GameObject/PlatformGroup";
import PlatformSprite, { PlatformInitOption } from "./GameObject/PlatformSprite";
import PlayerSprite from "./GameObject/PlayerSprite";
import { GameOption } from "./GameOption";
import platformSpriteLoader ,{SpriteSet}from "./platformLoader";

export default class PlayGameScene extends Phaser.Scene {
    player:PlayerSprite;
    background:Phaser.GameObjects.TileSprite;

    leftSprite: Phaser.GameObjects.Sprite;
    rightSprite: Phaser.GameObjects.Sprite;
    middleSprite: Phaser.GameObjects.Sprite;

    platformGroup : platformGroup;
    enemyGroup : EnemyGroup;

    score : HTMLElement | null;
    s : integer;

    constructor()
    {
        super("PlayGameScene");
    }

    create() {
        this.s = 0;
        this.score = document.getElementById("score") as HTMLElement | null;

        this.setBackground();
        let { middleSprite:m,leftSprite:l,rightSprite:r} = platformSpriteLoader(this);

        this.platformGroup = new platformGroup(this.physics.world,this);
        this.enemyGroup = new EnemyGroup(this.physics.world,this,this.platformGroup);
        for (let i = 0; i < 10; i++){
            let option:PlatformInitOption = this.platformGroup.getPlatformInitOption(i == 0);
            let p = new PlatformSprite(this, this.platformGroup, l, r, m, option);
            if(i> 0){
                this.placeOnPlatform(p);
            }
        }
        
        // this.platformGroup.add(p)

        this.player = new PlayerSprite(this);
    }
    placeOnPlatform(p:PlatformSprite):void
    {
        let e = new EnemySprite(this,p,this.enemyGroup);
    }
    handleCollision(body1:Phaser.GameObjects.GameObject,body2:Phaser.GameObjects.GameObject):void{
        let player:PlayerSprite = body1 as PlayerSprite;
        let platform:PlatformSprite = body2 as PlatformSprite;

        console.log("착지함");
    }
    handleEnemyCollision(body1:Phaser.GameObjects.GameObject,body2:Phaser.GameObjects.GameObject):void{
        let player = body1 as PlayerSprite;
        let enemy = body2 as EnemySprite;

        if(player.body.touching.down&&enemy.body.touching.up){
            enemy.anims.play("enemy_hit",true);
            this.enemyGroup.groupToPool(enemy);

            enemy.setFlipY(true);
            player.setVelocityY(-400);
            this.s++;
            this.score!.innerHTML = this.s.toString();
        }else
        {
            this.gameOver();
        }
    }
    resetPlatform(p: PlatformSprite){
        let option = this.platformGroup.getPlatformInitOption(false);
        p.init(option);
    }
    startMove():void{
        this.platformGroup.setVelocityY(-GameOption.platformSpeed);
    }
    update(time: number, delta:number) {
        if(this.player.firstMove){
            this.background.tilePositionY += 0.2;
        }
        this.physics.world.collide(this.player,this.platformGroup,this.handleCollision,undefined,this);
        this.physics.world.collide(this.player,this.enemyGroup,this.handleEnemyCollision,undefined,this);
        if(this.player.y> GameOption.gameSize.height || this.player.y<0){
            this.gameOver();
        }

        let pList : PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];
        pList.forEach(p => {
            let pBound = p.getBounds();
            if(pBound.bottom < 0){
                this.resetPlatform(p);
            }
            let enemis = this.enemyGroup.getChildren() as EnemySprite[];
            enemis.forEach(e =>{
                e.patrol();

                let eBound = e.getBounds();
                if(eBound.bottom<0){
                    e.setVelocity(0,0);
                    e.body.setAllowGravity(false);
                    e.setVisible(false);
                }
            })
        });
    }
    gameOver(){
        this.s= 0;
        this.score!.innerHTML = this.s.toString();
        this.scene.start("PlayGameScene");
        this.events.off(Phaser.Scenes.Events.UPDATE);
    }
    setBackground():void{
        this.background = this.add.tileSprite(
            0,0,
            GameOption.gameSize.width/GameOption.pixelScale,
            GameOption.gameSize.height/GameOption.pixelScale,'background');
        this.background.setOrigin(0, 0);
        this.background.scale = GameOption.pixelScale;
    }
}