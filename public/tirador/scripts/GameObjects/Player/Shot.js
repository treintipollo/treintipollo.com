function Shot(x, y, big) {
	this.x     = x;
	this.y     = y; 
	this.big   = big;
	this.speed = 7;

	this.collider = new SAT.Circle(new SAT.Vector(0, 0), 10);
}

Shot.inheritsFrom( GameObject );

Shot.prototype.setStyles = function(context) { 	
	context.strokeStyle = "#FFFFFF";
}

Shot.prototype.draw = function(context) { 	
	context.beginPath();
	
	if(this.big){
		context.moveTo(-5, 10);	
		context.lineTo(0, 0);
		context.lineTo(5, 10);
		context.lineTo(0, -3);
	}else{
		context.moveTo(-5, 5);	
		context.lineTo(0, 0);
		context.lineTo(5, 5);
		context.lineTo(0, -3);	
	}
	
	context.closePath();	
}

Shot.prototype.setFills = function(context) { 	
	context.stroke();
}

Shot.prototype.update = function() {
	this.y -= this.speed;

	if(this.y < -20){
		this.alive = false;
	}
}

Shot.prototype.getColliderType = function(){
	return GameObject.CIRCLE_COLLIDER;
}

Shot.prototype.getCollider = function(){
	this.collider.pos.x = this.x;
	this.collider.pos.y = this.y;

	return this.collider;
}

Shot.prototype.getCollisionId = function(){
	return "Shot";
}

Shot.prototype.onCollide = function(other){
	this.alive = false;
}
