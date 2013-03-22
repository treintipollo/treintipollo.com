function Explosion() {};

Explosion.inheritsFrom( Attributes );

Explosion.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

Explosion.prototype.init = function(x, y, angle, size, destroySpeed, color1, color2) {
	CircleCollider.prototype.init.call(this, size);

	this.parent.init.call(this);

	this.x 	    	 = x;
	this.y 	    	 = y;
	this.radius 	 = size;
	
	this.innerRadius = 0;
	this.step  		 = 1/size * destroySpeed;

	this.color1 = color1 ? color1 : "#FF0000";
	this.color2 = color2 ? color2 : "#FFFF00";

	this.innerRadiusDirX = Math.cos(angle * (Math.PI/180));
	this.innerRadiusDirY = Math.sin(angle * (Math.PI/180));

	this.gradient = null;
}

Explosion.prototype.draw = function(context) {
	if(this.gradient == null){
		this.gradient = context.createRadialGradient((this.radius*2/3)*this.innerRadiusDirX, (this.radius*2/3)*this.innerRadiusDirY, this.radius/5, 0, 0, this.radius);
		this.gradient.addColorStop(0.01, this.color1);
		this.gradient.addColorStop(0.99, this.color2);
	} 

	context.beginPath();

	context.fillStyle = this.gradient;

	context.arc(0, 0, this.radius, 0, Math.PI*2, true);
	
	context.arc((this.radius*this.innerRadiusDirX)-(this.innerRadius*this.innerRadiusDirX), 
				(this.radius*this.innerRadiusDirY)-(this.innerRadius*this.innerRadiusDirY), 
				this.innerRadius, 0, Math.PI*2, false);
	
	context.fill();

	context.closePath();
}

Explosion.prototype.update  = function(delta) {
	this.innerRadius += this.step * (delta*50);

	if(this.innerRadius >= this.radius){
		this.alive = false;
	}
}

Explosion.prototype.onHPDiminished = function(other) {}
Explosion.prototype.onDamageBlocked = function(other) {}
Explosion.prototype.onDamageReceived = function(other) {}
Explosion.prototype.onAllDamageReceived = function(other) {
	this.checkingCollisions = false;
}