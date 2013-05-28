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
	this.starCreationTimer = TimeOutFactory.getTimeOut(this.creationTime, -1, this, function(){
		this.createStart();
	});

	this.starCreationTimer.start();
}

StartFactory.prototype.stop = function() {
	this.starCreationTimer.stop();
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