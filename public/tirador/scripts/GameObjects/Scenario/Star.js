function Star() {}
Star.inheritsFrom( GameObject );

Star.prototype.init = function(x, y, speed) {
	this.x         = x;
	this.y         = y;
	this.speed     = speed;
	this.baseSpeed = 1;
	this.type      = Math.floor(Math.random() * 4); 
}

Star.prototype.draw = function(context) { 	
	context.strokeStyle = "#FFFFFF";

	context.beginPath();
	
	if(this.type == 0){
		context.moveTo(0, -10);	
		context.lineTo(0, 10);

		context.moveTo(-10, 0);
		context.lineTo(10, 0);

		context.moveTo(-5, -5);
		context.lineTo(5, 5);

		context.moveTo(5, -5);
		context.lineTo(-5, 5);
	}

	if(this.type == 1){
		context.moveTo(0, -5);	
		context.lineTo(0, 5);
		
		context.moveTo(-5, 0);
		context.lineTo(5, 0);		
	}

	if(this.type == 2){
		context.moveTo(-3, -3);
		context.lineTo(3, 3);

		context.moveTo(3, -3);
		context.lineTo(-3, 3);	
	}

	if(this.type == 3){
		context.rect(-1, -1, 2, 2);	
	}

	context.closePath();

	context.stroke();
}

Star.prototype.update = function(delta) {
	this.y += (this.speed * this.baseSpeed) * delta;

	if(this.y > 850){
		this.alive = false;
	}
}