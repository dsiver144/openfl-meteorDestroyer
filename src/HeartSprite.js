import Sprite from "openfl/display/Sprite";
import Bitmap from "openfl/display/Bitmap";
import ResourceManager from "./ResourceManager";
import Rectangle from "openfl/geom/Rectangle";
import Lib from "openfl/Lib";
const TWEEN = require('@tweenjs/tween.js')

class HeartSprite extends Sprite {
    
    constructor(number) {
        super();
        this._bg = new Bitmap(ResourceManager.loadBitmap('res/BarBG.png'));
        this._heartBitmaps = [];
        for (let i = 0; i < number; i++) {
            let bitmap = new Bitmap(ResourceManager.loadBitmap('res/SpaceshipHeart.png'));
            let spacing = 12;
            bitmap.x = 0;
            bitmap.y = i * (bitmap.height + spacing);
            this.addChild(bitmap);
            this._heartBitmaps.push(bitmap);
        }
    }

    refresh(number) {
        for (let i = 0; i < this._heartBitmaps.length; i++) {
            let bitmap = this._heartBitmaps[i];
            if (i + 1 > number) {
                bitmap.visible = false;
            }
        }
    }
}

export default HeartSprite;