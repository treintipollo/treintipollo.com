function Star() {}
Star.inheritsFrom( GameObject );

Star.prototype.init = function(x, y, speed) {
	this.x     = x;
	this.y     = y;
	this.speed = speed;
	this.type  = Math.floor(Math.random() * 4); 
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
	this.y += this.speed * delta;

	if(this.y > 850){
		this.alive = false;
	}
}

function StartFactory(maxWidth, maxHeight, starSpeedMin, starSpeedMax, creationTime, creationCount, container) {
	this.maxWidth      = maxWidth;
	this.maxHeight     = maxHeight;
	this.container     = container;
	this.starMinSpeed  = starSpeedMin;
	this.starMaxSpeed  = starSpeedMax;
	this.creationTime  = creationTime;
	this.creationCount = creationCount;

	this.starArguments = [];
}

StartFactory.prototype.start = function() {
	var starCreationTimer = TimeOutFactory.getTimeOut(this.creationTime, -1, this, function(){
		this.createStart();
	});

	starCreationTimer.start();
}

StartFactory.prototype.createStart = function() {
	var createAmount = Math.ceil(Math.random() * this.creationCount); 

	for (var k=0; k<createAmount; k++) {
		this.starArguments[0] = Math.floor(Math.random() * this.maxWidth);
		this.starArguments[1] = 0;
		this.starArguments[2] = Random.getRandomInt(this.starMinSpeed, this.starMaxSpeed);

		this.container.add("Star", this.starArguments);
	};
}