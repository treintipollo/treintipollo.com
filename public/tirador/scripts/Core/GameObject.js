
function GameObject() {
	this.x 		  = 0;
	this.y 		  = 0;
	this.centerX  = 0;
	this.centerY  = 0;
	this.rotation = 0;
	this.alive	  = true;
	this.onDestroy;

	this.destroyMode = GameObject.EXECUTE_CALLBACKS;
};

GameObject.EXECUTE_CALLBACKS = 0;
GameObject.NO_CALLBACKS      = 1;

GameObject.prototype.addOnDestroyCallback = function(scope, callback) {
	if(this.onDestroy == null){
		this.onDestroy = [];
	}

	this.onDestroy.push({scope:scope, callback:callback});
}

GameObject.prototype.removeAllCallbacks = function() {
	if(this.onDestroy == null){
		return;
	}

	this.onDestroy.lenght = 0;
}

GameObject.prototype.executeDestroyCallbacks = function() {
	if(this.onDestroy == null){
		return;
	}

	for(var i=0; i<this.onDestroy.length; i++){
		var callbackObject = this.onDestroy[i];
		callbackObject.callback.call(callbackObject.scope, this)		
	}
}

GameObject.prototype.transformAndDraw = function(context, drawFunction) {
	//Esto es para guardar la transformacion actual
	context.save();
	//Traslado lo que voy a dibujar
	context.translate(this.x, this.y);
	
	//Esto es para que roten desde el centro
	if(this.rotation != 0){
		context.translate( this.centerX, this.centerY );
		context.rotate(this.rotation*Math.PI/180);
		context.translate( -this.centerX, -this.centerY );
	}	

	//Hago las operaciones de dibujado correspondientes
	drawFunction.call(this, context);

	//Restauro la matriz de transformacion del canvas para que se vea todo bien
	context.restore();
}

GameObject.prototype.setStyles = function(context) {}
GameObject.prototype.setFills = function(context) {}

GameObject.prototype.draw    = function(context) {}
GameObject.prototype.update  = function() {}

GameObject.prototype.setDestroyMode = function(mode) {
	this.destroyMode = mode;
	this.alive 		 = false;
}

GameObject.prototype.destroy = function() {}


