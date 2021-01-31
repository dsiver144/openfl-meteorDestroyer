class Input {
    
    static init() {
        this.keyMapper = {
            65 : 'left', // A
            87 : 'up', // W
            68 : 'right', // D
            83 : 'down', // S
            27 : 'cancel', // Esc
            32 : 'ok', // Space
            13 : 'ok'  // Enter
        }
        this._data = {};
        this._count = {};
        for (let i = 0; i < this.keyMapper.length; i++) {
            this._data[i] = false;
            this._count[i] = 0;
        }
    }

    static isTriggered(symbol) {
        if (this._data[symbol]) {
            this._count[symbol] += 1;
        }
        return this._count[symbol] == 1;
    }

    static isPressed(symbol) {
        return this._data[symbol];
    }

    static update(type, e) {
        var symbol = this.keyMapper[e.keyCode];
        if (!symbol) return;
        if (type == 'down') {
            this._data[symbol] = true;
        } else {
            this._data[symbol] = false;
            this._count[symbol] = 0;
        }
    }
}

export default Input;