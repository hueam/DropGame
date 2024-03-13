import Phaser from "phaser";
import GameUtil from "../Core/GameUtil";
import GameUtill from "../Core/GameUtil";
import { GameOption } from "../GameOption";
import PlatformSprite, { PlatformInitOption } from "./PlatformSprite";

export default class platformGroup extends Phaser.Physics.Arcade.Group{
    constructor(world:Phaser.Physics.Arcade.World,scene:Phaser.Scene){
        super(world,scene)
    }
    getPlatformInitOption(isFirst:boolean): PlatformInitOption
    {
        let {width,height} = GameOption.gameSize;
        let x: number = isFirst ? width*0.5:width*0.5+ GameUtil.Rand(GameOption.platformXDistance)
        * Phaser.Math.RND.sign();
        let y: number = isFirst ? height *0.4
         :this.getLowerYPos() + GameUtil.Rand(GameOption.platformYDistance);
        let pWidth:number = GameUtil.Rand(GameOption.platformRange)/GameOption.pixelScale; 

        return {x,y,width:pWidth};
    }

    getLowerYPos(): number{
        let pos: number =0;
        let platform: PlatformSprite[] = this.getChildren() as PlatformSprite[];

        platform.forEach(p =>{
            pos = Math.max(pos,p.y);
        })

        return pos;
    }
}