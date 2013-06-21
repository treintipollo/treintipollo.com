function StartFactory(maxWidth, maxHeight, starSpeedMin, starSpeedMax, creationTime, creationCount, container) {
	this.maxWidth      = maxWidth;
	this.maxHeight     = maxHeight;
	this.container     = container;
	this.starMinSpeed  = starSpeedMin;
	this.starMaxSpeed  = starSpeedMax;
	this.creationTime  = creationTime;
	this.creationCount = creationCount;

	this.starArguments = [];
	this.stars 		   = [];
	this.baseSpeed     = 1;
}

StartFactory.prototype.start = function() {
	this.starCreationTimer = TimeOutFactory.getTimeOut(this.creationTime, -1, this, function(){
		this.createStart();
	});

	this.starCreationTimer.start();
}

StartFactory.prototype.stop = function() {
	this.speedDown();
	this.starCreationTimer.stop();

	console.log(this.starCreationTimer);
}

StartFactory.prototype.speedUp = function() {
	this.starCreationTimer.resetNewDelayAndRepeateCount(this.creationTime * 0.2, -1);

	for(var i=0; i<this.stars.length; i++){
		this.stars[i].baseSpeed = 5;
	}

	this.baseSpeed = 5;
}

StartFactory.prototype.speedDown = function() {
	this.starCreationTimer.resetNewDelayAndRepeateCount(this.creationTime, -1);

	for(var i=0; i<this.stars.length; i++){
		this.stars[i].baseSpeed = 1;
	}

	this.baseSpeed = 1;
}

StartFactory.prototype.createStart = function() {
	var createAmount = Math.ceil(Math.random() * this.creationCount); 

	for (var k=0; k<createAmount; k++) {
		this.starArguments[0] = Math.floor(Math.random() * this.maxWidth);
		this.starArguments[1] = 0;
		this.starArguments[2] = Random.getRandomInt(this.starMinSpeed, this.starMaxSpeed) * this.baseSpeed;

		var s = this.container.add("Star", this.starArguments);
		
		this.stars.push(s);

		s.addOnRecicleCallback(this, function(star){
			this.stars.splice(this.stars.indexOf(star), 1);
		});
	};
}