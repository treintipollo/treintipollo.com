function ObjectsContainer(drawContext) {
	this.mainObjects    = [];

	this.collisionLists = {};
	this.toCollideCache	= {};

	this.drawContext  = drawContext;

	this.collisionList;
	this.collisionOpponent;
	this.collisionId;

	this.objectPools = {};
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
			//for (j=0; j<a.length; j++){
				var object = a[j];

				if(object.alive){
					object.update(delta);

					if(object.checkingCollisions){
						this.collisionId = object.getCollisionId();

						if(this.collisionId != "NONE"){
							this.collisionList = this.collisionLists[this.collisionId];

							if(this.collisionList != null){
								for(k=0; k<this.collisionList.length; k++){
									this.collisionOpponent = this.collisionList[k];

									if(this.collisionOpponent.alive){
										if(this.areColliding(object, this.collisionOpponent)){
											object.onCollide(this.collisionOpponent);	
											this.collisionOpponent.onCollide(object);
										}
									}
								}	
							}
						}
					}

				}else{
					
					if(object.destroyMode == GameObject.EXECUTE_CALLBACKS){
						object.executeDestroyCallbacks();
					}

					if(object.checkingCollisions){
						this.collisionId = object.getCollisionId();

						if(this.collisionId != "NONE"){
							var indexes = this.toCollideCache[this.collisionId];

							if(indexes != null && indexes.length > 0){
								for(var i=0; i<indexes.length; i++){
									this.collisionLists[indexes[i]].splice(this.collisionLists[indexes[i]].indexOf(object), 1);
								}
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

ObjectsContainer.PUSH = "push";
ObjectsContainer.UNSHIFT = "unshift";

ObjectsContainer.prototype.add = function(name, arguments, layer, checkCollision, addMode) {
	//Default parameters
	if(!layer){ layer = 0; }
	if(!checkCollision){ checkCollision = false;}
	if(!addMode){ addMode = ObjectsContainer.PUSH;}

	//Create drawing layer if it doesn't exist
	if(this.mainObjects[layer] == null){
		this.mainObjects[layer] = [];			
	}

	//Do nothing if there is no object available in the pool I am looking in
	if(this.objectPools[name].length <= 0){
		return null;
	}

	//Get one object from the pool
	var pooledObject = this.objectPools[name].pop();
	
	//Add it to its rendering layer
	if(addMode == ObjectsContainer.PUSH){
		this.mainObjects[layer].push(pooledObject);
	}else{
		this.mainObjects[layer].unshift(pooledObject);
	}

	//Initialize it with given arguments
	pooledObject.init.apply(pooledObject, arguments);

	//This sets if the object will check for collisions or not
	pooledObject.checkingCollisions = checkCollision;

	//Nasty logic to add an object to the corresponding collision checking lists
	if(pooledObject.checkingCollisions){
		this.collisionId = pooledObject.getCollisionId();

		if(this.collisionId == "NONE")
			return null;

		var indexes = this.toCollideCache[this.collisionId];

		if(indexes != null && indexes.length > 0){
			for(var i=0; i<indexes.length; i++){
				this.collisionLists[indexes[i]].push(pooledObject);
			}
		}
	}

	return pooledObject;
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
		o.poolId  = alias;
		this.objectPools[alias].push(o);
	}
}