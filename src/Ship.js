import Sprite from "openfl/display/Sprite";
import Bitmap from "openfl/display/Bitmap";
import ResourceManager from "./ResourceManager";
import Input from "./Input";
import Lib from "openfl/Lib";

class Ship extends Sprite {
    
    constructor(x, y) {
        super();
        this._bitmap = new Bitmap(ResourceManager.loadBitmap('res/ship1.png'));
        this.addChild(this._bitmap);
        this._speed = 5;
        this.x = x;
        this.y = y;
        this._shootCooldownAmount = 10;
        this._shootCooldown = 0;
        this._waitForCooldown = false;
        this._shootDefaultDelay = 8;
        this._shootDelay = 0;
    }

    get bitmap() {
        return this._bitmap;
    }

    getSpeed() {
        return this._speed;
    }

    getMain() {
        return Lib.current.stage._main;
    }
    
    shoot() {
        // Shoot 2 bullets
        var bulletId = Math.floor(Math.random() * 4);
        this.getMain().generateBullet(this.x +  7, this.y - 5, -Math.PI / 2 - 0.05, 5, bulletId);
        this.getMain().generateBullet(this.x + 38, this.y - 5, -Math.PI / 2 + 0.05, 5, bulletId);
        ResourceManager.loadSound("res/Laser.ogg").play();
        this.addShootCoolDown();
    }

    addShootCoolDown() {
        this._shootDelay += this._shootDefaultDelay;
        this._shootCooldown += this._shootCooldownAmount;
        if (this._shootCooldown >= 100) {
            this._shootCooldown = 100;
            this._waitForCooldown = true;
        }
    }

    updateShootCooldown() {
        if (this._shootDelay > 0) this._shootDelay -= 1;
        if (this._shootCooldown > 0 && this._shootDelay == 0) {
            this._shootCooldown -= 1;
        } else if (this._shootCooldown == 0) {
            this._waitForCooldown = false;
        }
        this.getMain().cooldownGauge.refresh(this._shootCooldown / 100.0);
    }

    canShoot() {
        return this._shootDelay == 0 && !this._waitForCooldown;
    }
    
    update() {
        if (!this.getMain().isGameStart()) return;
        if (this.getMain().isGameOver()) return;
        if (Input.isPressed('left')) {
            this.x -= this.getSpeed();
        }
        if (Input.isPressed('right')) {
            this.x += this.getSpeed();
        }
        if (Input.isTriggered('ok')) {
            if (this.canShoot()) {
                this.shoot();
            } else {
                ResourceManager.loadSound("res/Buzzer1.ogg").play();
            }
        }
        this.updateShootCooldown();
    }
}

export default Ship;