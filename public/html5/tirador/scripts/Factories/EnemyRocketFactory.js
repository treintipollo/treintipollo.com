function EnemyRocketFactory() {
	this.maxWidth  = TopLevel.canvas.width - 20;
	this.maxHeight = TopLevel.canvas.height;
	this.container = TopLevel.container;
	
	this.waves = [];

	this.onWaveComplete = null;
	this.currentWave	= 0;
	
	this.rocketTimer = TimeOutFactory.getTimeOut(-1, -1, this, function(){
		this.createEnemyRocket();
	}); 

	this.rocketTimer.onComplete = function(){
		var wave = this.waves[this.currentWave];
		
		this.currentWave++;

		if(this.currentWave >= this.waves.length){
			this.currentWave = 0;			
		}

		if(wave.callOnComplete){
			this.onWaveComplete();
		}else{
			this.start();
		}
	}
}

EnemyRocketFactory.prototype.addWave = function(rocketTypes, rocketsInWave, startY, minSpeed, maxSpeed, creationTime, rocketsToPowerUp, callOnComplete, powerUpsInWave) {
	var wave = {
		rocketTypes:rocketTypes.split(","),
		powerUpsInWave:powerUpsInWave.split(","),
		rocketsInWave:rocketsInWave,
		minSpeed:minSpeed,
		maxSpeed:maxSpeed,
		creationTime:creationTime,
		rocketsToPowerUp:rocketsToPowerUp,
		rocketsToPowerUpInit:rocketsToPowerUp,
		startY:startY,
		callOnComplete:callOnComplete
	}

	this.waves.push(wave)
}

EnemyRocketFactory.prototype.start = function() {
	var wave = this.waves[this.currentWave];
	
	wave.rocketsToPowerUp = wave.rocketsToPowerUpInit;

	this.rocketTimer.delay 			 = wave.creationTime;
	this.rocketTimer.repeateCount 	 = wave.rocketsInWave;
	this.rocketTimer.initRepeatCount = wave.rocketsInWave;

	this.rocketTimer.stop();
	this.rocketTimer.start();
}

EnemyRocketFactory.prototype.stop = function() {
	this.rocketTimer.stop();

	this.waves 			= [];
	this.onWaveComplete = null;
	this.currentWave	= 0;
}

EnemyRocketFactory.prototype.createEnemyRocket = function() {
	var wave = this.waves[this.currentWave];

	EnemyRocket.EnemryRocketArguments[0] = Random.getRandomArbitary(20, this.maxWidth);
	EnemyRocket.EnemryRocketArguments[1] = wave.startY;
	EnemyRocket.EnemryRocketArguments[2] = Random.getRandomArbitary(wave.minSpeed ,wave.maxSpeed);
	EnemyRocket.EnemryRocketArguments[3] = this.container;

	var rocket = this.container.add(wave.rocketTypes[Random.getRandomInt(0, wave.rocketTypes.length-1)], EnemyRocket.EnemryRocketArguments);

	if(rocket == null){ return; }

	rocket.addOnDestroyCallback(this, function(obj){
		wave.rocketsToPowerUp--;
	
		if(wave.rocketsToPowerUp <= 0){
			TopLevel.powerUpFactory.create(obj.x, obj.y, wave.powerUpsInWave[Random.getRandomInt(0, wave.powerUpsInWave.length-1)], 1, false);
			wave.rocketsToPowerUp = wave.rocketsToPowerUpInit;
		}
	});
}