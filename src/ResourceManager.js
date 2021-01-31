import BitmapData from "openfl/display/BitmapData";
import Sound from "openfl/media/Sound";
import Bitmap from "openfl/display/Bitmap"

class ResourceManager {

    static initCache() {
        this._bitmapCache = {}
        this._loadingBitmap = {}
        this._soundCache = {}
        this._loadingSound = {}
        this._init = true;
    }

    static isReady() {
        if (!this._init) 
            return false;
        let bitmapReady = Object.keys(this._loadingBitmap).length === 0;
        let soundReady = Object.keys(this._loadingSound).length === 0;
        return bitmapReady && soundReady;
    }

    static loadBitmap(path, onComplete) {
        if (this._bitmapCache[path]) 
            return this._bitmapCache[path];
        this._loadingBitmap[path] = true;
        BitmapData.loadFromFile(path).onComplete((bitmapData) => {
            this._bitmapCache[path] = bitmapData;
            delete this._loadingBitmap[path];
            if (onComplete)
                onComplete.call(this, bitmapData);
        });
    }

    static loadSound(path, onComplete) {
        if (this._soundCache[path]) 
            return this._soundCache[path];
        this._loadingSound[path] = true;
        Sound.loadFromFile(path).onComplete((sound) => {
            this._soundCache[path] = sound;
            delete this._loadingSound[path];
            if (onComplete)
                onComplete.call(this, sound);
        });
    }
}

export default ResourceManager;