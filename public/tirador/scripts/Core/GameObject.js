function GameObject() {
	this.x 		  = 0;
	this.y 		  = 0;
	this.centerX  = 0;
	this.centerY  = 0;
	this.rotation = 0;

	this.onDestroy;

	this.alive = true;
	this.poolId;
	this.checkingCollisions;

	this.destroyMode = GameObject.EXECUTE_CALLBACKS;

	this.doTranslation = true;
	this.doRotation = true;
};

GameObject.EXECUTE_CALLBACKS = 0;
GameObject.NO_CALLBACKS      = 1;

GameObject.prototype.setDestroyMode = function(mode) {
	this.destroyMode = mode;
	this.alive 		 = false;
}

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
	if(this.doTranslation){
		context.translate(this.x, this.y);
	}
	
	//Esto es para que roten desde el centro
	if(this.rotation != 0 && this.doRotation){
		context.translate( this.centerX, this.centerY );
		context.rotate(this.rotation*Math.PI/180);
		context.translate(-this.centerX, -this.centerY );
	}	

	this.draw(context)

	//Restauro la matriz de transformacion del canvas para que se vea todo bien
	context.restore();
}

GameObject.prototype.clearGameObject = function(){
	if(this.onDestroy != null){
		this.onDestroy.lenght = 0;
	}
	
	this.onDestroy 	 = null;
	this.alive 		 = true;
	this.destroyMode = GameObject.EXECUTE_CALLBACKS;

	this.destroy();
}

GameObject.prototype.init    = function(){}
GameObject.prototype.update  = function(delta){}
GameObject.prototype.destroy = function(){}
GameObject.prototype.draw    = function(context){}

GameObject.CIRCLE_COLLIDER  = 1;
GameObject.POLYGON_COLLIDER = 2;

GameObject.prototype.onCollide = function(other){}
GameObject.prototype.getColliderType = function(){}
GameObject.prototype.getCollider = function(){}
GameObject.prototype.getCollisionId = function(){
	return "NONE";
}

