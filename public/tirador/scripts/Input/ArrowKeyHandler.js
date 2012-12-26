$(function(){
  var ArrowKeyHandler = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,

    keyUpListeners: [],

    addKeyUpCallback: function(callback) {
      this.keyUpListeners.push(callback);
    },

    removeKeyUpCallback: function(callback) {
      this.keyUpListeners.splice(this.keyUpListeners.indexOf(callback), 1);
    },

    isDown: function(keyCode) {
      return this._pressed[keyCode];
    },

    onKeydown: function(event) {
      this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
      for(var i=0; i<this.keyUpListeners.length; i++){
        this.keyUpListeners[i](event.keyCode);
      }

      delete this._pressed[event.keyCode];
    }

  };

  window.ArrowKeyHandler = ArrowKeyHandler;

  window.addEventListener('keyup', function(event) { ArrowKeyHandler.onKeyup(event); }, false);
  window.addEventListener('keydown', function(event) { ArrowKeyHandler.onKeydown(event); }, false);  

  // disable vertical scrolling from arrows
  document.onkeydown=function(){return event.keyCode!=ArrowKeyHandler.LEFT && 
                                       event.keyCode!=ArrowKeyHandler.UP  && 
                                       event.keyCode!=ArrowKeyHandler.RIGHT && 
                                       event.keyCode!=ArrowKeyHandler.DOWN &&
                                       event.keyCode!=ArrowKeyHandler.SPACE};   
});