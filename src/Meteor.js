import Sprite from "openfl/display/Sprite";
import Bitmap from "openfl/display/Bitmap";
import ResourceManager from "./ResourceManager";
import Rectangle from "openfl/geom/Rectangle";
import Lib from "openfl/Lib";
const TWEEN = require('@tweenjs/tween.js')

class Meteor extends Sprite {
    
    constructor(x, y, angle, speed, id) {
        super();
        this._bitmap = new Bitmap(ResourceManager.loadBitmap(`res/ThienThach${id}.png`));
        this.addChild(this._bitmap);
        this._angle = angle;
        this._speed = speed;
        this._hp = id + 1;
        this.x = x;
        this.y = y;
    }

    get bitmap() {
        return this._bitmap;
    }

    getSpeed() {
        return this._speed;
    }

    getAngle() {
        return this._angle;
    }

    damage() {
        this._hp--;
        if (this._hp === 0) {
            this.destroy();
        }
    }

    destroy() {
        this._destroyed = true;
        new TWEEN.Tween(this).to({alpha: 0.0}, 100).easing(TWEEN.Easing.Linear.None).onComplete(() => {
            Lib.current.stage._main.removeChild(this);
        }).start();
    }

    isDestroyed() {
        return this._destroyed;
    }
    
    update() {
        this.x += Math.cos(this.getAngle()) * this.getSpeed();
        this.y += Math.sin(this.getAngle()) * this.getSpeed();
        // Destroy if go out of the screen.
        if (this.y > Lib.current.stage.stageHeight) {
            Lib.current.stage._main.loseLive(1); 
            this.destroy();
        }
    }

    
}

export default Meteor;
