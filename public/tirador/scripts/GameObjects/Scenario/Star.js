function Star() {
	this.type = Math.floor(Math.random() * 4); 
	this.speed = 0;
}

Star.inheritsFrom( GameObject );

Star.prototype.setStyles = function(context) { 	
	context.strokeStyle = "#FFFFFF";
}

Star.prototype.draw = function(context) { 	
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
}

Star.prototype.update = function() {
	this.y += this.speed;

	if(this.y > 850){
		this.alive = false;
	}
}

Star.prototype.setFills = function(context) { 	
	context.stroke();
}

function StartFactory(maxWidth, maxHeight, starSpeed, creationTime, creationCount, container) {
	this.maxWidth      = maxWidth;
	this.maxHeight     = maxHeight;
	this.container     = container;
	this.starMaxSpeed  = starSpeed;
	this.creationTime  = creationTime;
	this.creationCount = creationCount;
}

StartFactory.prototype.start = function() {
	var factory = this;

	setInterval(function() {
		factory.createStart()	
	} , this.creationTime);
}

StartFactory.prototype.createStart = function() {
	var createAmount = Math.ceil(Math.random() * this.creationCount); 
	var star;

	for (var k=0; k<createAmount; k++) {
		star = new Star();

		star.x = Math.random() * this.maxWidth;
		star.y = 0;
		star.speed = Math.ceil(Math.random() * this.starMaxSpeed); 

		this.container.add(star, 4);
	};
}