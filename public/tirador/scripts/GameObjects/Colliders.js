function CircleCollider() {
	this.collider = new SAT.Circle(new SAT.Vector(0, 0), 0);
}

CircleCollider.inheritsFrom( GameObject );

CircleCollider.prototype.init = function(x, y, radius){
	this.x          = x;
	this.y          = y;
	this.collider.r = radius;
}

CircleCollider.prototype.getColliderType = function(){
	return GameObject.CIRCLE_COLLIDER;
}

CircleCollider.prototype.getCollider = function(){
	this.collider.pos.x = this.x;
	this.collider.pos.y = this.y;
	
	return this.collider;
}

/*function PoligonCollider() {
	this.collider = new SAT.Polygon(new SAT.Vector(0,0), [new SAT.Vector(0,0), new SAT.Vector(0,0), new SAT.Vector(0,0), new SAT.Vector(0,0)]);
}

PoligonCollider.inheritsFrom( GameObject );*/