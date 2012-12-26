function Explosion(x, y, angle, size, destroySpeed) {
	this.x 	    	 = x;
	this.y 	    	 = y;
	this.radius 	 = size;
	this.innerRadius = 0;
	this.step  		 = 1/size * destroySpeed;

	this.innerRadiusDirX = Math.cos(angle * (Math.PI/180));
	this.innerRadiusDirY = Math.sin(angle * (Math.PI/180));

	this.gradient = null;
};

Explosion.inheritsFrom( GameObject );

Explosion.prototype.setStyles = function(context) {}

Explosion.prototype.draw = function(context) {
	if(this.gradient == null){
		this.gradient = context.createRadialGradient((this.radius*2/3)*this.innerRadiusDirX, (this.radius*2/3)*this.innerRadiusDirY, this.radius/5, 0, 0, this.radius);

		this.gradient.addColorStop(0.01, "#FF0000");
		this.gradient.addColorStop(1, "#FFFF00");
	} 

	context.fillStyle = this.gradient;
	
	context.beginPath();
	context.arc(0, 0, this.radius, 0, Math.PI*2, true);
	context.closePath();

	context.fill();

	context.strokeStyle = "#FFFF00";
	context.fillStyle = "#000000";

	context.beginPath();
	context.moveTo(0, 0);
	context.arc((this.radius*this.innerRadiusDirX)-(this.innerRadius*this.innerRadiusDirX), 
		(this.radius*this.innerRadiusDirY)-(this.innerRadius*this.innerRadiusDirY), 
		this.innerRadius, 0, Math.PI*2, false);
	context.closePath();

	context.fill();
}

Explosion.prototype.setFills  = function(context) {}

Explosion.prototype.update  = function() {
	this.innerRadius += this.step;

	if(this.innerRadius >= this.radius){
		this.alive = false;
	}
}