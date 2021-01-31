import Sprite from "openfl/display/Sprite";
import Bitmap from "openfl/display/Bitmap";
import ResourceManager from "./ResourceManager";
import Rectangle from "openfl/geom/Rectangle";
import Lib from "openfl/Lib";
const TWEEN = require('@tweenjs/tween.js')

class CooldownGauge extends Sprite {
    
    constructor(x, y) {
        super();
        this._bg = new Bitmap(ResourceManager.loadBitmap('res/BarBG.png'));
        this._bg.x = this._bg.y = 0;
        this._filler = new Bitmap(ResourceManager.loadBitmap('res/BarFiller.png'));
        this._filler.x = 3;
        this._filler.y = 3;
        this.addChild(this._bg);
        this.addChild(this._filler);
        this.x = x;
        this.y = y;
    }

    refresh(rate) {
        this._filler.scrollRect = new Rectangle(0, 0, this._filler.width * rate, this._filler.height);
    }

    barWidth() {
        return this._bg.width;
    }

    barHeight() {
        return this._bg.height;
    }
}

export default CooldownGauge;