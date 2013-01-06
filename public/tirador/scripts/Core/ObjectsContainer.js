function ObjectsContainer(drawContext) {
	this.mainObjects    = [];

	this.collisionLists = {};
	this.toCollideCache	= {};

	this.drawContext  = drawContext;

	this.collisionList;
	this.collisionOpponent;
	this.collisionId;
}

ObjectsContainer.prototype.draw = function() {
	this.clearCanvas(this.drawContext);

	for (var i=this.mainObjects.length-1; i>=0; i--){
		var a = this.mainObjects[i];

		if(a != null){
			for (var j=0; j<a.length; j++){
				var object = a[j];

				if(object.alive){
					object.setStyles(this.drawContext);
					object.transformAndDraw(this.drawContext, object.draw);
					object.setFills(this.drawContext);
				}				
			}
		}
	}
}

ObjectsContainer.prototype.update = function() {
	var i, j, k, a;
	
	for (i=0; i<this.mainObjects.length; i++){
		a = this.mainObjects[i];

		if(a != null){
			for (j=a.length-1; j>=0; j--){
				var object = a[j];

				if(object.alive){
					object.update();

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

					object.destroy();
					DestroyUtils.destroyAllProperties(object);
					object = null;
					a.splice(j, 1);
				}				
			}
		}
	}
}

ObjectsContainer.prototype.add = function(object, layer, checkCollision) {
	layer = typeof layer !== 'undefined' ? layer : 0;
	checkCollision = typeof layer !== 'undefined' ? checkCollision : false;

	if(this.mainObjects[layer] == null){
		this.mainObjects[layer] = [];			
	}

	this.mainObjects[layer].push(object);

	object.checkingCollisions = checkCollision;

	if(object.checkingCollisions){
		this.collisionId = object.getCollisionId();

		if(this.collisionId == "NONE")
			return;

		var indexes = this.toCollideCache[this.collisionId];

		if(indexes != null && indexes.length > 0){
			for(var i=0; i<indexes.length; i++){
				this.collisionLists[indexes[i]].push(object);
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

	if(firstColliderType == secondColliderType){
		if(firstColliderType == GameObject.CIRCLE_COLLIDER){
			return SAT.testCircleCircle(first.getCollider(), second.getCollider());
		}
		if(firstColliderType == GameObject.POLYGON_COLLIDER){
			return SAT.testPolygonPolygon(first.getCollider(), second.getCollider());
		}	
	}else{
		if(firstColliderType == GameObject.CIRCLE_COLLIDER){
			return SAT.testPolygonCircle(second.getCollider(), first.getCollider());
		}
		if(firstColliderType == GameObject.POLYGON_COLLIDER){	
			return SAT.testPolygonCircle(first.getCollider(), second.getCollider());
		}
	}

	return false;	
}

ObjectsContainer.prototype.clearCanvas = function(context) {
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0,0,context.canvas.width,context.canvas.height);
	context.restore();
}	