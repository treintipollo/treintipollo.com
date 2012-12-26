function ObjectsContainer(drawContext) {
	this.mainObjects  = [];
	this.buffer		  = [];
	
	this.drawContext  = drawContext;
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
	var i, j;
	var a;

	for (i=0; i<this.buffer.length; i++){
		a = this.buffer[i];

		if(a != null && a.length > 0){
			this.mainObjects[i] = this.mainObjects[i].concat(a);
			a.length = 0;
		}
	}

	for (i=0; i<this.mainObjects.length; i++){
		a = this.mainObjects[i];

		if(a != null){
			for (j=a.length-1; j>=0; j--){
				var object = a[j];

				if(object.alive){
					object.update();
				}else{
					
					if(object.destroyMode == GameObject.EXECUTE_CALLBACKS){
						object.executeDestroyCallbacks();
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

ObjectsContainer.prototype.add = function(object, layer) {
	layer = typeof layer !== 'undefined' ? layer : 0;

	if(this.buffer[layer] == null){
		this.buffer[layer] = [];
		this.mainObjects[layer] = [];			
	}

	this.buffer[layer].push(object);
}

ObjectsContainer.prototype.clearCanvas = function(context) {
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0,0,context.canvas.width,context.canvas.height);
	context.restore();
}	