function PowerShot() {
	this.collider = new SAT.Circle(new SAT.Vector(0, 0), 0);
}

PowerShot.inheritsFrom( GameObject );

PowerShot.prototype.init = function(user,vertexCount, speed, radius, innerRadius, offsetX, offsetY, color, container) { 	
	this.user      = user;
	this.speed     = speed;
	this.onHold    = true;
	this.color     = color;
	this.offsetX   = offsetX;
	this.offsetY   = offsetY;
	this.container = container;

	this.vertexCount = vertexCount;
	this.angle       = 360/this.vertexCount;
	this.radius      = radius;
	this.innerRadius = innerRadius;
	
	this.outerPoints = [];
	this.innerPoints = [];

	for(var i=0; i<this.vertexCount; i++){
		var a  = this.angle*i*(Math.PI/180);
		var ai = ((this.angle*i)+(this.angle/2))*(Math.PI/180);

		this.innerPoints.push({x:Math.cos(ai)*this.innerRadius, y:Math.sin(ai)*this.innerRadius});
		this.outerPoints.push({x:Math.cos(a)*this.radius, y:Math.sin(a)*this.radius});
	}

	this.collider.r = this.radius;
}

PowerShot.prototype.draw = function(context) { 		
	context.strokeStyle = this.color;
	
	context.beginPath();

	for(var i=0; i<this.vertexCount; i++){
					
		context.moveTo(this.outerPoints[i].x, this.outerPoints[i].y);
		
		if(i == this.vertexCount-1){
			context.quadraticCurveTo(this.innerPoints[i].x, this.innerPoints[i].y, this.outerPoints[0].x, this.outerPoints[0].y);
		}else{
			context.quadraticCurveTo(this.innerPoints[i].x, this.innerPoints[i].y, this.outerPoints[i+1].x, this.outerPoints[i+1].y);	
		}

	}	

	context.stroke();
	context.closePath();

	context.beginPath();
	context.arc(0, 0, this.innerRadius, 0, Math.PI*2, false);
	context.closePath();

	context.stroke();
}

PowerShot.prototype.update = function(delta) {
	if(this.onHold){
		this.x = this.user.x + this.offsetX;
		this.y = this.user.y + this.offsetY;
	}else{
		this.y -= this.speed*delta;

		if(this.y < -this.radius){
			this.alive = false;
		}	
	}

	this.rotation += 10;
}

PowerShot.prototype.release = function() { 	
	this.onHold = false;
}

PowerShot.prototype.getColliderType = function(){
	return GameObject.CIRCLE_COLLIDER;
}

PowerShot.prototype.getCollider = function(){
	this.collider.pos.x = this.x + this.centerX;
	this.collider.pos.y = this.y + this.centerY;

	return this.collider;
}

PowerShot.prototype.getCollisionId = function(){
	return "PowerShot";
}

PowerShot.prototype.onCollide = function(other){}

function PowerShotSine() {}

PowerShotSine.inheritsFrom( PowerShot );

PowerShotSine.prototype.init = function(user,vertexCount, speed, radius, innerRadius, offsetX, offsetY, color, container, side) {
	this.parent.init.call(this, user,vertexCount, speed, radius, innerRadius, offsetX, offsetY, color, container);

	this.frameCount = 0;
	this.side = side;
	this.lastX;
}

PowerShotSine.prototype.update = function(delta) {
	if(this.onHold){
		this.x = this.user.x + this.offsetX;
		this.y = this.user.y + this.offsetY;

		this.lastX = this.user.x;
	}else{
		this.x  = this.lastX + this.offsetX + Math.sin(this.frameCount * (Math.PI/180)) * 30;
		this.y -= this.speed * delta;

		this.frameCount += 6*this.side;	

		if(this.y < -this.radius){
			this.alive = false;
		}
	}

	this.rotation += 10;
}

function PowerShotCircle() {}

PowerShotCircle.inheritsFrom( PowerShot );

PowerShotCircle.prototype.init = function(user,vertexCount, speed, radius, innerRadius, angle, distance, color, container, rotationCenterX, rotationCenterY) {
	this.parent.init.call(this, user,vertexCount, speed, radius, innerRadius, 0, 0, color, container);

	this.frameCount = 0;
	this.lastX;
	this.rotationCenterX = rotationCenterX;
	this.rotationCenterY = rotationCenterY;

	this.rCenterX = 0;
	this.rCenterY = 0;

	this.initAngle = angle*(Math.PI/180);
	this.distance  = distance;
}

PowerShotCircle.prototype.update = function(delta) {
	if(this.onHold){
		this.rCenterX = this.user.x + this.rotationCenterX;
		this.rCenterY = this.user.y + this.rotationCenterY;
	}else{
		this.rCenterX -= 0; 
		this.rCenterY -= this.speed*delta;

		if(this.y < -this.radius){
			this.alive = false;
		}
	}

	this.x = this.rCenterX + Math.cos((this.frameCount * (Math.PI/180)) + this.initAngle ) * this.distance;
	this.y = this.rCenterY + Math.sin((this.frameCount * (Math.PI/180)) + this.initAngle ) * this.distance;

	this.frameCount += 6;

	this.rotation += 10;
}