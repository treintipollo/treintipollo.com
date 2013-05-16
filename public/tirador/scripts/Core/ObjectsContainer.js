function ObjectsContainer(drawContext) {
	this.mainObjects    = [];

	this.collisionLists = {};
	this.toCollideCache	= {};

	this.drawContext  = drawContext;

	this.collisionList;
	this.collisionOpponent;
	this.collisionId;

	this.objectPools    = {};
	this.configurations = {};
}

ObjectsContainer.prototype.draw = function() {
	this.drawContext.setTransform(1, 0, 0, 1, 0, 0);
	this.drawContext.clearRect(0,0,this.drawContext.canvas.width,this.drawContext.canvas.height);

	for (var i=this.mainObjects.length-1; i>=0; i--){
		var a = this.mainObjects[i];

		if(a != null){
			for (var j=0; j<a.length; j++){
				var object = a[j];

				if(object.alive){
					object.transformAndDraw(this.drawContext);
				}				
			}
		}
	}
}

ObjectsContainer.prototype.update = function(delta) {
	var i, j, k, a;
	
	for (i=0; i<this.mainObjects.length; i++){
		a = this.mainObjects[i];

		if(a != null){
			for (j=a.length-1; j>=0; j--){
				var object = a[j];

				if(object.alive){
					object.update(delta);

					if(!object.checkingCollisions) continue;

					this.collisionId = object.getCollisionId();

					this.collisionList = this.collisionLists[this.collisionId];

					if(this.collisionList != null){
						for(k=0; k<this.collisionList.length; k++){
							this.collisionOpponent = this.collisionList[k];

							if(this.collisionOpponent.alive){
								if(this.areColliding(object, this.collisionOpponent)){
									
									if(!object.checkingCollisions) break;

									object.onCollide(this.collisionOpponent);	
									if(object.onCollideDelegate != null){
										object.executeOnCollideCallbacks(this.collisionOpponent);
									}

									if(!object.checkingCollisions) break;

									this.collisionOpponent.onCollide(object);
									if(this.collisionOpponent.onCollideDelegate != null){
										this.collisionOpponent.executeOnCollideCallbacks(object);
									}
								}
							}
						}	
					}
					
				}else{
					if(object.checkingCollisions){
						this.collisionId = object.getCollisionId();

						var indexes = this.toCollideCache[this.collisionId];

						if(indexes != null && indexes.length > 0){
							for(var i=0; i<indexes.length; i++){
								this.collisionLists[indexes[i]].splice(this.collisionLists[indexes[i]].indexOf(object), 1);
							}
						}
					}

					object.clearGameObject();
					
					this.objectPools[object.poolId].push(object);

					a.splice(j, 1);
					object = null;
				}				
			}
		}
	}
}

ObjectsContainer.prototype.add = function(name, args) {
	var configuration = this.configurations[name];

	var type 		   = configuration.type;
	var collisionType  = configuration.collisionType;
	var layer 		   = configuration.layer;
	var checkCollision = configuration.collide;
	var addMode 	   = configuration.addMode;
	var initCall       = configuration.initCall;
	var hardArguments  = configuration.hardArguments;

	//Create drawing layer if it doesn't exist
	if(this.mainObjects[layer] == null){
		this.mainObjects[layer] = [];			
	}

	//Do nothing if there is no object available in the pool I am looking in
	if(this.objectPools[type].length <= 0){
		return null;
	}

	//Get one object from the pool
	var pooledObject = this.objectPools[type].pop();

	pooledObject.typeId      = name;
	//This id will be used for collision detection groups
	pooledObject.collisionId = collisionType;
	//This sets if the object will check for collisions or not
	pooledObject.checkingCollisions = (collisionType != "");

	//Add it to its rendering layer. To the end or the beggining of the list, depending of the configuration
	this.mainObjects[layer][addMode](pooledObject);
	
	//This sets unchanging arguments (hard), specified on the configuration object.
	if(hardArguments){
		for(var ha in hardArguments) {
			pooledObject[ha] = hardArguments[ha];
		}	
	}

	//Initialize it with given arguments. Arguments are passes as a single object or a list depending on configuration. Look up APPLY and CALL
	pooledObject.init[initCall](pooledObject, args);

	//Nasty logic to add an object to the corresponding collision checking lists
	if(pooledObject.checkingCollisions){
		this.collisionId = pooledObject.getCollisionId();

		var indexes = this.toCollideCache[this.collisionId];

		if(indexes != null && indexes.length > 0){
			for(var i=0; i<indexes.length; i++){
				this.collisionLists[indexes[i]].push(pooledObject);
			}
		}
	}

	return pooledObject;
}

ObjectsContainer.prototype.removeAll = function () {
	var configuration;

	for (var i=0; i<this.mainObjects.length; i++){
		var a = this.mainObjects[i];

		if(a != null){
			for (var j=a.length-1; j>=0; j--){
				var object = a[j];

				configuration = this.configurations[object.typeId];

				if(!configuration.doNotDestroy){
					object.setDestroyMode(GameObject.NO_CALLBACKS);
				}
			}
		}
	}	
}

ObjectsContainer.prototype.addCollisionPair = function (first, second) {	
	if(this.collisionLists[first] == null){
		this.collisionLists[first] = [];
	}

	if(this.toCollideCache[second] == null){
		this.toCollideCache[second] = [];
	}

	this.toCollideCache[second].push(first);
}

ObjectsContainer.prototype.areColliding = function (first, second) {	
	var firstColliderType  = first.getColliderType();
	var secondColliderType = second.getColliderType();

	var first = first.getCollider();
	var second = second.getCollider();

	if(first == null || second == null){
		return false;
	}

	if(firstColliderType == secondColliderType){
		if(firstColliderType == GameObject.CIRCLE_COLLIDER){
			return SAT.testCircleCircle(first, second);
		}
		if(firstColliderType == GameObject.POLYGON_COLLIDER){
			return SAT.testPolygonPolygon(first, second);
		}	
	}else{
		if(firstColliderType == GameObject.CIRCLE_COLLIDER){
			return SAT.testPolygonCircle(second, first);
		}
		if(firstColliderType == GameObject.POLYGON_COLLIDER){	
			return SAT.testPolygonCircle(first, second);
		}
	}

	return false;	
}	

ObjectsContainer.prototype.createTypePool = function(alias, type, amount) {
	if(this.objectPools[alias] == null){
		this.objectPools[alias] = [];
	}

	for(var i=0; i<amount; i++){
		var o = new type();
		
		o.afterCreate();

		o.poolId = alias;
		this.objectPools[alias].push(o);
	}
}

ObjectsContainer.PUSH    = "push";
ObjectsContainer.UNSHIFT = "unshift";
ObjectsContainer.CALL    = "call";
ObjectsContainer.APPLY   = "apply";

ObjectsContainer.prototype.setDefaultLayer = function(layerIndex) {
	this.defaultLayer = layerIndex;
}

ObjectsContainer.prototype.createTypeConfiguration = function(typeAlias, type) {
	var configuration = {type:type, 
						 layer:this.defaultLayer, 
						 collisionType:"", 
						 addMode:"push", 
						 initCall:"apply", 
						 hardArguments:null,
						 doNotDestroy:false,

						 collisionId:function(cType) { this.collisionType = cType; return this; },
						 addMode:function(aMode) { this.addMode = aMode; return this; },
						 init:function(iCall) { this.initCall = iCall; return this; },
						 args:function(args) { this.hardArguments = args; return this; },
						 saveOnReset:function() {this.doNotDestroy = true; return this; },
						 layer:function(offset) {this.layer += offset; return this; }

	};

	this.configurations[typeAlias] = configuration;

	return configuration;
}