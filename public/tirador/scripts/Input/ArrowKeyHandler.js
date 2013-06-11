$(function() {
  var ArrowKeyHandler = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,

    A: 65,
    S: 83,
    D: 68,
    Z: 90,
    X: 88,
    C: 67,

    NUM_0: 48,
    NUM_1: 49,
    NUM_2: 50,
    NUM_3: 51,
    NUM_4: 52,
    NUM_5: 53,

    GAME_LEFT: -1,
    GAME_RIGHT: -1,
    GAME_UP: -1,
    GAME_DOWN: -1,
    GAME_BUTTON_1: -1,
    GAME_BUTTON_2: -1,

    init: function() {
      this.GAME_LEFT = this.LEFT;
      this.GAME_RIGHT = this.RIGHT;
      this.GAME_UP = this.UP;
      this.GAME_DOWN = this.DOWN;
      this.GAME_BUTTON_1 = this.A;
      this.GAME_BUTTON_2 = this.S;
    },

    keyUpListeners: {},
    keyDownTimeOutListeners: {},

    addKeyUpCallback: function(key, callback) {
      if (!this.keyUpListeners.hasOwnProperty(key)) {
        this.keyUpListeners[key] = [];
      }

      this.keyUpListeners[key].push(callback);

      return {
        key: key,
        type: "Up",
        callback: callback
      };
    },

    removeKeyUpCallback: function(key, callback) {
      if (this.keyUpListeners.hasOwnProperty(key)) {
        this.keyUpListeners[key].splice(this.keyUpListeners[key].indexOf(callback), 1);
      }
    },

    addKeyDownTimeOutCallback: function(key, callback, delay) {
      if (!this.keyDownTimeOutListeners.hasOwnProperty(key)) {
        this.keyDownTimeOutListeners[key] = [];
      }

      this.keyDownTimeOutListeners[key].push({
        callback: callback,
        delay: delay,
        id: -1
      });

      return {
        key: key,
        type: "DownTimeOut",
        callback: callback
      };
    },

    removeKeyDownTimeOutCallback: function(key, callback) {
      if (this.keyDownTimeOutListeners.hasOwnProperty(key)) {
        for (var i = this.keyDownTimeOutListeners[key].length - 1; i >= 0; i--) {
          var c = this.keyDownTimeOutListeners[key][i].callback;

          if (c === callback) {
            clearTimeout(this.keyDownTimeOutListeners[key][i].id);
            this.keyDownTimeOutListeners[key].splice(i, 1);
          }
        }
      }
    },

    addCallbacks: function(callbacks) {
      for (var i = 0; i < callbacks.length; i++) {
        var c = callbacks[i];

        if (c.type == "DownTimeOut") {
          this.addKeyDownTimeOutCallback(c.key, c.callback, c.delay);
        }

        if (c.type == "Up") {
          this.addKeyUpCallback(c.key, c.callback);
        }
      }
    },

    removeCallbacks: function(callbacks) {
      for (var i = 0; i < callbacks.length; i++) {
        var c = callbacks[i];

        if (c.type == "DownTimeOut") {
          this.removeKeyDownTimeOutCallback(c.key, c.callback);
        }

        if (c.type == "Up") {
          this.removeKeyUpCallback(c.key, c.callback);
        }
      }

      callbacks.length = 0;
    },

    isDown: function(keyCode) {
      return this._pressed[keyCode];
    },

    onKeydown: function(event) {
      var key = event.keyCode;

      this._pressed[key] = true;

      if (this.keyDownTimeOutListeners.hasOwnProperty(key)) {
        for (var i = this.keyDownTimeOutListeners[key].length - 1; i >= 0; i--) {
          if (this.keyDownTimeOutListeners[key][i].id == -1) {
            this.keyDownTimeOutListeners[key][i].id = setTimeout(this.keyDownTimeOutListeners[key][i].callback, this.keyDownTimeOutListeners[key][i].delay);
          }
        }
      }
    },

    onKeyup: function(event) {
      var key = event.keyCode;

      if (this.keyUpListeners.hasOwnProperty(key)) {
        for (var i = this.keyUpListeners[key].length - 1; i >= 0; i--) {
          this.keyUpListeners[key][i]();
        }
      }

      if (this.keyDownTimeOutListeners.hasOwnProperty(key)) {
        for (var i = this.keyDownTimeOutListeners[key].length - 1; i >= 0; i--) {
          clearTimeout(this.keyDownTimeOutListeners[key][i].id);
          this.keyDownTimeOutListeners[key][i].id = -1;
        }
      }

      delete this._pressed[key];
    }

  };

  window.ArrowKeyHandler = ArrowKeyHandler;

  window.addEventListener('keyup', function(event) {
    ArrowKeyHandler.onKeyup(event);
  }, false);
  window.addEventListener('keydown', function(event) {
    ArrowKeyHandler.onKeydown(event);
  }, false);

  document.onkeydown = function(event) {
    if (event.keyCode == ArrowKeyHandler.LEFT ||
      event.keyCode == ArrowKeyHandler.UP ||
      event.keyCode == ArrowKeyHandler.RIGHT ||
      event.keyCode == ArrowKeyHandler.DOWN ||
      event.keyCode == ArrowKeyHandler.CTRL ||
      event.keyCode == ArrowKeyHandler.ALT ||
      event.keyCode == ArrowKeyHandler.ESC ||
      event.keyCode == ArrowKeyHandler.SPACE ||
      event.keyCode == ArrowKeyHandler.A ||
      event.keyCode == ArrowKeyHandler.S ||
      event.keyCode == ArrowKeyHandler.D ||
      event.keyCode == ArrowKeyHandler.Z ||
      event.keyCode == ArrowKeyHandler.X ||
      event.keyCode == ArrowKeyHandler.C ||
      event.keyCode == ArrowKeyHandler.NUM_0 ||
      event.keyCode == ArrowKeyHandler.NUM_1 ||
      event.keyCode == ArrowKeyHandler.NUM_2 ||
      event.keyCode == ArrowKeyHandler.NUM_3 ||
      event.keyCode == ArrowKeyHandler.NUM_4 ||
      event.keyCode == ArrowKeyHandler.NUM_5) {
      event.preventDefault();
    }
  }

  document.onkeypress = function(event) {
    if (event.keyCode == ArrowKeyHandler.LEFT ||
      event.keyCode == ArrowKeyHandler.UP ||
      event.keyCode == ArrowKeyHandler.RIGHT ||
      event.keyCode == ArrowKeyHandler.DOWN ||
      event.keyCode == ArrowKeyHandler.CTRL ||
      event.keyCode == ArrowKeyHandler.ALT ||
      event.keyCode == ArrowKeyHandler.ESC ||
      event.keyCode == ArrowKeyHandler.SPACE ||
      event.keyCode == ArrowKeyHandler.A ||
      event.keyCode == ArrowKeyHandler.S ||
      event.keyCode == ArrowKeyHandler.D ||
      event.keyCode == ArrowKeyHandler.Z ||
      event.keyCode == ArrowKeyHandler.X ||
      event.keyCode == ArrowKeyHandler.C ||
      event.keyCode == ArrowKeyHandler.NUM_0 ||
      event.keyCode == ArrowKeyHandler.NUM_1 ||
      event.keyCode == ArrowKeyHandler.NUM_2 ||
      event.keyCode == ArrowKeyHandler.NUM_3 ||
      event.keyCode == ArrowKeyHandler.NUM_4 ||
      event.keyCode == ArrowKeyHandler.NUM_5) {
      event.preventDefault();
    }
  }

});