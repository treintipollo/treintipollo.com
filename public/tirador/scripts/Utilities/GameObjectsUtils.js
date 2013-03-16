function CircleCollider() {}

CircleCollider.prototype.create = function(){
	this.collider = new SAT.Circle(new SAT.Vector(0, 0), 0);

	this.constructor.prototype.getColliderType = function(){
		return GameObject.CIRCLE_COLLIDER;
	}

	this.constructor.prototype.getCollider = function(){
		this.collider.pos.x = this.x + this.centerX;
		this.collider.pos.y = this.y + this.centerY;
		return this.collider;
	}
}

CircleCollider.prototype.init = function(radius){
	this.collider.r = radius;
}

function Line() {}

Line.inheritsFrom( GameObject );

Line.prototype.init = function(start, end, color, thickness){
	this.start     = start;
	this.end       = end;
	this.color     = color;
	this.thickness = thickness;
}

Line.prototype.draw = function(context){
	context.strokeStyle = this.color;
	context.lineWidth   = this.thickness;

	context.beginPath();
	context.moveTo(this.start.x, this.start.y);
	context.lineTo(this.end.x, this.end.y);
	context.closePath();

	context.stroke();	
}