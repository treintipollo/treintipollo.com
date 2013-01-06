function Debry(x, y, container) {
	this.x 		   = x;
	this.y 		   = y;
	this.container = container;
	
	this.vertexCount = Random.getRandomInt(5, 10);
	this.radius 	 = Random.getRandomInt(4, 6);
	this.blastRadius = Random.getRandomInt(70, 80);
	this.blastAngle  = Random.getRandomInt(0, 360) * (Math.PI/180);

	this.points 	 = [];

	var angle = (360 / this.vertexCount) * (Math.PI/180);

	for(var i=0; i<this.vertexCount; i++){
		var p = {x: Math.cos(i*angle) * this.radius + (Random.getRandomInt(1, 2) * Random.getRandomBetweenToValues(-1, 1)),
				 y: Math.sin(i*angle) * this.radius + (Random.getRandomInt(1, 2) * Random.getRandomBetweenToValues(-1, 1))};

		this.points.push(p);
	}

	var inst = this;

	var endPos = {x: x + Math.cos(this.blastAngle) * this.blastRadius,
			   	  y: y + Math.sin(this.blastAngle) * this.blastRadius};

	TweenMax.to(inst, 0.4, {x:endPos.x , y:endPos.y, ease:Power2.easeOut, onComplete:function(){
		inst.alive = false;
	}});

	this.collider = new SAT.Circle(new SAT.Vector(0, 0), this.radius);
}

Debry.inheritsFrom( GameObject );

Debry.prototype.setStyles = function(context) { 	
	context.strokeStyle = "#FFFFFF";
}

Debry.prototype.draw = function(context) { 	
	context.beginPath();
	
	context.moveTo(this.points[0].x, this.points[0].y);

	for(var i=1; i<this.vertexCount; i++){
		context.lineTo(this.points[i].x, this.points[i].y);
	}

	context.closePath();
}

Debry.prototype.destroy = function() {
	this.container.add(new Explosion(this.x, this.y, Random.getRandomInt(0, 360), this.radius, 5), 2);
	TweenMax.killTweensOf(this);
}

Debry.prototype.setFills = function(context) { 	
	context.stroke();
}

Debry.prototype.getColliderType = function(){
	return GameObject.CIRCLE_COLLIDER;
}

Debry.prototype.getCollider = function(){
	this.collider.pos.x = this.x + this.centerX;
	this.collider.pos.y = this.y + this.centerY;

	return this.collider;
}

Debry.prototype.getCollisionId = function(){
	return "Debry";
}

Debry.prototype.onCollide = function(other){
	this.alive = false;
}