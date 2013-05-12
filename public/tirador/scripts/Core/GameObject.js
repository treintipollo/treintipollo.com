function GameObject() {
	this.x 		  = 0;
	this.y 		  = 0;
	this.centerX  = 0;
	this.centerY  = 0;
	this.rotation = 0;
	this.scaleX   = 1;
	this.scaleY   = 1;

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

GameObject.prototype.destroyWithCallbacks = function(){
	this.alive 		 = false;
	this.destroyMode = GameObject.EXECUTE_CALLBACKS;
}

GameObject.prototype.destroyWithOutCallBacks = function(){
	this.alive 		 = false;
	this.destroyMode = GameObject.NO_CALLBACKS;
}

GameObject.prototype.addCallback = function(delegateName, scope, callback, removeOnExecute) {
	if(!this[delegateName]){ this[delegateName] = []; }

	this[delegateName].push({scope:scope, callback:callback, removeOnExecute:removeOnExecute});
}

GameObject.prototype.executeCallbacks = function(delegateName, args, onComplete) {
	if(!this[delegateName]){ return; }

	for(var i=0; i<this[delegateName].length; i++){
		var callbackObject = this[delegateName][i];
		
		if(!callbackObject) {
			continue;
		}

		callbackObject.callback.call(callbackObject.scope, args);	

		if(callbackObject.removeOnExecute){
			this[delegateName][i] = null;		
		}
	}

	if(onComplete){
		onComplete();
	}
}

GameObject.prototype.removeCallback = function(delegateName, callback) {
	var delegate = this[delegateName];

	if(!delegate){ return; }

	for(var i=0; i<delegate.length; i++){
		var callbackObject = delegate[i];

		if(callbackObject.callback === callback){
			delegate.splice(i, 1);
		}			
	}	
}

GameObject.prototype.destroyCallbacks = function(delegateName) {
	if(this[delegateName]) { this[delegateName].lenght = 0; this[delegateName] = null; }
}

GameObject.prototype.addOnRecicleCallback = function(scope, callback) { this.addCallback("onRecicleDelegate", scope, callback); }
GameObject.prototype.addOnDestroyCallback = function(scope, callback) { this.addCallback("onDestroyDelegate", scope, callback); }
GameObject.prototype.addOnCollideCallback = function(scope, callback) { this.addCallback("onCollideDelegate", scope, callback); }
GameObject.prototype.addInitCallback 	  = function(scope, callback) { 
	this.addCallback("onInitDelegate", scope, callback); 
	callback.call(scope, this);
}

GameObject.prototype.executeDestroyCallbacks   = function()      { this.executeCallbacks("onDestroyDelegate", this);  }
GameObject.prototype.executeOnCollideCallbacks = function(other) { this.executeCallbacks("onCollideDelegate", other); }
GameObject.prototype.executeOnRecicleCallbacks = function(other) { this.executeCallbacks("onRecicleDelegate", this); }

GameObject.prototype.removeAllCallbacks = function() {
	this.destroyCallbacks("onDestroyDelegate");
	this.destroyCallbacks("onCollideDelegate");
	this.destroyCallbacks("onInitDelegate"   );
	this.destroyCallbacks("onRecicleDelegate");
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
	if(this.destroyMode == GameObject.EXECUTE_CALLBACKS){
		this.executeCallbacks("onDestroyDelegate", this);
	}

	this.executeCallbacks("onRecicleDelegate", this);

	this.removeAllCallbacks();

	this.alive 		 = true;
	this.destroyMode = GameObject.EXECUTE_CALLBACKS;
	this.scaleX      = 1;
	this.scaleY      = 1;

	this.destroy();
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
GameObject.prototype.getPoolId      = function(){ return this.poolId; }
GameObject.prototype.getTypeId      = function(){ return this.typeId; }

