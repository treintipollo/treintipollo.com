function GameObject() {
	this.x 		  = 0;
	this.y 		  = 0;
	this.centerX  = 0;
	this.centerY  = 0;
	this.rotation = 0;
	this.scaleX   = 1;
	this.scaleY   = 1;

	this.onDestroy;

	this.alive = true;
	this.typeId;
	this.collisionId;
	this.poolId;
	this.checkingCollisions;

	this.destroyMode = GameObject.EXECUTE_CALLBACKS;

	this.doTranslation = true;
	this.doRotation    = true;
	this.doScaling     = true;
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

GameObject.prototype.transformAndDraw = function(context) {
	//Esto es para guardar la transformacion actual
	context.save();
	//Traslado lo que voy a dibujar
	if(this.doTranslation){
		context.translate(this.x, this.y);
	}
	
	//Esto es para aplicar las tranformaciones desde el centro definido
	if( (this.rotation != 0 && this.doRotation) || ( (this.scaleX != 1 || this.scaleY != 1) && this.doScaling) ){
		context.translate(this.centerX, this.centerY);
		
		if(this.rotation != 0 && this.doRotation) {
			context.rotate(this.rotation*Math.PI/180);
		}

		if( (this.scaleX != 1 || this.scaleY != 1) && this.doScaling ){
			context.scale(this.scaleX,this.scaleY);
		}
		
		context.translate(-this.centerX, -this.centerY);
	}	

	this.draw(context);

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
	this.scaleX      = 1;
	this.scaleY      = 1;

	this.destroy();
}

GameObject.prototype.destroyWithOutCallBacks = function(){
	this.alive 		 = false;
	this.destroyMode = GameObject.NO_CALLBACKS;
}

GameObject.prototype.afterCreate = function(){}
GameObject.prototype.init        = function(){}
GameObject.prototype.update      = function(delta){}
GameObject.prototype.destroy     = function(){}
GameObject.prototype.draw        = function(context){}

GameObject.CIRCLE_COLLIDER  = 1;
GameObject.POLYGON_COLLIDER = 2;

GameObject.prototype.onCollide = function(other){}
GameObject.prototype.getColliderType = function(){}
GameObject.prototype.getCollider = function(){}
GameObject.prototype.getCollisionId = function(){ return this.collisionId; }

