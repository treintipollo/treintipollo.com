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

function BoxCollider() {}

BoxCollider.prototype.create = function(){
	this.collider = new SAT.Box(new SAT.Vector(0,0), 0, 0);

	this.constructor.prototype.getColliderType = function(){
		return GameObject.POLYGON_COLLIDER;
	}

	this.constructor.prototype.getCollider = function(){
		this.collider.pos.x = this.x + this.centerX;
		this.collider.pos.y = this.y + this.centerY;

		return this.collider.toPolygon();
	}
}

BoxCollider.prototype.init = function(width, height){
	this.collider.w = width;
	this.collider.h = height;
}

function PolyCollider() {}

PolyCollider.prototype.create = function(points){
	this.collider = new SAT.Polygon(new SAT.Vector(), points);

	this.constructor.prototype.getColliderType = function(){
		return GameObject.POLYGON_COLLIDER;
	}

	this.constructor.prototype.getCollider = function(){
		this.collider.pos.x = this.x + this.centerX;
		this.collider.pos.y = this.y + this.centerY;

		return this.collider;
	}
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

function PercentageLine() {
	this.currentEnd = {x:0, y:0};
}

PercentageLine.inheritsFrom( GameObject );

PercentageLine.prototype.init = function(start, end, color, thickness, time, onComplete){
	this.start     = start;
	this.end       = end;
	this.color     = color;
	this.thickness = thickness;

	this.percentage = 0;

	TweenMax.to( this, time, { percentage:1, onComplete:function(){
		onComplete();
	}});
}

PercentageLine.prototype.draw = function(context){
	var endX, endY;

	if(this.percentage != 1){
		this.currentEnd.x = NumberUtils.interpolate(this.percentage, this.start.x, this.end.x);
		this.currentEnd.y = NumberUtils.interpolate(this.percentage, this.start.y, this.end.y);
	}else if(this.percentage == 1){
		this.currentEnd.x = this.end.x;
		this.currentEnd.y = this.end.y;
	}else{
		this.currentEnd.x = this.start.x;
		this.currentEnd.y = this.start.y;
	}

	context.strokeStyle = this.color;
	context.lineWidth   = this.thickness;

	context.beginPath();

	context.moveTo(this.start.x, this.start.y);
	context.lineTo(this.currentEnd.x, this.currentEnd.y);

	context.closePath();

	context.stroke();	
}

PercentageLine.prototype.destroy = function(){
	TweenMax.killTweensOf(this);
}