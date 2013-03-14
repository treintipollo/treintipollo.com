PowerShot.inheritsFrom( Attributes );

function PowerShot() {
	if (typeof ShotChargeRadius === "undefined") { return; }
	if (typeof ShotCharge 		=== "undefined") { return; }

	this.trailEffect = new ShotChargeRadius(this, 0, 0, 90, 30, -1);
	this.hitEffect   = new ShotCharge(this, 0, 0, 0, 360, 50, 30);
}

PowerShot.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

PowerShot.prototype.init = function(user, container, vertexCount, speed, radius, innerRadius, offsetX, offsetY, color) { 	
	CircleCollider.prototype.init.call(this, radius);

	Attributes.prototype.init.call(this);	

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
	
	this.trailEffect.init(container, 30, this.color, 3, "BurstParticleRadius", 5, 100, 300, this.innerRadius);
	this.hitEffect.init(container, 1, this.color, 3, "BurstParticle", 5);

	this.trailEffect.off();
	this.hitEffect.off();
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

PowerShot.prototype.destroy = function() { 	
	this.trailEffect.off();
	this.hitEffect.on();
}

PowerShot.prototype.release = function() { 	
	this.onHold = false;
	this.trailEffect.on();
}

PowerShot.prototype.onHPDiminished = function(other) {}
PowerShot.prototype.onDamageBlocked = function(other) {}
PowerShot.prototype.onDamageReceived = function(other) {}
PowerShot.prototype.onAllDamageReceived = function(other) {
	this.alive = false;
}

PowerShotSine.inheritsFrom( PowerShot );

function PowerShotSine() {
	PowerShot.call(this);	
}

PowerShotSine.prototype.init = function(user, container, vertexCount, speed, radius, innerRadius, offsetX, offsetY, color, side) {
	PowerShot.prototype.init.call(this, user, container, vertexCount, speed, radius, innerRadius, offsetX, offsetY, color);

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

PowerShotCircle.inheritsFrom( PowerShot );

function PowerShotCircle() {
	PowerShot.call(this);
}

PowerShotCircle.prototype.init = function(user, container, vertexCount, speed, radius, innerRadius, angle, distance, color, rotationCenterX, rotationCenterY) {
	PowerShot.prototype.init.call(this, user, container, vertexCount, speed, radius, innerRadius, 0, 0, color);

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
		this.rCenterY -= this.speed*delta;
		
		if(this.y < -this.radius){
			this.alive = false;
		}
	}

	this.x = this.rCenterX + Math.cos((this.frameCount * (Math.PI/180)) + this.initAngle ) * this.distance;
	this.y = this.rCenterY + Math.sin((this.frameCount * (Math.PI/180)) + this.initAngle ) * this.distance;

	this.frameCount += 6;
	this.rotation   += 10;
}