import Sprite from "openfl/display/Sprite";
import Bitmap from "openfl/display/Bitmap";
import ResourceManager from "./ResourceManager";
import Rectangle from "openfl/geom/Rectangle";
import Lib from "openfl/Lib";

const TWEEN = require('@tweenjs/tween.js')

class Bullet extends Sprite {
    
    constructor(x, y, angle, speed, id) {
        super();
        this._bitmap = new Bitmap(ResourceManager.loadBitmap('res/Bullets.png'));
        var bulletId = id >= 0 ? id : Math.floor(Math.random() * 4);
        this._bitmap.scrollRect = new Rectangle(this._bitmap.width / 4 * bulletId, 0, this._bitmap.width / 4, this._bitmap.height);
        this.addChild(this._bitmap);
        this._angle = angle;
        this._speed = speed;
        this.x = x;
        this.y = y;
        this._destroyed = false;
    }

    getSpeed() {
        return this._speed;
    }

    getAngle() {
        return this._angle;
    }

    collideWith(object) {
        if (this._destroyed) return false;
        var bitmap = this._bitmap;
        if (this.x < (object.x + object.bitmap.width) && (this.x + bitmap.width) > object.x && this.y < (object.y + object.bitmap.height) && (this.y + bitmap.height) > object.y) {
            return true;
        }
        return false;
    }

    destroy() {
        this._destroyed = true;
        new TWEEN.Tween(this).to({alpha: 0.0}, 100).easing(TWEEN.Easing.Linear.None).onComplete((t) => {
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
        if (this.y + this._bitmap.height < 0) 
            this.destroy();
    }
}

export default Bullet;