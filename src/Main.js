import Sprite from "openfl/display/Sprite";
import Loader from "openfl/display/Loader";
import URLRequest from "openfl/net/URLRequest";
import Event from "openfl/events/Event";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import BitmapData from "openfl/display/BitmapData";
import MouseEvent from "openfl/events/MouseEvent";
import Tilemap from "openfl/display/Tilemap";
import Tileset from "openfl/display/Tileset";
import Bitmap from "openfl/display/Bitmap";
import Rectangle from "openfl/geom/Rectangle";
import ResourceManager from "./ResourceManager";
import Input from "./Input";
import Bullet from "./Bullet";
import Ship from "./Ship";
import TilingSprite from "./TilingSprite";
import Lib from "openfl/Lib";
import Meteor from "./Meteor";
import Font from "openfl/text/Font";
import TextField from "openfl/text/TextField";
import TextFormat from "openfl/text/TextFormat";
import CooldownGauge from "./CooldownGauge";
import HeartSprite from "./HeartSprite";

const TWEEN = require('@tweenjs/tween.js')
class Main extends Sprite {

	constructor () {
        super();
        ResourceManager.initCache();
        Input.init();
        this.preloadAllAssets();
        this._phase = 'loading_assets';
        this._frameCount = 0;
    }

    preloadAllAssets() {
        ResourceManager.loadSound("res/BGM.ogg");
        ResourceManager.loadBitmap("res/Bullets.png");
        ResourceManager.loadBitmap("res/ship1.png");
        ResourceManager.loadBitmap("res/ship2.png");
        ResourceManager.loadBitmap("res/ship3.png");
        ResourceManager.loadBitmap("res/BG.png");
        ResourceManager.loadBitmap("res/ThienThach0.png");
        ResourceManager.loadBitmap("res/ThienThach1.png");
        ResourceManager.loadBitmap("res/ThienThach2.png");
        ResourceManager.loadBitmap("res/SpaceshipTitle.png");
        ResourceManager.loadBitmap("res/SpaceshipPressStart.png");
        ResourceManager.loadBitmap("res/SpaceshipGameOver.png");
        ResourceManager.loadBitmap("res/SpaceshipHeart.png");
        ResourceManager.loadSound("res/Shot1.ogg");
        ResourceManager.loadSound("res/Laser.ogg");
        ResourceManager.loadSound("res/Point.ogg");
        ResourceManager.loadSound("res/Blow.ogg");
        ResourceManager.loadSound("res/Buzzer1.ogg");
        ResourceManager.loadBitmap('res/BarBG.png');
        ResourceManager.loadBitmap('res/BarFiller.png')
    }

    update() {
        switch(this._phase) {
            case 'loading_assets':
                if (ResourceManager.isReady()) {
                    this.initGameVariables();
                    this.initPlayerShip();
                    this._phase = 'update';
                }
                break;
            case 'update':
                this.update_basic();
                break;
        }
        TWEEN.update();
    }

    updateInput(type, e) {
        Input.update(type, e);
    }

    onMouseDown(e) {

    }

    update_basic() {
        this.updatePlayerShip();
        this.updateBullets();
        this.updateMeteors();
        this.updateClear();
        this.updateBackground();
        this.updateTitleScreen();
        this._frameCount += 1;
    }

    initGameVariables = function() {
        this._bullets = [];
        this._meteors = [];
        this._startGame = false;
        this._gameOver = false;
        this._score = 0;
        this._lives = 3;
         // Create Background
        this._background = new TilingSprite("res/BG.png");
        this._background.setSpeed(0, 0.5);
        this.addChild(this._background);
        // Create Score Text
        var format = new TextFormat ("Arial", 30, 0xfff3d4);
        this._scoreText = new TextField ();
        this._scoreText.defaultTextFormat = format;
        this._scoreText.selectable = false;
		this._scoreText.x = 10;
		this._scoreText.y = 10;
		this._scoreText.width = 200;
        this._scoreText.text = "0";
        this._scoreText.visible = false;
        this.addChild(this._scoreText);
        this.createTitleScreen();
        // Cooldown Gauge
        this._cooldownGauge = new CooldownGauge(10, 10);
        this._cooldownGauge.x = (Lib.current.stage.stageWidth - this._cooldownGauge.barWidth()) / 2;
        this._cooldownGauge.y = Lib.current.stage.stageHeight - 60;
        this._cooldownGauge.visible = false;
        this._cooldownGauge.refresh(0);
        this.addChild(this._cooldownGauge);
        // Hearts
        this._heartSprite = new HeartSprite(this._lives);
        this._heartSprite.x = Lib.current.stage.stageWidth - 30;
        this._heartSprite.y = 10;
        this._heartSprite.refresh(this._lives);
        this._heartSprite.visible = false;
        this.addChild(this._heartSprite);
        // Game Over
        this._gameOverBitmap = new CooldownGauge(10, 10);
        this._gameOverBitmap = new Bitmap(ResourceManager.loadBitmap("res/SpaceshipGameOver.png"));
        this._gameOverBitmap.x = (Lib.current.stage.stageWidth - this._gameOverBitmap.width) / 2;
        this._gameOverBitmap.y = (Lib.current.stage.stageHeight - this._gameOverBitmap.height) / 2;
        this._gameOverBitmap.alpha = 0.0;
        this.addChild(this._gameOverBitmap);
        // Play BGM
        this.playBGM();
    }

    get cooldownGauge() {
        return this._cooldownGauge;
    }

    addScore(value) {
        this._score += value;
        this.updateScoreText();
    }

    updateScoreText() {
        this._scoreText.text = String(this._score);
    }

    loseLive(value) {
        this._lives -= value;
        this._heartSprite.refresh(this._lives);
        if (this._lives === 0) {
            this._gameOver = true;
            this._cooldownGauge.visible = false;
            new TWEEN.Tween(this._gameOverBitmap).to({alpha: 1.0, y: this._gameOverBitmap.y + 30}, 1000).easing(TWEEN.Easing.Linear.None).start();
        }
    }

    updateLiveSprite() {
        
    }

    isGameStart() {
        return !!this._startGame;
    }

    isGameOver() {
        return !!this._gameOver;
    }

    createTitleScreen() {
        // Create Title Text
        this._titleBitmap = new Bitmap(ResourceManager.loadBitmap("res/SpaceshipTitle.png"));
        this._titleBitmap.x = (Lib.current.stage.stageWidth - this._titleBitmap.width) / 2;
        this._titleBitmap.y = 100;
        this._titleBitmap.alpha = 0.0;
        const tween = new TWEEN.Tween(this._titleBitmap).to({y: 240, alpha: 1.0, scaleX: 1.2, scaleY: 1.2}, 1000).easing(TWEEN.Easing.Sinusoidal.InOut).onComplete(e => {
            new TWEEN.Tween(this._titleBitmap).to({scaleX: 1.0, scaleY: 1.0}, 500).easing(TWEEN.Easing.Linear.None).start();
        }).start();
        // Create Start Button
        this.addChild(this._titleBitmap);
        this._startButton = new Sprite()
        this._startButton.addChild(new Bitmap(ResourceManager.loadBitmap("res/SpaceshipPressStart.png")))
        this._startButton.x = (Lib.current.stage.stageWidth - this._startButton.width) / 2;
        this._startButton.y = 700;
        this._startButton.buttonMode = true;
        this._startButton.addEventListener(MouseEvent.MOUSE_DOWN, (e) => {
            this.startGame();
        });
        this.addChild(this._startButton);
    }

    updateTitleScreen() {
        if (this.isGameStart()) return;
        if (Input.isTriggered('ok')) {
            this.startGame();
        }
        this._startButton.alpha = 0.5 + Math.sin(this._frameCount * Math.PI / 60) * 0.5;
    }

    startGame() {
        let tween  = new TWEEN.Tween(this._titleBitmap).to({alpha: 0.0, y: this._titleBitmap.y - 50}, 500).easing(TWEEN.Easing.Linear.None).start();
        let tween2 = new TWEEN.Tween(this._startButton).to({alpha: 0.0, y: this._startButton.y + 10}, 500).easing(TWEEN.Easing.Linear.None).start().onComplete(e => {
            this._startGame = true;
            this._scoreText.visible = true;
            this._cooldownGauge.visible = true;
            this._heartSprite.visible = true;
            this.resetSpawnMeteorTimer();
        });
    }

    resetSpawnMeteorTimer() {
        this._meteorSpawnDelay = 25;
    }

    playBGM() {
        this._bgmChannel = ResourceManager.loadSound("res/BGM.ogg").play();
		this._bgmChannel.addEventListener(Event.SOUND_COMPLETE, e => {
            this.playBGM();
        });
    }

    updateBackground() {
        this._background.update();
    }

    initPlayerShip() {
        // Create Player Ship and place it at the bottom middle of the screen.
        this._playerShip = new Ship(0, 0);
        let offsetY = 100;
        let x = (Lib.current.stage.stageWidth - this._playerShip.bitmap.width) / 2;
        let y = Lib.current.stage.stageHeight - this._playerShip.bitmap.height - offsetY;
        this._playerShip.x = x;
        this._playerShip.y = y;
        this.addChild(this._playerShip);
    }

    updatePlayerShip() {
        this._playerShip.update();
    }

    generateBullet(x, y, angle, speed, id) {
        var bullet = new Bullet(x, y, angle, speed, id);
        this.addChild(bullet);
        this._bullets.push(bullet);
    }

    generateMeteor(x, y, angle, speed, id) {
        var meteor = new Meteor(x, y, angle, speed, id);
        this.addChild(meteor);
        this._meteors.push(meteor);
    }

    updateBullets() {
        this._bullets.forEach(bullet => bullet.update());
    }
    
    updateMeteors() {
        if (!this.isGameStart()) return;
        if (this._meteorSpawnDelay > 0) {
            this._meteorSpawnDelay--;
        } else {
            this.resetSpawnMeteorTimer();
            let offsetX = 100;
            let x = offsetX + Math.floor(Math.random() * (Lib.current.stage.stageWidth - offsetX * 2));
            let y = -100;
            let angle = Math.PI / 2;
            let speed = Math.floor(Math.random() * 6);
            let id = Math.floor(Math.random() * 3);
            this.generateMeteor(x, y, angle, speed, id);
        }
        this._meteors.forEach((m) => {
            this._bullets.forEach((bullet) => {
                if (bullet.collideWith(m)) {
                    m.damage();
                    bullet.destroy();
                    if (!m.isDestroyed()) {
                        ResourceManager.loadSound("res/Blow.ogg").play();
                    } else {
                        ResourceManager.loadSound("res/Point.ogg").play();
                        this.addScore(1);
                    }
                }
            });
            m.update();
        });
    }

    updateClear() {
        this._meteors = this._meteors.filter(m => !m.isDestroyed());
        this._bullets = this._bullets.filter(b => !b.isDestroyed());
    }
}

export default Main;