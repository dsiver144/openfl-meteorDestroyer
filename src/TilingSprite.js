import Sprite from "openfl/display/Sprite";
import Bitmap from "openfl/display/Bitmap";
import ResourceManager from "./ResourceManager";
import Lib from "openfl/Lib";

class TilingSprite extends Sprite {
    constructor(path) {
        super();
        this._bitmaps = [];
        var num = 9;
        for (let i = 0; i < num; i++) {
            const bitmap = new Bitmap(ResourceManager.loadBitmap(path));
            bitmap.x = (i % 3) * bitmap.width;
            bitmap.y = Math.floor(i / 3) * bitmap.height;
            this._bitmaps.push(bitmap);
            this.addChild(bitmap);
        }
        this.vx = 0;
        this.vy = 0;
        this.x = 0;
        this.y = 0;
    }

    setSpeed(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }

    update() {
        for (let i = 0; i < this._bitmaps.length; i++) {
            const bitmap = this._bitmaps[i];
            bitmap.x += this.vx;
            bitmap.y += this.vy;
            if (bitmap.x + bitmap.width <= 0) {
                bitmap.x = (bitmap.x + bitmap.width) + bitmap.width * 3;
            }
            if (bitmap.x >= Lib.current.stage.stageWidth) {
                bitmap.x = (bitmap.x + bitmap.width) - bitmap.width * 3;
            }
            if (bitmap.y + bitmap.height <= 0) {
                bitmap.y = (bitmap.y + bitmap.height) + bitmap.height * 3;
            }
            if (bitmap.y >= Lib.current.stage.stageHeight) {
                bitmap.y = (bitmap.y + bitmap.height) - bitmap.height * 3;
            }
        }
    }
}

export default TilingSprite;